// SetPasswordScreen.tsx
import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ActivityIndicator, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { RootStackParamList } from '../../../AppNavigator';
import CustomTextInput from '../../../components/UI/CustomTextInput';
import CustomButton from '../../../components/UI/CustomButton';
import CustomCheckbox from '../../../components/UI/CustomCheckbox';
import CustomPlainButton from '../../../components/UI/CustomPlainButton';
import HeaderLeftWithTitle from '../../../components/HeaderLeftWithTitle';
import Routes from '../../../utils/Routes';
import createCommonStyles from '../../../utils/commonstyles';
import colors from '../../../theme/colors';
import { BACKEND_URL } from '../../../utils/urls';
import { useDispatch, useSelector } from 'react-redux';
import { setAuthInfo } from '../../../store/slices/authSlice';
import { RootState } from '../../../store';
import globalUse, { hp, wp } from '../../../utils/globalUse';
import { useKeyboardVisible } from '../../../hooks/useKeyboardVisible';
import Colors from '../../../theme/colors';
import { Fonts } from '../../../utils/Fonts';
import { useStatusBarColor } from '../../../context';
import { useFocusEffect } from '@react-navigation/native';


type Props = NativeStackScreenProps<RootStackParamList, typeof Routes.SET_PASSWORD>;

const SetPasswordScreen: React.FC<Props> = ( { navigation } ) => {
    const commonstyles = createCommonStyles( colors );
    const dispatch = useDispatch();
    const { email, phone, name, imageURL } = useSelector( ( state: RootState ) => state.auth );
    const [ loading, setLoading ] = React.useState( false );
    const keyboardVisible = useKeyboardVisible();
    const { setColor } = useStatusBarColor();
        
    useFocusEffect(
                React.useCallback( () => {
                    setColor( Colors.lightBG );  

                }, [] )
            );
    

    const validationSchema = Yup.object().shape( {
        password: Yup.string()
            .required( 'Password is required' )
            .min( 6, 'Password must be at least 6 characters' )
            .matches(
                /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/,
                'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
        ),
        confirmPassword: Yup.string().oneOf( [ Yup.ref( 'password' ) ], 'Passwords must match' ).required( 'Confirm password is required' ),
        acceptedTerms: Yup.boolean().oneOf( [ true ], 'You must accept the terms and privacy policy' ),
    } );


    const handleSendOTP = async ( password: string ) => {
        console.log( "email ", email );
        console.log( "imageURL ", imageURL );
        setLoading( true );  // Start loading


        dispatch( setAuthInfo( { name: name, email: email, phone: phone, password } ) );
        console.log( "Auth info set in redux from set password:", name, email, phone, password , "before sending OTP to email" );

        // then send OTP etc.
        console.log( email );

        try {
            const res = await fetch( BACKEND_URL + '/send-otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify( { email: email } ),
            } );
            const data = await res.json();
            if ( !data.success ) {
                console.error( 'Failed to send OTP:', data.error || data.message );
            } else {
                console.log( 'OTP sent to email!', data.otp );
            }
            // Navigate to VerifyEmail and pass password forward
            setLoading( false );  // Stop loading
            navigation.navigate( Routes.VERIFY_EMAIL, { onEmailFrom: 'signup' } );

        } catch ( error ) {
            console.error( 'Error sending OTP:', error );
        }

    };

    return (
        <SafeAreaView style={ commonstyles.container }>
            <View style={ commonstyles.mainView }>
                <HeaderLeftWithTitle title={ 'Set passwords' } />
                <Formik
                    initialValues={ { password: '', confirmPassword: '', acceptedTerms: false } }
                    validationSchema={ validationSchema }
                    onSubmit={ ( values ) => handleSendOTP( values.password ) }

                >
                    { ( { handleChange, handleSubmit, values, setFieldValue, touched, errors } ) => {
                        const isFormValid =
                            values.password && values.confirmPassword && values.acceptedTerms;

                        return (
                            <KeyboardAvoidingView behavior={ Platform.OS === 'ios' ? 'padding' : 'height' } >

                                <ScrollView
                                    contentContainerStyle={ styles.scrollContainer }
                                    keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={ false }>
                                <CustomTextInput label="Password" value={ values.password } onChangeText={ handleChange( 'password' ) } placeholderText="Enter password" icon secureTextEntry eyeOn />
                                { touched.password && errors.password && <Text style={ styles.errorText }>{ errors.password }</Text> }
                                <CustomTextInput label="Confirm Password" value={ values.confirmPassword } onChangeText={ handleChange( 'confirmPassword' ) } placeholderText="Confirm password" icon secureTextEntry eyeOn />
                                { touched.confirmPassword && errors.confirmPassword && <Text style={ styles.errorText }>{ errors.confirmPassword }</Text> }
                                <CustomCheckbox checked={ values.acceptedTerms } onToggle={ () => setFieldValue( 'acceptedTerms', !values.acceptedTerms ) } textComponent={
                                    
                                            <Text style={ styles.termsText }>
                                                I agree to{ ' ' }
                                                <Text style={ styles.highlightTermsText } onPress={ () => navigation.navigate( Routes.TERMS ) }>terms and privacy policy</Text>
                                            </Text>
                                   
                                } />
                                    { touched.acceptedTerms && errors.acceptedTerms && <Text style={ styles.errorText }>{ errors.acceptedTerms }</Text> }
                                   </ScrollView>
                               { loading ? (
                                                                    <View style={ { marginTop: hp( 25 ), alignItems: 'center' } }>
                                                                    <ActivityIndicator size="large" color={ colors.primary } />
                                                                     </View>
                                                                                               ) : (
                                        <CustomButton title="Continue" onPress={ () => handleSubmit() } disabled={ !isFormValid } style={ { opacity: isFormValid ? 1 : 0.5,  marginTop: keyboardVisible ? hp( 4) : hp( 35 )} } />

                                ) }
                                
                                <Text style={ styles.switchText }>
                                    Already have an account?{ ' ' }
                                    <Text style={ styles.loginText } onPress={ () => navigation.navigate( Routes.LOGIN ) }>Log in</Text>

                                </Text>
                            </KeyboardAvoidingView>
                        );
                    } }
                </Formik>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create( {
    errorText: { color: 'red', fontSize: 12, marginBottom: 5, marginLeft: 5 },
    scrollContainer: {
        flexGrow: 1,
        // paddingHorizontal: 20,
        // paddingVertical: 20,
    },
    switchText: { textAlign: 'center', marginTop: hp( 1.5 ), fontSize: wp( 3.5 ) },
    loginText: {
        color: Colors.primary,
        fontSize: wp( 4 ),
        fontWeight: '700',
        textDecorationLine: 'underline',
    },
    termsText: {
        fontSize: globalUse.HEIGHT > 700 ? wp( 3.5 ) : wp( 2.7 ),
        color: Colors.black,
        textAlign: 'center',
        fontWeight: '400',
        opacity: 0.7,
        fontFamily: Fonts.InterRegular,
    },
    highlightTermsText: {
        color: Colors.primary,
        fontSize: wp( 3.5 ),
        fontWeight: '600',
        textDecorationLine: 'underline',
    },
} );

export default SetPasswordScreen;
