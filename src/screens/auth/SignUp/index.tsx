// SignUpScreen.tsx
// (only collecting name, email, phone & passing to next screen)
import React, {  useState } from 'react';
import { View, Text, Image, TouchableOpacity, SafeAreaView, KeyboardAvoidingView, Alert, Platform, ScrollView, ActivityIndicator } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../AppNavigator';
// import * as ImagePicker from 'react-native-image-picker';
import { Formik } from 'formik';
import * as Yup from 'yup';
import CustomTextInput from '../../../components/UI/CustomTextInput';
import CustomCheckbox from '../../../components/UI/CustomCheckbox';
import CustomButton from '../../../components/UI/CustomButton';
import CustomPlainButton from '../../../components/UI/CustomPlainButton';
import HeaderLeftWithTitle from '../../../components/HeaderLeftWithTitle';
// import SvgImages from '../../../utils/svgImages';
import Routes from '../../../utils/Routes';
import createCommonStyles from '../../../utils/commonstyles';
import colors from '../../../theme/colors';
import  { hp, wp } from '../../../utils/globalUse';
import styles from './styles';
import { RootState } from '../../../store';
import { setAuthField, setAuthInfo } from '../../../store/slices/authSlice';
import { useDispatch, useSelector } from 'react-redux';
import { pickImage } from '../../../utils/pickImage';
import EditButtonSVG from '../../../assets/svgs/editButton.svg';
// import { useKeyboardVisible } from '../../../hooks/useKeyboardVisible';
// import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { checkUserExists } from '../../../utils/checkUserExists';
import Colors from '../../../theme/colors';
import { useStatusBarColor } from '../../../context';
import { useFocusEffect } from '@react-navigation/native';


type Props = NativeStackScreenProps<RootStackParamList, typeof Routes.SIGN_UP>;

const SignUpScreen: React.FC<Props> = ( { navigation } ) => {
    const [ agreed, setAgreed ] = useState( false );
    const commonstyles = createCommonStyles( colors );
    const {imageURL } = useSelector( ( state: RootState ) => state.auth );
    const dispatch = useDispatch();
    const [ localImageUri, setLocalImageUri ] = useState( '' );
    // const keyboardVisible = useKeyboardVisible();
    const [ loading, setLoading ] = React.useState( false );
    
    // const [ uploading, setUploading ] = useState( false );
    console.log( imageURL );
      const { setColor } = useStatusBarColor();
    
        useFocusEffect(
            React.useCallback( () => {
                setColor( Colors.lightBG );  
    
            }, [] )
        );

    const validationSchema = Yup.object().shape( {
        name: Yup.string().required( 'Full Name is required' ),
        email: Yup.string()
            .matches( /^[A-Za-z0-9.+]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}$/, "Please enter valid email address" )
            .required( 'Email is required' )
            .trim().lowercase(),
        phone: Yup.string()
            .matches( /^\+[1-9]\d{7,14}$/, 'Phone number must be in E.164 format (e.g. +919876543210)' )
            .required( 'Phone is required' ),

    } );

    const handleImagePickup = async () => {

        try {
            // Call pickImage to get both local and uploaded URLs
            const { imageUri, uploadedUrl } = await pickImage();

            console.log( '📸 Local Image URI:', imageUri );
            console.log( '☁️ Uploaded URL:', uploadedUrl );

            if ( imageUri ) {
                // Save local URI in local state to show preview
                setLocalImageUri( imageUri );
            }

            if ( uploadedUrl ) {
                // Save uploaded URL to Redux store so you can use later
                dispatch( setAuthField( { field: 'imageURL', value: uploadedUrl } ) );
                console.log( "imageURL ", imageURL );
          

            }
        } catch ( error ) {
            console.error( 'Image pick/upload failed:', error );
        }
    }
    const handleSignUp = async (
        values: { name: string; email: string; phone: string },
        setFieldValue: any
    ) => {
        console.log( "Checking if user exists with email/phone..." );
        console.log( "Values:", values );
        setLoading( true );  // Start loading


        try {
            // Run both checks in parallel
            const [ emailExists, phoneExists ] = await Promise.all( [
                checkUserExists( values.email ),
                checkUserExists( values.phone ),
            ] );

            if ( emailExists.exists ) {
                setLoading( false );  // Stop loading
                console.log( "Email already exists.", emailExists, values.email );
                Alert.alert( 'User with this email already exists.' );
                setFieldValue( 'email', '' ); // ✅ Proper way
                return;
            }

            if ( phoneExists.exists ) {
                setLoading( false );  // Stop loading
                console.log( "Phone already exists.", phoneExists, values.phone );
                Alert.alert( 'User with this phone already exists.' );
                setFieldValue( 'phone', '' ); // ✅ Proper way
                return;
            }

            // If both are unique → continue
            dispatch(
                setAuthInfo( {
                    ...values,
                    imageURL, // keep the uploaded image URL if available
                } )
            );
            navigation.navigate( Routes.SET_PASSWORD );
            console.log( 'Sign Up Info:', values );
            console.log( 'Profile Image URL:', imageURL );
            setLoading( false );  // Stop loading

        } catch ( error ) {
            console.error( "Error during sign up check:", error );
            Alert.alert( "Something went wrong. Please try again." );
        }
    };

    return (
        <SafeAreaView style={ commonstyles.container }>
            <View style={ commonstyles.mainView } 
        >
                <HeaderLeftWithTitle title={ 'Create account' } onPress={ () => navigation.pop() } />
                
                <Formik
                    initialValues={ { name: '', email: '', phone: '' } }
                    validationSchema={ validationSchema }
                    onSubmit={ ( values, { setFieldValue } ) => {
                        if ( agreed ) {
                           
                            handleSignUp( values, setFieldValue );
                        }
                    } }
                >
                    { ( { handleChange, handleBlur, handleSubmit, values, errors, touched } ) => {
                        const isFormValid =
                            values.name && values.email && values.phone && agreed && Object.keys( errors ).length === 0;

                        return (
                    <KeyboardAvoidingView behavior={ Platform.OS === 'ios' ? 'padding' : 'height' }>
                                   
                    <ScrollView
              contentContainerStyle={styles.scrollContainer}
                                    keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={ false }>          
                                <View style={ styles.imageContainer }>
                                    {/* <TouchableOpacity style={ styles.profile } onPress={ () => handleImagePickup() }>
                                        { imageURL ? <Image source={ { uri: localImageUri } } style={ { width: keyboardVisible ? wp( 15 ) : wp( 35 ), height: keyboardVisible ? wp( 15 ) : wp( 35 )} } />
                                                    : <Image source={ require( '../../../assets/pngs/EmptyProfile.png' ) } style={ { width: keyboardVisible ? wp( 15 ) : wp( 35 ), height: keyboardVisible ? wp( 15 ) : wp( 35 )} } /> }
                                    </TouchableOpacity> */}
                                    <TouchableOpacity
                                        style={ [
                                            styles.profile,
                                            { width: wp( 35 ), height:  wp( 35 ) }
                                        ] }
                                        onPress={ handleImagePickup }
                                    >
                                        { imageURL ? (
                                            <Image source={ { uri: localImageUri } } style={ { width: '100%', height: '100%' } } />
                                        ) : (
                                            <Image source={ require( '../../../assets/pngs/EmptyProfile.png' ) } style={ { width: '100%', height: '100%' } } />
                                        ) }
                                    </TouchableOpacity>



                                    <TouchableOpacity style={ styles.editBtn } onPress={ () => handleImagePickup() }>
                                        <EditButtonSVG width={  wp( 9 ) } height={  wp( 9 ) } />
                                    </TouchableOpacity>
                                    </View>
                                    
                                {/* <View style={{ justifyContent:'space-between', height: keyboardVisible ? hp( 40 ) : hp( 55 )}}>

                                    <View> */}

                                {/* Full Name */ }
                                <CustomTextInput
                                    label="Full Name"
                                    value={ values.name }
                                    onChangeText={ handleChange( 'name' ) }
                                    onBlur={ handleBlur( 'name' ) }
                                    placeholderText="Your name"
                                    // style={ { marginVertical: keyboardVisible || errors.name ? hp(0.5) : hp(2) } }
                                />
                                { touched.name && errors.name && (
                                    <Text style={ commonstyles.errorText }>{ errors.name }</Text>
                                ) }

                                {/* Email */ }
                                <CustomTextInput
                                    label="Email"
                                    value={ values.email }
                                    onChangeText={ handleChange( 'email' ) }
                                    onBlur={ handleBlur( 'email' ) }
                                    placeholderText="Your email"
                                    keyboardType="email-address"
                                    // style={ { marginVertical: keyboardVisible || errors.email ? hp(0.5) : hp(2) } }
                                />
                                { touched.email && errors.email && (
                                    <Text style={ commonstyles.errorText }>{ errors.email }</Text>
                                ) }

                                {/* Phone */ }
                                <CustomTextInput
                                    label="Phone"
                                    value={ values.phone }
                                    onChangeText={ handleChange( 'phone' ) }
                                    onBlur={ handleBlur( 'phone' ) }
                                    placeholderText="Your phone"
                                    keyboardType="phone-pad"
                                    // style={ { marginVertical: keyboardVisible || errors.phone ? hp(0.5) : hp(2) } }
                                />
                                { touched.phone && errors.phone && (
                                    <Text style={ commonstyles.errorText }>{ errors.phone }</Text>
                                ) }
                               
                                <CustomCheckbox
                                    checked={ agreed }
                                    onToggle={ () => setAgreed( ( prev ) => !prev ) }
                                        textComponent={
                                            <Text style={ styles.termsText}>
                                                I agree to{ ' ' }
                                                <Text style={styles.highlightTermsText} onPress={ () => navigation.navigate( Routes.TERMS ) }>terms and privacy policy</Text>
                                                </Text>
                                        }
                                    // style={ { marginTop: keyboardVisible ? hp(1) : hp(1) } }
                                    />
                                </ScrollView> 
                                { loading ? (
                                     <View style={ { marginTop: hp( 4 ), alignItems: 'center' } }>
                                     <ActivityIndicator size="large" color={ colors.primary } />
                                      </View>
                                                                ) : (
                                        <CustomButton
                                            title="Continue"
                                            onPress={ () => handleSubmit() }
                                            disabled={ !isFormValid }
                                            style={ {
                                                opacity: isFormValid ? 1 : 0.3,
                                                marginTop: hp( 4 ),
                                            } }
                                        />
                                ) }
                                
                               
                                <Text style={ styles.switchText }>
                                    Already have an account?{ ' ' }
                                    <Text style={ styles.loginText } onPress={ () => navigation.replace( Routes.LOGIN ) }>Log in</Text>

                                </Text>
                                        
                                 
                               
                            </KeyboardAvoidingView>
                        );
                    } }
                </Formik>
                </View>
        </SafeAreaView>
    );
};

export default SignUpScreen;
