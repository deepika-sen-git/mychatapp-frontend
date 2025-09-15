import React, { useState, useEffect } from 'react';
import { View, Text, SafeAreaView, Keyboard, Alert, ActivityIndicator, } from 'react-native';
import { Formik, FormikHelpers } from 'formik';
import * as Yup from 'yup'; //Importing Formik for form handling and Yup for validation schema.
// import OTPTextInput from 'react-native-otp-textinput';//React Native Component that can used for OTPs and Pins as secure pin input.
import HeaderLeftWithTitle from '../../../components/HeaderLeftWithTitle';
import { useFocusEffect, useTheme } from '@react-navigation/native';
import createCommonStyles from '../../../utils/commonstyles';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../AppNavigator';
import Routes from '../../../utils/Routes';
import styles from './styles';
import CustomOTPInput from '../../../components/UI/CustomOTPInput';
import CustomPlainButton from '../../../components/UI/CustomPlainButton';
import { BACKEND_URL } from '../../../utils/urls';
// import { auth, firestore } from '../../../utils/firebaseConfig';
import { useDispatch, useSelector } from 'react-redux';
// import  resetSignup  from '../../store/slices/authSlice';
import { RootState } from '../../../store';
import { createAccountAndSaveProfile } from '../../../utils/authHelpers';
import { hp } from '../../../utils/globalUse';
import { useStatusBarColor } from '../../../context';
import Colors from '../../../theme/colors';


// Declares the shape of form data.
interface FormValues {
    OTP: string;
}
/*
Yup schema to validate:

Required

Must be 5 characters long
*/
const validationSchema = Yup.object().shape( {
    OTP: Yup.string()
        .required( 'OTP is required' )
        .length( 5, 'OTP must be 5 digits' ),
} );


type Props = NativeStackScreenProps<RootStackParamList, typeof Routes.VERIFY_PHONE>;

export const VerifyPhoneScreen: React.FC<Props> = ( { navigation, route } ) => { // Function component with proper type for navigation prop.
    // const otpInput = useRef<OTPTextInput>( null );
    const { colors } = useTheme();
    const commonstyles = createCommonStyles( colors );
    const { onPhoneFrom, onVerified } = route.params;
     const [ loading, setLoading ] = React.useState( false );
const { setColor } = useStatusBarColor();
    
        useFocusEffect(
            React.useCallback( () => {
                setColor( Colors.lightBG );  
    
            }, [] )
        );
    //Resend button logic: disable for 20 seconds after sending OTP.
    const [ isResendDisabled, setIsResendDisabled ] = useState( true );
    const [ timer, setTimer ] = useState( 20 );
    const dispatch = useDispatch();
    const { email, name, phone, password, imageURL } = useSelector( ( state: RootState ) => state.auth );
    // console.log( imageURL );
    // console.log( 'Flow from:', onPhoneFrom, 'Phone:', phone, timer );

    useEffect( () => {
        let interval: NodeJS.Timeout | undefined;

        if ( isResendDisabled && timer > 0 ) {
            interval = setInterval( () => {
                setTimer( ( prev ) => prev - 1 );
            }, 1000 );
        } else {
            setIsResendDisabled( false );
        }

        return () => {
            if ( interval ) clearInterval( interval );
        };
    }, [ isResendDisabled, timer ] );


    const resendCode = async () => {
        setIsResendDisabled( true );
        setTimer( 20 );
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
        // otpInput.current?.clear();
    };

    const handleSubmit = async ( values: FormValues, actions: FormikHelpers<FormValues> ) => {
        setLoading( true );  // Start loading
        try {
            Keyboard.dismiss();

            // Step 1: Verify OTP from backend
            const res = await fetch( `${ BACKEND_URL }/verify-phone-otp`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify( { phone, otp: values.OTP } ),
            } );

            const data = await res.json();
        
            if ( data.success ) {
               
                console.log( '📞 Phone Verified!' );
                console.log(onPhoneFrom);
                

                if ( onPhoneFrom === 'signup' ) {
                    // Step 2: Generate user code
             
                    const codeRes = await fetch( `${ BACKEND_URL }/generate-usercode`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                    } );
                    const codeData = await codeRes.json();
                    console.log( '✅ Generated userCode:', codeData );

                    if ( codeData.success ) {
                        const userCode = codeData.userCode;

                        // ✅ Use helper
                        await createAccountAndSaveProfile( dispatch, {
                            email,
                            password,
                            name,
                            phone,
                            imageURL,
                            userCode,
                        } );
                        setLoading( false );  // Stop loading
                        navigation.reset( {
                            index: 0,
                            routes: [ { name: Routes.CHATS } ],
                        } );
                    }

                } else if ( onPhoneFrom === 'forgetpassword' ) {
                    // from forgot password flow
                    setLoading( false );  // Stop loading
                    navigation.navigate( Routes.CREATE_NEW_PASSWORD );
                }
                else if ( onPhoneFrom === 'editprofile' ) {
                    // from edit profile flow
                    setLoading( false );  // Stop loading
                    Alert.alert( 'Success', 'Phone number verified successfully!' );
                    if ( onVerified ) {
                        console.log("onVerified...", onVerified);
                        await onVerified();
                    } else {
                        // fallback 
                        navigation.goBack();
                    }
                }

            } else {
                actions.setFieldError( 'OTP', data.message || 'Invalid OTP' );
            }
            setLoading( false );  // Stop loading

        } catch ( error ) {
            console.error( '❌ Error verifying phone or creating user:', error );
            actions.setFieldError( 'OTP', 'Something went wrong. Please try again.' );
        }
    };




    return (
        <SafeAreaView style={ commonstyles.container }>
            <View style={ commonstyles.mainView }>
                <HeaderLeftWithTitle title={ onPhoneFrom === 'signup' ? 'Verify phone number' : 'Enter the code' } onPress={ () => ( onPhoneFrom === 'signup' && navigation.navigate( Routes.GET_STARTED ) || navigation.goBack() ) } />
                <Formik
                    initialValues={ { OTP: '' } }
                    validationSchema={ validationSchema }
                    onSubmit={ handleSubmit }
                >

                    {
                        ( { handleSubmit, errors, touched, values, setFieldValue, setFieldTouched } ) => {
                            useEffect( () => {
                                if ( values.OTP.length === 5 ) {
                                    setFieldTouched( 'OTP', true );
                                    handleSubmit();
                                }
                            }, [ handleSubmit, setFieldTouched, values.OTP ] );


                            return (

                                <>
                                    <Text style={ commonstyles.subHeading }>
                                        We’ve sent an SMS with an activation code to your phone {phone }
                                    </Text>


                                    <CustomOTPInput
                                        value={ values.OTP }
                                        length={5}
                                        // onChangeText={ ( text ) => {
                                        //     setFieldValue( 'OTP', text );
                                        //     if ( text.length === 5 ) {
                                        //         setFieldTouched( 'OTP', true );
                                        //     }
                                        //     if ( text.length === 5 ) {
                                        //         Keyboard.dismiss();
                                        //         // ✅ Mark as touched
                                        //         setTimeout( () => {
                                        //             handleSubmit();
                                        //         }, 0 ); // Let Formik update value before submit
                                        //     }
                                        // } }

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
                                                    <View style={ styles.buttonWrapper }>
                                                        <CustomPlainButton
                                                            title="Send Again"
                                                            containerStyle={ styles.plainButtonContainer }
                                                            textStyle={ styles.plainButton }
                                                            onPress={ resendCode }
                                                        />
                                                    </View>
                                                ) }
                                            </View>
                                    ) }

                                    
                                    {/* <TouchableOpacity onPress={ resendCode }>
                                     <Text style={ [ commonstyles.subHeading, { textDecorationLine: 'underline', marginTop: 15 } ] }>Send code again</Text>
                                    </TouchableOpacity> */}

                                </>
                            )
                        } }

                </Formik>
            </View>
        </SafeAreaView>
    );
};


