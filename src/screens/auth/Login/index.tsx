// LoginScreen.tsx
import React from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, Alert, ScrollView, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { RootStackParamList } from '../../../AppNavigator';
import CustomTextInput from '../../../components/UI/CustomTextInput';
import CustomButton from '../../../components/UI/CustomButton';
import CustomPlainButton from '../../../components/UI/CustomPlainButton';
import HeaderLeftWithTitle from '../../../components/HeaderLeftWithTitle';
import Routes from '../../../utils/Routes';
import createCommonStyles from '../../../utils/commonstyles';
import colors from '../../../theme/colors';
import globalUse, { hp, wp } from '../../../utils/globalUse';
import styles from './styles';
import { useDispatch, useSelector } from 'react-redux';
import { setAuthInfo, setAuthUser } from '../../../store/slices/authSlice';
import { BACKEND_URL } from '../../../utils/urls';
import { loginWithEmailPassword } from '../../../utils/loginWithEmailPassword';
// import { firestore } from '../../../utils/firebaseConfig';
import { setUserProfile } from '../../../store/slices/userSlice';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../../utils/firebaseConfig'; // adjust path to your config
import { AppDispatch, RootState } from '../../../store';
import { useKeyboardVisible } from '../../../hooks/useKeyboardVisible';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useStatusBarColor } from '../../../context';
import { useFocusEffect } from '@react-navigation/native';
import Colors from '../../../theme/colors';


type Props = NativeStackScreenProps<RootStackParamList, typeof Routes.LOGIN>;

interface FormValues {
    email: string;
    phone: string;
    password: string;
}

const LoginScreen: React.FC<Props> = ( { navigation } ) => {

    const commonstyles = createCommonStyles( colors );
    const dispatch = useDispatch<AppDispatch>();
    const keyboardVisible = useKeyboardVisible();
    const [ loading, setLoading ] = React.useState( false );
      const { setColor } = useStatusBarColor();
    
        useFocusEffect(
            React.useCallback( () => {
                setColor( Colors.lightBG );  
    
            }, [] )
        );


    const validationSchema = Yup.object().shape( {
        email: Yup.string()
            .matches( /^[A-Za-z0-9.+]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}$/, "Please enter valid email address" )
            .required( "Email is required" )
            .trim(),
        phone: Yup.string()
            .matches( /^\+[1-9]\d{7,14}$/, 'Phone number must be in E.164 format (e.g. +919876543210)' )
            .required( 'Phone is required' ),
        password: Yup.string()
            .required( 'Password is required' )
            .min( 6, 'Password must be at least 6 characters' ),
    } );

    const { email, phone } = useSelector( ( state: RootState ) => state.auth );
    const handleLogin = async ( values: FormValues ) => {
        console.log( "handling login..." );
        setLoading( true );  // Start loading

        const result = await loginWithEmailPassword( values.email, values.password );
        if ( result.success ) {
            const user = result.user;
            const uid = user.uid;
            // const doc = await firestore().collection( 'users' ).doc( uid ).get();
            const userRef = doc( db, 'users', uid ); // get doc reference
            const docSnap = await getDoc( userRef ); // fetch data
            console.log( user?.uid );


            if ( !docSnap.exists ) {
                Alert.alert( 'User profile not found!' );
                return;
            }

            const userData = docSnap.data();
            console.log( '✅ User data fetched:', userData );

            // 3️⃣ Compare phone number

            if ( userData && userData.phone !== values.phone ) {
                setLoading( false );  // Stop loading
                Alert.alert( 'Phone number does not match!' );
                return;
            }
            console.log( "user profile setting in redux from login.." );
            if ( userData ) {
                dispatch( setUserProfile( {
                    uid: uid,
                    name: userData.name,
                    email: userData.email,
                    phone: userData.phone,
                    imageURL: userData.imageURL,
                    userCode: userData.userCode,
                    createdAt: userData.createdAt,
                    language:'en-US',
                } ) );
                dispatch( setAuthInfo( { email: userData.email, phone: userData.phone, password: values.password, } ) );
                console.log( "Auth info set in redux from login:", userData.email, userData.phone );
                dispatch( setAuthUser( { user } ) );
                // console.log( "Auth user set in redux from login:", user );

                console.log( "user profile set in redux.." );

            }

            // dispatch( setAuthInfo( {
            //     email: values.email,
            //     phone: values.phone,
            //     password: values.password
            // } ) );
            // console.log( values.email,
            //     values.phone,
            //     values.password );


            try {
                const res = await fetch( `${ BACKEND_URL }/send-otp`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify( { email: values.email } ),
                } );
                const data = await res.json();
                if ( data.success ) {
                    console.log( '✅ OTP sent to email!', data.otp );
                    navigation.navigate( Routes.VERIFY_EMAIL, { onEmailFrom: 'login' } );
                   
                } else {
                    console.error( '❌ Failed:', data.message );
                    Alert.alert( data.message );
                }
              
            } catch ( error ) {
                console.error( 'Login error:', error );
                Alert.alert( 'Something went wrong' );
            }
            setLoading( false );  // Stop loading
        }
        else {
           
            Alert.alert("Login Failed, Invalid credentials")
            // console.error( 'Login failed:', result.message );
        }
        setLoading( false );  // Stop loading
    };


    return (
        <SafeAreaView style={ commonstyles.container }>

            <View style={ commonstyles.mainView } >
                <HeaderLeftWithTitle title={ 'Log in' } onPress={ () => navigation.pop() } />

                <Formik
                    initialValues={ { email: '', phone: '', password: '' } }
                    validationSchema={ validationSchema }
                    onSubmit={ handleLogin }
                >
                    { ( { handleChange, handleSubmit, values, touched, errors } ) => {
                        const isFormValid = values.email && values.phone && values.password && Object.keys( errors ).length === 0;

                        return (
                            <KeyboardAvoidingView behavior={ Platform.OS === 'ios' ? 'padding' : 'height' } >

                                <ScrollView
                                    contentContainerStyle={ styles.scrollContainer }
                                    keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={ false }>    
                                <CustomTextInput
                                    label="Phone"
                                    value={ values.phone }
                                    onChangeText={ handleChange( 'phone' ) }
                                    keyboardType="phone-pad"
                                    placeholderText="Your Phone"
                                style={ { marginVertical:  hp(2) } } // 👈 shrink spacing
                                />
                                { touched.phone && errors.phone && (
                                    <Text style={ commonstyles.errorText }>{ errors.phone }</Text>
                                ) }

                                <CustomTextInput
                                    label="Email"
                                    value={ values.email }
                                    onChangeText={ handleChange( 'email' ) }
                                    keyboardType="email-address"
                                    placeholderText="Your email"
                                style={ { marginVertical: hp(2) } }
                                />
                                { touched.email && errors.email && (
                                    <Text style={ commonstyles.errorText }>{ errors.email }</Text>
                                ) }

                                <CustomTextInput
                                    label="Password"
                                    value={ values.password }
                                    onChangeText={ handleChange( 'password' ) }
                                    placeholderText="Enter password"
                                    icon
                                    secureTextEntry
                                style={ { marginVertical:hp(2) } }
                                />
                                { touched.password && errors.password && (
                                    <Text style={ commonstyles.errorText }>{ errors.password }</Text>
                                ) }

                                <TouchableOpacity onPress={ () => navigation.navigate( Routes.FORGET_PASSWORD ) } style={ { width: wp( 30 ), alignSelf: 'flex-end' } }>
                                    <Text style={ styles.forgot }>Forgot Password?</Text>
                                </TouchableOpacity>
                                    </ScrollView>
                                { loading ? (
                                    <View style={ { marginTop: keyboardVisible ? hp( 4 ) : hp( 25 ), alignItems: 'center' } }>
                                        <ActivityIndicator size="large" color={ colors.primary } />
                                    </View>
                                ) : (
                                    <CustomButton
                                        title="Continue"
                                        onPress={ () => handleSubmit() }
                                        disabled={ !isFormValid }
                                        style={ { opacity: isFormValid ? 1 : 0.5, marginTop: keyboardVisible ? hp( 4) : hp( 20 ) } }
                                    />
                                ) }

                                <Text style={ styles.switchText }>
                                Don’t have an account? { ' ' }
                                    <Text style={ styles.loginText } onPress={ () => navigation.replace( Routes.SIGN_UP ) }>Sign up</Text>

                                </Text>
                            </KeyboardAvoidingView>
                        );
                    } }
                </Formik>


            </View>

        </SafeAreaView>
    );
};

export default LoginScreen;
