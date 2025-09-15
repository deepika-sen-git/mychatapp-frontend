import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Alert, Image } from 'react-native';
import CustomFancyHeader from '../../components/CustomHeader';
import svgImages from '../../utils/svgImages';
import Routes from '../../utils/Routes';
import styles from './styles';
import EditProfileModal from './EditProfileModal';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store';
import { setAuthUser } from '../../store/slices/authSlice';
import globalUse, { hp } from '../../utils/globalUse';
import Colors from '../../theme/colors';
import CopyExample from '../../components/CopyButton';
import { pickImage } from '../../utils/pickImage';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../utils/firebaseConfig';
import auth from "@react-native-firebase/auth";
import strings from '../../utils/strings';
import { BACKEND_URL } from '../../utils/urls';
import { setAuthInfo } from '../../store/slices/authSlice';
// import { EmailAuthProvider, reauthenticateWithCredential, verifyBeforeUpdateEmail } from 'firebase/auth';
import PasswordPrompt from './PasswordPrompt';
import { setUser } from '../../store/slices/userSlice';
// import { firebase } from "@react-native-firebase/app"; // ensures both SDKs share the same app
import { checkUserExists } from '../../utils/checkUserExists';
import { reauthenticateWithCredential, EmailAuthProvider, verifyBeforeUpdateEmail } from 'firebase/auth';


const ProfileScreen: React.FC<any> = ( { navigation } ) => {
    const [ modalVisible, setModalVisible ] = useState( false );
    const { uid, email, phone, name, imageURL, userCode } = useSelector( ( state: RootState ) => state.user );
    const { isPhoneVerified, user } = useSelector( ( state: RootState ) => state.auth );

    const [ nameToEdit, setNameToEdit ] = useState( name );
    const [ phoneToEdit, setPhoneToEdit ] = useState( phone );
    const [ emailToEdit, setEmailToEdit ] = useState( email );
    const [ loading, setLoading ] = React.useState( false );


    const dispatch = useDispatch();
    const [ showPasswordPrompt, setShowPasswordPrompt ] = useState( false );

    // const currentUser = auth().currentUser;
    // if ( currentUser ) {
    //     console.log( "UID:", currentUser.uid );
    //     console.log( "Email:", currentUser.email );
    //     console.log( "Verified:", currentUser.emailVerified );
    // }

    // console.log( "uid from Profile", uid );
    // console.log( "email from Profile", email );
    // // console.log( "phone from Profile", phone );
    // // console.log( "name from Profile", name );
    // // console.log( "imageURL from Profile", imageURL );
    // // console.log( "userCode from Profile", userCode );
    // console.log( "user from Profile", authState.user );

    const handleSave = async () => {
        setLoading( true );  // Start loading
        if ( !nameToEdit.trim() ) {
            setLoading( false );  // Stop loading
            return Alert.alert( 'Name is required!' );
        }
        if ( !/^\+[1-9]\d{7,14}$/.test( phoneToEdit ) ) {
            setLoading( false );  // Stop loading
            return Alert.alert( 'Phone must be in E.164 format (e.g. +919876543210)' );
        }
        if ( !/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test( emailToEdit ) ) {
            setLoading( false );  // Stop loading
            return Alert.alert( 'Invalid email format' );
        }

        try {
            const updates: any = {};
            if ( nameToEdit !== name ) updates.name = nameToEdit;
            if ( phoneToEdit !== phone ) updates.phone = phoneToEdit;
            if ( emailToEdit !== email ) updates.email = emailToEdit;
            try {
                // Run both checks in parallel
                const [ emailExists, phoneExists ] = await Promise.all( [
                    updates.email && checkUserExists( updates.email ),
                    updates.phone && checkUserExists( updates.phone ),
                ] );

                if ( phoneExists && phoneExists.exists ) {
                    console.log( "Phone already exists.", phoneExists, updates.phone );
                    setLoading( false );  // Stop loading
                    Alert.alert( 'User with this phone already exists.' );
                    return;
                }
                if ( emailExists && emailExists.exists ) {
                    console.log( "Email already exists.", emailExists, updates.email );
                    setLoading( false );  // Stop loading
                    Alert.alert( 'User with this email already exists.' );
                    return;
                }


            } catch ( error ) {
                setLoading( false );  // Stop loading
                console.error( "Error during editing profile:", error );
                Alert.alert( "Something went wrong. Please try again." );
            }


            if ( Object.keys( updates ).length === 0 ) {
                setLoading( false );  // Stop loading
                return Alert.alert( 'No changes to save!' );
            }


            // 1️⃣ If phone changed → verify via OTP first
            if ( updates.phone ) {
                setLoading( false );  // Stop loading
                const phoneRes = await fetch( `${ BACKEND_URL }/send-phone-otp`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify( { phone: phoneToEdit } ),
                } );

                const phoneData = await phoneRes.json();
                if ( !phoneData.success ) {

                    return Alert.alert( 'Phone verification failed', phoneData.message );
                }

                dispatch( setAuthInfo( { name, email, phone: phoneToEdit } ) );
                console.log( isPhoneVerified, "isPhoneVerified" );

                navigation.navigate( Routes.VERIFY_PHONE, {
                    phone: phoneToEdit,
                    onPhoneFrom: 'editprofile',
                    onVerified: async () => {
                        // await applyProfileUpdate( updates );
                        if ( updates.email ) {
                            setShowPasswordPrompt( true ); // next step → email
                        } else {
                            console.log( "applyling....ProfileUpdate" );

                            await applyProfileUpdate( updates );
                        }
                    },
                } );


                return; // ✅ stop here until OTP verified
            }

            // 2️⃣ If email changed → require password re-auth
            if ( updates.email ) {
                setShowPasswordPrompt( true );
            } else {
                console.log( "applyling....ProfileUpdate" );
                await applyProfileUpdate( updates );
            }

        } catch ( error ) {
            console.error( 'Failed to update profile:', error );
            Alert.alert( 'Something went wrong, please try again' );
        }
        setLoading( false );  // Stop loading
    };



    const continueWithEmailCheck = async ( updates: any, currentPassword: string ) => {
        try {

            console.log( user );


            if ( !user || !user.email ) {
                return Alert.alert( "Error", "User not logged in" );
            }

            // Create credential
            const credential = EmailAuthProvider.credential( user.email, currentPassword );

            // Reauthenticate user
            await reauthenticateWithCredential( user, credential );

            // Proceed to email verification or update
            if ( updates.email ) {
                await verifyBeforeUpdateEmail( user, updates.email );
                Alert.alert( "Verify Email", "Verification link sent to your new email." );
            } else {
                console.log( 'No email to update' );
            }

        } catch ( error: any ) {
            console.error( 'Failed to update email:', error );

            Alert.alert( 'Error', error.message || 'Could not update email' );
        }
    };


    const applyProfileUpdate = async ( updates: any ) => {
        // Email change handled via verification → don’t write unverified email yet
        const userRef = doc( db, "users", uid );
        console.log( updates, "updates " );

        const firestoreUpdates = { ...updates };
        delete firestoreUpdates.email;

        await updateDoc( userRef, firestoreUpdates );
        console.log( "firestoreUpdates", firestoreUpdates );

        dispatch( setAuthUser( firestoreUpdates ) );
        console.log( "Profile updated:", );
        updates.phone && dispatch( setUser( { phone: updates.phone } ) );
        updates.name && dispatch( setUser( { name: updates.name } ) );
        setLoading( false );
        setModalVisible( false );
        navigation.navigate( Routes.PROFILE_EDIT_SUCCESS );
    };

    const handleImagePickup = async () => {
        try {
            const { imageUri, uploadedUrl } = await pickImage();

            console.log( '📸 Local Image URI:', imageUri );
            console.log( '☁️ Uploaded URL:', uploadedUrl );

            if ( uploadedUrl ) {
                dispatch( setUser( { imageURL: uploadedUrl } ) );
                console.log( auth, 'auth in profile after setting user imageURL' );


                const userRef = doc( db, 'users', uid );
                await updateDoc( userRef, { imageURL: uploadedUrl } );
            }
        } catch ( error ) {
            console.error( 'Image pick/upload failed:', error );
        }
    };

    return (
        <>
            <CustomFancyHeader
                leftIcon={ <svgImages.ArrowLeftIcon /> }
                onLeftPress={ () => navigation.navigate( Routes.PROFILE_MENU ) }
                leftStyle={ { opacity: 0.6 } }
                centerTitle={ strings.profile }
            />

            <View style={ { backgroundColor: Colors.lightBG, width: globalUse.WIDTH, height: hp( 0.03 ), elevation: 5, zIndex: 20 } } />

            <View style={ styles.container }>
                <View style={ styles.groupImageWrapper }>
                    <TouchableOpacity>
                        { imageURL ?
                            <Image source={ { uri: imageURL } } style={ styles.avatar } />
                            :
                            <Image source={ require( '../../assets/pngs/EmptyProfile.png' ) } style={ styles.avatar } />
                        }
                    </TouchableOpacity>
                    <TouchableOpacity style={ styles.editIcon } onPress={ handleImagePickup }>
                        <svgImages.EditPenSVG />
                    </TouchableOpacity>
                </View>

                <Text style={ styles.userName }>{ name }</Text>

                <View style={ styles.infoRow }>
                    <Text style={ styles.label }>{ strings.phone } :</Text>
                    <Text>{ ` ${ phone }` }</Text>
                    <CopyExample textToCopy={ phone } />
                </View>
                <View style={ styles.infoRow }>
                    <Text style={ styles.label }>{ strings.email } :</Text>
                    <Text>{ email }</Text>
                    <CopyExample textToCopy={ email } />
                </View>
                <View style={ styles.infoRow }>
                    <Text style={ styles.label }>{ strings.userCode } :</Text>
                    <Text>{ userCode }</Text>
                    <CopyExample textToCopy={ userCode } />
                </View>

                <TouchableOpacity style={ styles.primaryButton } onPress={ () => setModalVisible( true ) }>
                    <svgImages.EditPenIcon />
                    <Text style={ styles.primaryButtonText }>{ strings.editProfile }</Text>
                </TouchableOpacity>

                <EditProfileModal
                    visible={ modalVisible }
                    onSave={ handleSave }
                    onCancel={ () => {
                        setModalVisible( false );
                        setNameToEdit( name )
                        setPhoneToEdit( phone )
                        setEmailToEdit( email )
                    } }
                    name={ nameToEdit }
                    setName={ setNameToEdit }
                    phone={ phoneToEdit }
                    setPhone={ setPhoneToEdit }
                    email={ emailToEdit }
                    setEmail={ setEmailToEdit }
                    loading={ loading }
                />
            </View>

            <PasswordPrompt
                visible={ showPasswordPrompt }
                onConfirm={ async ( password: string ) => {
                    setShowPasswordPrompt( false );
                    console.log( user );

                    if ( user ) {
                        await continueWithEmailCheck( { email: emailToEdit }, password );
                    } else {
                        Alert.alert( 'Error', 'Please login first' );
                    }


                } }
                onCancel={ () => setShowPasswordPrompt( false ) }
            />
        </>
    );
};

export default ProfileScreen;
