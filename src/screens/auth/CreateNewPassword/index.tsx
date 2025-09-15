import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, KeyboardAvoidingView, ScrollView, Platform, ActivityIndicator } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { RootStackParamList } from '../../../AppNavigator';
import CustomTextInput from '../../../components/UI/CustomTextInput';
import CustomButton from '../../../components/UI/CustomButton';
import CustomCheckbox from '../../../components/UI/CustomCheckbox';
import HeaderLeftWithTitle from '../../../components/HeaderLeftWithTitle';
import Routes from '../../../utils/Routes';
import createCommonStyles from '../../../utils/commonstyles';
import colors from '../../../theme/colors';
import globalUse, { hp, wp } from '../../../utils/globalUse';
import { useSelector } from 'react-redux';
import { BACKEND_URL } from '../../../utils/urls';
import { useStatusBarColor } from '../../../context';
import { useFocusEffect } from '@react-navigation/native';
import Colors from '../../../theme/colors';

type Props = NativeStackScreenProps<RootStackParamList, typeof Routes.CREATE_NEW_PASSWORD>;

const CreateNewPasswordScreen: React.FC<Props> = ( { navigation } ) => {
    const commonstyles = createCommonStyles( colors );
    const { email, phone } = useSelector( ( state: any ) => state.auth );
    console.log( "email, phone ", email, phone );
    const [ loading, setLoading ] = React.useState( false );

const { setColor } = useStatusBarColor();
    
        useFocusEffect(
            React.useCallback( () => {
                setColor( Colors.lightBG );  
    
            }, [] )
        );
    const validationSchema = Yup.object().shape( {
        password: Yup.string()
            .required( 'Password is required' )
            .min( 6, 'Password must be at least 6 characters' ),
        confirmPassword: Yup.string()
            .oneOf( [ Yup.ref( 'password' ) ], 'Passwords must match' )
            .required( 'Confirm password is required' ),
        logoutAll: Yup.boolean(), // optional
    } );

    const handlePasswordChange = async ( password: string, logoutAll: boolean ) => {
        setLoading( true );  // Start loading
        try {
            const res = await fetch( `${ BACKEND_URL }/auth/update-password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify( {
                    phone,
                    email,
                    newPassword: password,
                    logoutEverywhere: logoutAll,
                } ),
            } );

            const data = await res.json();

            if ( !res.ok ) {
                setLoading( false );  // Stop loading
                console.warn( 'Failed to update password:', data.error || 'Unknown error' );
                return false;
            }

            setLoading( false );  // Stop loading
            console.log( 'Password updated successfully:', data );
            return true;
        } catch ( err ) {
            console.error( 'Error updating password:', err );
            return false;
        }
    };


    return (
        <SafeAreaView style={ commonstyles.container }>
            <View style={ commonstyles.mainView }>
                <HeaderLeftWithTitle title="Create new password" />

                <Text style={ commonstyles.subHeading }>
                    Please set a new password for{ ' ' }
                    <Text style={ { color: colors.black } }>
                        { phone ? phone : email }
                    </Text>
                </Text>

                <Formik
                    initialValues={ { password: '', confirmPassword: '', logoutAll: false } }
                    validationSchema={ validationSchema }
                    onSubmit={ async ( values ) => {
                        console.log( 'New password set:', values );

                        const success = await handlePasswordChange( values.password, values.logoutAll );

                        if ( success ) {
                            navigation.navigate( Routes.PASSWORD_CHANGED );
                        }
                    } }
                >
                    { ( { handleChange, handleSubmit, values, setFieldValue, touched, errors } ) => {
                        const isFormValid =
                            values.password &&
                            values.confirmPassword &&
                            values.password === values.confirmPassword;

                        return (
                            
                            <KeyboardAvoidingView behavior={ Platform.OS === 'ios' ? 'padding' : 'height' } style={ { flex: 1 } }>

                                    <ScrollView
                                        contentContainerStyle={ styles.scrollContainer }
                                        keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={ false }>   
                                <CustomTextInput
                                    label="Password"
                                    value={ values.password }
                                    onChangeText={ handleChange( 'password' ) }
                                    placeholderText="Enter password"
                                    icon
                                    secureTextEntry
                                        eyeOn
                                   
                                />
                                { touched.password && errors.password && (
                                    <Text style={ styles.errorText }>{ errors.password }</Text>
                                ) }

                                <CustomTextInput
                                    label="Confirm Password"
                                    value={ values.confirmPassword }
                                    onChangeText={ handleChange( 'confirmPassword' ) }
                                    placeholderText="Confirm password"
                                    icon
                                    secureTextEntry
                                    eyeOn
                                />
                                { touched.confirmPassword && errors.confirmPassword && (
                                    <Text style={ styles.errorText }>{ errors.confirmPassword }</Text>
                                ) }

                                <CustomCheckbox
                                    checked={ values.logoutAll }
                                    onToggle={ () => setFieldValue( 'logoutAll', !values.logoutAll ) }
                                    text="Log out from all devices"
                                />
                                </ScrollView>

                                { loading ? (
                                    <View style={ { marginTop: hp( 25 ), alignItems: 'center' } }>
                                        <ActivityIndicator size="large" color={ colors.primary } />
                                    </View>
                                ) : (
                                        <CustomButton
                                            title="Continue"
                                            onPress={ () => handleSubmit() }
                                            disabled={ !isFormValid }
                                            style={ {
                                                opacity: isFormValid ? 1 : 0.1,
                                                marginTop: hp( 3 ),

                                            } }
                                        />
                                ) }

                          
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
        paddingBottom: hp( 5), 
    }
} );

export default CreateNewPasswordScreen;
