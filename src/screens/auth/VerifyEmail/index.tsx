import React, { useEffect } from 'react';
import { View, Text, SafeAreaView, Keyboard, Alert, ActivityIndicator } from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import HeaderLeftWithTitle from '../../../components/HeaderLeftWithTitle';
import { useFocusEffect, useTheme } from '@react-navigation/native';
import createCommonStyles from '../../../utils/commonstyles';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../AppNavigator';
import Routes from '../../../utils/Routes';
import styles from './styles';
import CustomOTPInput from '../../../components/UI/CustomOTPInput';
import CustomPlainButton from '../../../components/UI/CustomPlainButton';
import Colors from '../../../theme/colors';
import useResendTimer from '../../../hooks/useResendTimer';
import { BACKEND_URL } from '../../../utils/urls';
import { useSelector, useDispatch } from 'react-redux';
import { AppDispatch, RootState } from '../../../store';
import {  setEmailVerified, setLoggedIn, setPhoneVerified } from '../../../store/slices/authSlice';
import { fetchFriends } from '../../../store/slices/friendsSlice';
import { fetchGroups } from '../../../store/slices/groupSlice';
import { hp } from '../../../utils/globalUse';
import { useStatusBarColor } from '../../../context';


type Props = NativeStackScreenProps<RootStackParamList, typeof Routes.VERIFY_EMAIL>;

export const VerifyEmailScreen: React.FC<Props> = ( { navigation, route } ) => {
    const { onEmailFrom, onVerified } = route.params;
    const { colors } = useTheme();
    const commonstyles = createCommonStyles( colors );
    const [ loading, setLoading ] = React.useState( false );
    const { setColor } = useStatusBarColor();
        
            useFocusEffect(
                React.useCallback( () => {
                    setColor( Colors.lightBG );  
        
                }, [] )
            );
    

    const { timer, isDisabled: isResendDisabled, resend } = useResendTimer( 20 );
    const { isLoggedIn, email, phone } = useSelector( ( state: RootState ) => state.auth );
    const userEmail = useSelector( ( state: RootState ) => state.user.email );
    // console.log( "userEmail ", userEmail , "email", email);

    const userPhone = useSelector( ( state: RootState ) => state.user.phone );
    const { uid } = useSelector( ( state: RootState ) => state.user );
    const friendsStatus = useSelector( ( state: RootState ) => state.friends.status );

    const groupsStatus = useSelector( ( state: RootState ) => state.groups.status );


    const dispatch = useDispatch<AppDispatch>();
    useEffect( () => {
        if ( isLoggedIn && friendsStatus === 'idle' && uid ) {
            dispatch( fetchFriends( uid ) );
        }
        if ( groupsStatus === 'idle' ) {
            dispatch( fetchGroups( uid ) );
        }
    }, [ uid, dispatch, isLoggedIn, friendsStatus, groupsStatus ] );

    const validationSchema = Yup.object().shape( {
        OTP: Yup.string().required( 'OTP is required' ).length( 5, 'OTP must be 5 digits' ),
    } );

    const verifyOTP = async ( otp: string ) => {
        console.log( userEmail );
        setLoading( true );  // Start loading

        try {
            const res = await fetch( `${ BACKEND_URL }/verify-otp`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify( { email: email || userEmail, otp } ),
            } );
            const data = await res.json();

            if ( data.success ) {

                dispatch( setEmailVerified( true ) );

                console.log( "email verified" );

                if ( onEmailFrom === 'login' ) {
                    console.log( "navigating to chats" );
                    dispatch( setLoggedIn( true ) );
                    dispatch( setPhoneVerified( true ) );
                    // dispatch( clearAuthTempData() );
                    setLoading( false );  // Stop loading
                    navigation.reset( {
                        index: 0,
                        routes: [ { name: Routes.CHATS } ],
                    } );

                } else if ( onEmailFrom === 'signup' ) {
                    // Send phone OTP
                    const phoneRes = await fetch( `${ BACKEND_URL }/send-phone-otp`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify( { phone } ),
                    } );
                    const phoneData = await phoneRes.json();
                    if ( !phoneData.success ) {
                        console.warn( 'Failed to send phone OTP:', phoneData.message );
                    }
                    console.log( phoneData.otp );
                    
                    setLoading( false );  // Stop loading
                    navigation.navigate( Routes.VERIFY_PHONE, { onPhoneFrom: 'signup' } );
                } else if ( onEmailFrom === 'forgetpassword' ) {
                    setLoading( false );  // Stop loading
                    navigation.navigate( Routes.CREATE_NEW_PASSWORD, { onCreateNewPassFrom: 'email' } );
                }
                else if ( onEmailFrom === 'editprofile' ) {
                    // from edit profile flow
                    setLoading( false );  // Stop loading
                    Alert.alert( 'Success', 'Email updated successfully!' );
                    if ( onVerified ) {
                        await onVerified();
                    } else {
                        // fallback (like navigation.goBack)
                        navigation.goBack();
                    }
                }
            } else {
                Alert.alert( 'Invalid OTP', data.message || 'Please try again' );
            }
            setLoading( false );  // Stop loading

        } catch ( error ) {
            console.error( 'Error verifying OTP:', error );
            Alert.alert( 'Error', 'Could not verify OTP' );
        }
    };

    const handleResend = async () => {
        console.log( 'Resend OTP to', email , userEmail );
        
        try {
            const res = await fetch( `${ BACKEND_URL }/send-otp`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify( { email: email || userEmail } ),
            } );
            const data = await res.json();

            if ( data.success ) {
                Alert.alert( 'OTP Sent', 'Check your email!' );
                resend();
            } else {
                Alert.alert( 'Failed', data.message || 'Could not resend OTP' );
            }
        } catch ( error ) {
            console.error( 'Error resending OTP:', error );
            Alert.alert( 'Error', 'Could not resend OTP' );
        }
    };

    return (
        <SafeAreaView style={ commonstyles.container }>
            <View style={ commonstyles.mainView }>
                <HeaderLeftWithTitle
                    title={ onEmailFrom === 'signup' ? 'Verify your email' : 'Enter the code' }
                />

                <Formik
                    initialValues={ { OTP: '' } }
                    validationSchema={ validationSchema }
                    onSubmit={ ( { OTP } ) => {
                        Keyboard.dismiss();
                        verifyOTP( OTP );
                    } }
                >
                    { ( { handleSubmit, errors, touched, values, setFieldValue, setFieldTouched } ) => {
                        useEffect( () => {
                            if ( values.OTP.length === 5 ) {
                                setFieldTouched( 'OTP', true );
                                handleSubmit();
                            }
                        }, [ handleSubmit, setFieldTouched, values.OTP ] );

                        return (
                            <>
                                <Text style={ commonstyles.subHeading }>
                                    We’ve sent an activation code to{ ' \n' }
                                    <Text style={ { color: Colors.black } }>{ email || userEmail }</Text>
                                </Text>

                                <CustomOTPInput
                                    value={ values.OTP }
                                    onChangeText={ ( text ) => setFieldValue( 'OTP', text ) }
                                    error={ touched.OTP && !!errors.OTP }
                                />
                                { touched.OTP && errors.OTP && (
                                    <Text style={ styles.errorText }>{ errors.OTP }</Text>
                                ) }
                                { loading ? (
                                    <View style={ { marginTop: hp( 25 ), alignItems: 'center' } }>
                                        <ActivityIndicator size="large" color={ colors.primary } />
                                    </View>
                                ) : (
                                        <View style={ styles.sendCodeTextContainer }>
                                            <Text style={ styles.sendCodeText }>Send code again </Text>
                                            { isResendDisabled ? (
                                                <Text style={ [ styles.sendCodeText, styles.timerText ] }>
                                                    00:{ timer < 10 ? `0${ timer }` : timer }
                                                </Text>
                                            ) : (
                                                <CustomPlainButton
                                                    title="Send Again"
                                                    containerStyle={ styles.plainButtonContainer }
                                                    textStyle={ styles.plainButton }
                                                    onPress={ handleResend }
                                                />
                                            ) }
                                        </View>
                                ) }
                               
                            </>
                        );
                    } }
                </Formik>
            </View>
        </SafeAreaView>
    );
};

export default VerifyEmailScreen;
