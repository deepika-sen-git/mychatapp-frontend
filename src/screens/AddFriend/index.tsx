import React, { useState } from 'react';
import {
    View, Text, TouchableOpacity, Modal, Alert, Image,
    ActivityIndicator,
    ScrollView
} from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
// import firestore from '@react-native-firebase/firestore';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store';
import svgImages from '../../utils/svgImages';
import CustomFancyHeader from '../../components/CustomHeader';
import CustomTextInput from '../../components/UI/CustomTextInput';
import CustomButton from '../../components/UI/CustomButton';
import Routes from '../../utils/Routes';
import styles from './styles';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../AppNavigator';
import {
    doc,
    getDoc,
    updateDoc,
    collection,
    query,
    where,
    getDocs
} from 'firebase/firestore';
import { db, arrayUnion } from '../../utils/firebaseConfig';
import { addFriend, Friend } from '../../store/slices/friendsSlice';
import { createPrivateChat } from '../../store/slices/privateChatsSlice';
import strings from '../../utils/strings';
import UserNotFoundSVG from '../../assets/svgs/UserNotFound.svg';
import CopyExample from '../../components/CopyButton';
import { hp, wp } from '../../utils/globalUse';
import createCommonStyles from '../../utils/commonstyles';
import colors from '../../theme/colors';

const validationSchema = Yup.object().shape( {
    phone: Yup.string()
                  .matches( /^\+[1-9]\d{7,14}$/, 'Phone number must be in E.164 format (e.g. +919876543210)' )
                  .required( 'Phone is required' ),
    email: Yup.string().lowercase().email( 'Invalid email' ).required( 'Email is required' ),
    userCode: Yup.string()
        .transform( ( value ) => value?.toUpperCase() )
        .trim()
        .required( 'User Code is required' )
        .length( 6, 'User Code must be exactly 6 characters' )
        .matches( /^[A-Z0-9]+$/, 'Only uppercase letters and numbers are allowed' ),
} );

type Props = NativeStackScreenProps<RootStackParamList, typeof Routes.ADD_FRIEND>;

const AddFriendScreen: React.FC<Props> = ( { navigation } ) => {
    const [ showNotFoundModal, setShowNotFoundModal ] = useState( false );
    const [ showUserFoundModal, setShowUserFoundModal ] = useState( false );
    const [ friendData, setFriendData ] = useState<any>( null );
    const { uid } = useSelector( ( state: RootState ) => state.user );
    const dispatch = useDispatch<AppDispatch>();
    const commonstyles = createCommonStyles( colors );
    const [ loading, setLoading ] = React.useState( false );

    const handleContinue = async ( values: any ) => {
        setLoading( true );  // Start loading
        try {
            console.log( '👉 Starting handleContinue' );

            // Step 1: Query friend by phone, email, userCode
            const q = query(
                collection( db, 'users' ),
                where( 'phone', '==', values.phone ),
                where( 'email', '==', values.email ),
                where( 'userCode', '==', values.userCode )
            );

            const snap = await getDocs( q );

            if ( snap.empty ) {
                setLoading( false );  // Stop loading
                console.log( '❌ No matching user found' );
                setShowNotFoundModal( true );
                return;
            }

            const friendDoc = snap.docs[ 0 ];
            const friend: Friend = {
                id: friendDoc.id,
                name: friendDoc.data()?.name ?? '',
                imageURL: friendDoc.data()?.imageURL ?? '',
                phone: friendDoc.data()?.phone ?? '',
                userCode: friendDoc.data()?.userCode ?? ''
            };



            console.log( '✅ Friend found:', friend );

            if ( friend.id === uid ) {
                setLoading( false );  // Stop loading
                Alert.alert( 'You cannot add yourself!' );
                return;
            }

            // Step 2: Check if already in friends
            const currentUserRef = doc( db, 'users', uid );
            const currentUserSnap = await getDoc( currentUserRef );
            const currentUserData = currentUserSnap.data();

            if ( currentUserData?.friends?.includes( friend.id ) ) {
                setLoading( false );  // Stop loading
                Alert.alert( 'This user is already in your friends list!' );
                return;
            }

            // Step 3: Add to friends lists
            await updateDoc( currentUserRef, { friends: arrayUnion( friend.id ) } );
            await updateDoc( doc( db, 'users', friend.id ), { friends: arrayUnion( uid ) } );
            dispatch( addFriend( {
                id: friend.id,
                name: friend.name,
                imageURL: friend.imageURL,
                phone: friend.phone,
                userCode: friend.userCode,

            } ) );


            console.log( '✅ Both users updated with new friend' );

            // Step 4: Create chat if not exists
            dispatch( createPrivateChat( {
                currentUserId: uid,
                friendId: friend.id
            } ) );


            // Step 5: Show modal
            setFriendData( friend );
            setShowUserFoundModal( true );
            setLoading( false );  // Stop loading
        } catch ( error ) {
            console.error( '❌ Error in handleContinue:', error );
            Alert.alert( 'Something went wrong. Please try again.' );
        }
        setLoading( false );  // Stop loading
    };


    return (
        <View style={ { flex: 1 } }>
            <CustomFancyHeader
                leftIcon={ <svgImages.ArrowLeftIcon /> }
                onLeftPress={ () => navigation.goBack() }
                centerTitle={ strings.addFriend }
            />

            <Formik
                initialValues={ { phone: '', email: '', userCode: '' } }
                validationSchema={ validationSchema }
                onSubmit={ handleContinue }
            >
                { ( { handleChange, handleSubmit, values, errors, touched } ) => {
                    const isFormValid = values.phone && values.email && values.userCode;
                    return (
                        <ScrollView style={ styles.inputContainer } contentContainerStyle={ { alignItems: 'center'}}>
                            {/* Not found modal */ }
                            <Modal visible={ showNotFoundModal } transparent animationType="fade">
                                <View style={ styles.modalNoDim }>
                                    <View style={ styles.popupCard }>
                                        <UserNotFoundSVG style={ styles.popupImage } />
                                        <Text style={ styles.popupText }>{ strings.userNotFound }</Text>
                                        <TouchableOpacity onPress={ () => setShowNotFoundModal( false ) } style={ styles.tryAgainButton }>
                                            <Text style={ styles.tryAgainText }>{ strings.tryAgain }</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </Modal>

                            {/* User found modal */ }
                            <Modal visible={ showUserFoundModal } transparent animationType="fade">
                                <View style={ styles.modalNoDim }>
                                    <View style={ styles.userCard }>
                                        <Image source={ require( '../../assets/pngs/EmptyProfile.png' ) } style={ styles.avatarCircle } />
                                        <Text style={ styles.userName }>{ friendData?.name ?? 'Unknown' }</Text>
                                        <View style={{flexDirection:'row', gap:wp(10)}}>
                                        <Text>{ friendData?.phone }</Text>
                                        <CopyExample textToCopy={ friendData?.phone } />
                                        </View>
                                        <View style={ { flexDirection: 'row', gap: wp( 10 ) } }>
                                        <Text>{ friendData?.userCode }</Text>
                                        <CopyExample textToCopy={ friendData?.userCode } />
                                        </View>
                                        <View style={ styles.buttonRow }>
                                            <TouchableOpacity onPress={ () => setShowUserFoundModal( false ) } style={ styles.cancelButton }>
                                                <Text style={ styles.cancelButtonText }>{ strings.cancel }</Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity
                                                onPress={ () => {
                                                    const chatId = [ uid, friendData.id ].sort().join( '_' );
                                                    setShowUserFoundModal( false );
                                                    // navigation.reset( {
                                                    //     index: 0,
                                                    //     routes: [ { name: Routes.CHAT, params: { chatId, type: 'private', friendUid: friendData.id } } ]
                                                    // } );
                                                    navigation.replace( Routes.CHAT, { chatId, type: 'private', friendUid: friendData.id } );
                                                } }
                                                style={ styles.startChatButton }
                                            >
                                                <Text style={ styles.startChatText }>{ strings.startChat }</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                </View>
                            </Modal>

                            <CustomTextInput
                                label={ strings.phone }
                                value={ values.phone }
                                onChangeText={ handleChange( 'phone' ) }
                                placeholderText={ strings.enterPhone }
                                keyboardType="phone-pad"
                            />
                            { touched.phone && errors.phone && <Text style={ commonstyles.errorText }>{ errors.phone }</Text> }

                            <CustomTextInput
                                label={ strings.email }
                                value={ values.email }
                                onChangeText={ handleChange( 'email' ) }
                                placeholderText={ strings.enterEmail }
                                keyboardType="email-address"
                            />
                            { touched.email && errors.email && <Text style={ commonstyles.errorText }>{ errors.email }</Text> }

                            <CustomTextInput
                                label={ strings.userCode }
                                value={ values.userCode }
                                onChangeText={ handleChange( 'userCode' ) }
                                placeholderText={ strings.enterUserCode }
                                keyboardType="default"
                                autocapitalize='characters'
                            />
                            { touched.userCode && errors.userCode && <Text style={ commonstyles.errorText }>{ errors.userCode }</Text> }

                            { loading ? (
                                <View style={ { marginTop: hp( 25 ), alignItems: 'center' } }>
                                    <ActivityIndicator size="large" color={ colors.primary } />
                                </View>
                            ) : (
                                    <CustomButton title={ strings.continue } onPress={ () => handleSubmit() } disabled={ !isFormValid } style={ { opacity: isFormValid ? 1 : 0.3 } } />

                            ) }
                        </ScrollView>
                    )
                } }
            </Formik>
        </View>
    );
};

export default AddFriendScreen;
