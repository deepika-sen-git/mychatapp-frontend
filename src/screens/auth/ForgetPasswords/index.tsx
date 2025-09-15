import React from 'react';
import { View, Text, SafeAreaView, Keyboard, Alert, ScrollView, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { Formik, FormikHelpers } from 'formik';
import * as Yup from 'yup';
import HeaderLeftWithTitle from '../../../components/HeaderLeftWithTitle';
import { useFocusEffect, useTheme } from '@react-navigation/native';
import createCommonStyles from '../../../utils/commonstyles';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../AppNavigator';
import Routes from '../../../utils/Routes';
import CustomTextInput from '../../../components/UI/CustomTextInput';
import CustomButton from '../../../components/UI/CustomButton';
import CustomPlainButton from '../../../components/UI/CustomPlainButton';
import styles from './styles';
import { hp } from '../../../utils/globalUse';
import { useDispatch } from 'react-redux';
import { setAuthInfo, setAuthUser } from '../../../store/slices/authSlice';
import { BACKEND_URL } from '../../../utils/urls';
import { auth } from '../../../utils/firebaseConfig';
import { checkUserExists } from '../../../utils/checkUserExists';
import { useStatusBarColor } from '../../../context';
import Colors from '../../../theme/colors';

interface FormValues {
    input: string; // phone or email
}

const validationSchema = Yup.object().shape( {
    input: Yup.string()
        .required( 'Phone or Email is required' )
        .test( 'is-valid', 'Enter a valid email or phone number', value => {
            if ( !value ) return false;
            const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
            const phoneRegex =  /^\+[1-9]\d{7,14}$/;
            return emailRegex.test( value ) || phoneRegex.test( value );
        } ),
} );

type Props = NativeStackScreenProps<RootStackParamList, typeof Routes.FORGET_PASSWORD>;

export const ForgetPasswordScreen: React.FC<Props> = ( { navigation } ) => {
    const { colors } = useTheme();
    const commonstyles = createCommonStyles( colors );
    const dispatch = useDispatch();
    const [ loading, setLoading ] = React.useState( false );
    const { setColor } = useStatusBarColor();
        
            useFocusEffect(
                React.useCallback( () => {
                    setColor( Colors.lightBG );  
        
                 
                }, [] )
            );

    const handleSubmit = async ( values: FormValues, actions: FormikHelpers<FormValues> ) => {
        setLoading( true );  // Start loading
        Keyboard.dismiss();
        const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
        const phoneRegex =  /^\+[1-9]\d{7,14}$/;
        // Check if input is a valid phone or email
        if ( phoneRegex.test( values.input ) ) {
            const { exists } = await checkUserExists( values.input );
            if ( !exists ) {
                setLoading( false );  // Stop loading
                console.warn( 'User does not exist:', values.input );
                Alert.alert( 'User not found', 'Please check your phone number' );
                return;
            }
            else {
                console.log( auth, 'auth in forget password before setting auth info phone' );

                dispatch( setAuthInfo( { phone: values.input, email: '' } ) );
                console.log( auth, 'auth in forget password after phone input' );

                dispatch( setAuthUser( { phone: values.input } ) );
                console.log( auth, 'auth in forget password after setting user' );

                // Navigate to phone verification screen
                console.log( 'Phone number entered, sending code to phone', values.input );
                // Send phone OTP
                const phoneRes = await fetch( `${ BACKEND_URL }/send-phone-otp`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify( { phone: values.input, type: 'forgetpassword' } ),
                } );
                const phoneData = await phoneRes.json();
                if ( !phoneData.success ) {
                    setLoading( false );  // Stop loading
                    console.warn( 'Failed to send phone OTP:', phoneData.message );
                }
                console.log( phoneData.otp );
                setLoading( false );  // Stop loading
                navigation.navigate( Routes.VERIFY_PHONE, {
                    onPhoneFrom: 'forgetpassword',
                } );
            }
          
        } else if ( emailRegex.test( values.input ) ) {
            const { exists } = await checkUserExists( values.input );
            console.log( 'Email existence check:', exists );
            if ( !exists ) {
                setLoading( false );  // Stop loading
                console.warn( 'User does not exist:', values.input );
                Alert.alert( 'User not found', 'Please check your email' );
                return;
            }
            else {
                console.log( auth, 'auth in forget password before setting auth info email' );

                dispatch( setAuthInfo( { phone: '', email: values.input } ) );
                console.log( auth, 'auth in forget password after email input' );
                dispatch( setAuthUser( { email: values.input } ) );
                console.log( auth, 'auth in forget password after setting user' );
                console.log( 'Email entered, sending code to email' );

                try {
                    const res = await fetch( BACKEND_URL + '/send-otp', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify( { email: values.input } ),
                    } );
                    const data = await res.json();
                    if ( !data.success ) {
                        setLoading( false );  // Stop loading
                        console.error( 'Failed to send OTP:', data.error || data.message );
                    } else {
                        console.log( 'OTP sent to email!', data.otp );
                    }
                    // Navigate to VerifyEmail and pass password forward
                    setLoading( false );  // Stop loading
                    navigation.navigate( Routes.VERIFY_EMAIL, { onEmailFrom: 'forgetpassword' } );
                } catch ( error ) {
                    console.error( 'Error sending OTP:', error );
                }
             
}
            
            setLoading( false );  // Stop loading
        } else {
            actions.setFieldError( 'input', 'Invalid email or phone number' );
        }
    };

    return (
        <SafeAreaView style={ commonstyles.container }>
            <View style={ commonstyles.mainView }>
                <HeaderLeftWithTitle title="Enter your phone/email" onPress={()=>navigation.pop()}/>
                <Formik
                    initialValues={ { input: '' } }
                    validationSchema={ validationSchema }
                    onSubmit={ handleSubmit }
                >
                    { ( { handleChange, handleSubmit, values, errors, touched } ) => (
                        <KeyboardAvoidingView
                            style={ { flex: 1 } }
                            behavior={ Platform.OS === 'ios' ? 'padding' : 'height' }
                        >
                            <ScrollView contentContainerStyle={ styles.contentContainer }>
                            <Text style={ commonstyles.subHeading }>
                                Please enter your phone/email to receive a code
                            </Text>

                            <CustomTextInput
                                label="Phone/Email"
                                value={ values.input }
                                onChangeText={ handleChange( 'input' ) }
                                placeholderText="eg: +91 274537538/abc@gmail.com"
                            // error={ touched.input && !!errors.input }
                            />

                            { touched.input && errors.input && (
                                <Text style={ commonstyles.errorText }>{ errors.input }</Text>
                            ) }

                            </ScrollView>
                        
                            { loading ? (
                                <View style={ { marginTop: hp( 25 ), alignItems: 'center' } }>
                                    <ActivityIndicator size="large" color={ colors.primary } />
                                </View>
                            ) : (
                                    <CustomButton title="Continue" onPress={ () => handleSubmit() }
                                        style={ {
                                            marginTop: hp( 0.5 ), opacity: !values.input ? 0.5 : 1, position: 'absolute',
                                            bottom: hp( 5 ),
                                        } } disabled={ !values.input } />
                            ) }
                           

                            <Text style={ styles.switchText }>
                                Already have an account?{ ' ' }
                                <Text style={ styles.loginText } onPress={ () => navigation.pop() }>Log in</Text>

                            </Text>
                        </KeyboardAvoidingView>
                    ) }
                </Formik>
            </View>
        </SafeAreaView>
    );
};
