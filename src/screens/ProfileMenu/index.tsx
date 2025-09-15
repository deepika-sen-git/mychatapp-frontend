import React, { useState } from 'react';
import {
    View,
    TouchableOpacity,
    Text,
    Modal,
    StyleSheet,
    ScrollView,

} from 'react-native';
import svgImages from '../../utils/svgImages';
import CustomFancyHeader from '../../components/CustomHeader';
import Colors from '../../theme/colors';
import Routes from '../../utils/Routes';
// import styles from './styles';
import { RootStackParamList } from '../../AppNavigator';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import globalUse, { hp, wp } from '../../utils/globalUse';
import styles from './styles';
import ConfirmationModal from '../../components/UI/ConfirmationModal';

import { useDispatch, useSelector } from 'react-redux';
import { clearAuthTempData, logout } from '../../store/slices/authSlice';
import { resetUserProfile, setUser } from '../../store/slices/userSlice';
import { resetFriends } from '../../store/slices/friendsSlice';
import { resetGroups } from '../../store/slices/groupSlice';
import { resetPrivateChats } from '../../store/slices/privateChatsSlice';
import strings from '../../utils/strings';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BACKEND_URL } from '../../utils/urls';
import { auth } from '../../utils/firebaseConfig';
import { RootState } from '../../store';

type Props = NativeStackScreenProps<RootStackParamList, typeof Routes.PROFILE_MENU>;

const ProfileMenuScreen: React.FC<Props> = ( { navigation } ) => {
    const [ showDeleteModal, setShowDeleteModal ] = useState( false );
    const [ showLogoutModal, setShowLogoutModal ] = useState( false );
    const [ showLanguageModal, setShowLanguageModal ] = useState( false );
    const { uid, language } = useSelector( ( state: RootState ) => state.user ); 
//    console.log(language);
   
    const [ currentLang, setCurrentLang ] = useState(language );

    const dispatch = useDispatch();

    const handleLogout = () => {
        dispatch( clearAuthTempData() );
        dispatch( resetUserProfile() );
        dispatch( resetFriends() );
        dispatch( resetGroups() );
        dispatch( resetPrivateChats() );
        dispatch( logout() );
        navigation.reset( {
            index: 0,
            routes: [ { name: Routes.GET_STARTED } ],
        } );
    };
    const handleDeleteAccount = async () => {
        try {
           
            

            if ( !uid ) {
                throw new Error( "No authenticated user found" );
            }

            // 🔑 Send UID to backend
            const response = await fetch( `${ BACKEND_URL }/auth/delete-user`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify( { uid } ),
            } );

            const data = await response.json();

            if ( !response.ok ) {
                throw new Error( data.message || "Failed to delete account" );
            }

            // Clear Redux + Navigation
            dispatch( logout() );
            dispatch( resetUserProfile() );
            navigation.reset( {
                index: 0,
                routes: [ { name: Routes.GET_STARTED } ],
            } );

            console.log( "Account deleted successfully:", data.message );
        } catch ( error ) {
            console.error( "Delete account failed:", error );
        }
    };

    const changeLanguage = async ( lang: string ) => {
        strings.setLanguage( lang );
        dispatch(setUser({language:lang}))
        setCurrentLang( lang );
        setShowLanguageModal( false );
        await AsyncStorage.setItem( 'appLanguage', lang );
    };


    return (
        <>
            <CustomFancyHeader
                leftTitle={ strings.profile }

                rightIcons={ [
                    <TouchableOpacity style={ { marginRight: 16 } } key="openedMenu" onPress={ () => navigation.reset( {
                        index: 0,
                        routes: [ { name: Routes.CHATS }]
                    }  ) }>
                        <svgImages.OpenedMenuIcon />
                    </TouchableOpacity>,
                ] }

            />


            <View style={ { backgroundColor: Colors.lightBG, width: globalUse.WIDTH, height: hp(0.05), elevation: 5, zIndex: 2 } }></View>

            <ScrollView style={ { flex: 1, width: globalUse.WIDTH, height: globalUse.HEIGHT, backgroundColor: 'white', paddingHorizontal: wp(5) } }>


                <TouchableOpacity style={ styles.menuItem } onPress={ () => setShowLanguageModal( true ) }>
                    <svgImages.LanguageIcon />
                    <Text style={ styles.menuText }>{ strings.language }</Text>
                    <TouchableOpacity style={ styles.languageDropdown } onPress={ () => setShowLanguageModal( true ) }>
                        <Text style={ styles.rightText }> { currentLang === 'en-US' ? 'English (US)' : 'Thai (Thailand)' }</Text>
                        <svgImages.ChevronDownIcon />
                    </TouchableOpacity>
                </TouchableOpacity>

                <TouchableOpacity style={ styles.menuItem } onPress={ () => navigation.navigate( Routes.PROFILE ) }>
                    <svgImages.GreenProfileIcon />
                    <Text style={ styles.menuText }>{ strings.profile }</Text>
                    <svgImages.ChevronRightIcon />
                </TouchableOpacity>

                <TouchableOpacity style={ styles.menuItem } onPress={ () => navigation.navigate( Routes.TERMS ) }>
                    <svgImages.TermsIcon />
                    <Text style={ styles.menuText }>{ strings.termsOfService }</Text>
                    <svgImages.ChevronRightIcon />
                </TouchableOpacity>

                <TouchableOpacity style={ styles.menuItem } onPress={ () => navigation.navigate( Routes.PRIVACY_POLICY ) }>
                    <svgImages.PolicyIcon />
                    <Text style={ styles.menuText }>{ strings.privacyPolicy }</Text>
                    <svgImages.ChevronRightIcon />
                </TouchableOpacity>

                <TouchableOpacity style={ styles.menuItem } onPress={ () => navigation.navigate( Routes.ABOUT_APP ) }>
                    <svgImages.NotesLayers />
                    <Text style={ styles.menuText }>{ strings.aboutApp }</Text>
                    <svgImages.ChevronRightIcon />
                </TouchableOpacity>

                <TouchableOpacity style={ styles.menuItem } onPress={ () => navigation.navigate( Routes.CONTACT_SUPPORT ) }>
                    <svgImages.MailIcon />
                    <Text style={ styles.menuText }>{ strings.contactSupport }</Text>
                    <svgImages.ChevronRightIcon />
                </TouchableOpacity>

                <TouchableOpacity style={ styles.menuItem } onPress={ () => setShowDeleteModal( true ) }>
                    <svgImages.DustBinIcon />
                    <Text style={ [ styles.menuText, { color: 'red' } ] }>{ strings.deleteAccount }</Text>
                    <svgImages.ChevronRightIcon />
                </TouchableOpacity>

                <TouchableOpacity style={ styles.menuItem } onPress={ () => setShowLogoutModal( true ) }>
                    <svgImages.LogoutIcon />
                    <Text style={ styles.menuText }>{ strings.logout }</Text>
                </TouchableOpacity>



            </ScrollView>
            {/* Language Modal */ }
            <Modal
                visible={ showLanguageModal }
                transparent
                animationType="fade"
                onRequestClose={ () => setShowLanguageModal( false ) }
            >
                <View style={ modalStyles.overlay }>
                    <View style={ modalStyles.content }>
                        <Text style={ modalStyles.title }>{ strings.language }</Text>

                        <TouchableOpacity style={ modalStyles.option } onPress={ () => changeLanguage( 'en-US' ) }>
                            <Text style={ modalStyles.optionText }>English (US)</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={ modalStyles.option } onPress={ () => changeLanguage( 'th-TH' ) }>
                            <Text style={ modalStyles.optionText }>Thai (Thailand)</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={ [ modalStyles.option, { backgroundColor: '#16C47F1A', alignContent:'center' } ] } onPress={ () => setShowLanguageModal( false ) }>
                            <Text style={ modalStyles.optionText }>{ strings.cancel }</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            <ConfirmationModal
                visible={ showDeleteModal }
                onClose={ () => setShowDeleteModal( false ) }
                onConfirm={
                    handleDeleteAccount
                }
                type="delete"
            />

            <ConfirmationModal
                visible={ showLogoutModal }
                onClose={ () => setShowLogoutModal( false ) }
                onConfirm={ handleLogout }
                type="logout"
            />

        </>
    );
};

export default ProfileMenuScreen;

const modalStyles = StyleSheet.create( {
    overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
    content: { backgroundColor: '#fff', padding: 20, borderRadius: 10, width: '80%' },
    title: { fontSize: 18, fontWeight: 'bold', marginBottom: 15 },
    option: { paddingVertical: 12 },
    optionText: { fontSize: 16 }
} );