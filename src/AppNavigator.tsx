import React, { useEffect, useState } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';

import WelcomeScreen from './screens/auth/WelcomeScreen';
import OnboardingScreen from './screens/auth/OnboardingScreen';
import GettingStartedScreen from './screens/auth/GetStarted';
import LoginScreen from './screens/auth/Login';
import SignUpScreen from './screens/auth/SignUp';
import SetPasswordScreen from './screens/auth/SetPassword';
import Routes from './utils/Routes';
import { VerifyEmailScreen } from './screens/auth/VerifyEmail';
import { VerifyPhoneScreen } from './screens/auth/VerifyPhone';
import { ForgetPasswordScreen } from './screens/auth/ForgetPasswords';
import CreateNewPasswordScreen from './screens/auth/CreateNewPassword';
import ChatsScreen from './screens/Chats';
import AddFriendScreen from './screens/AddFriend';
import CreateGroupScreen from './screens/CreateGroup';
import ProfileMenuScreen from './screens/ProfileMenu';
import ProfileScreen from './screens/Profile';
import ProfileEditSuccess from './screens/Profile/ProfileEditSuccess';
import TermsScreen from './screens/Terms';
import PrivacyPolicyScreen from './screens/PrivacyPolicy';
import ContactSupportScreen from './screens/ContactSupport';
import AboutAppScreen from './screens/AboutApp';
import ChatScreen from './screens/Chat';
// import { useDispatch, useSelector } from 'react-redux';
import { RootState } from './store';
import FriendProfile from './screens/FriendProfile';
import MediaScreen from './screens/Media';
// import { resetAuth } from './store/slices/authSlice';
import GroupProfile from './screens/GroupProfile';
import GroupMembersScreen from './screens/GroupMembers';
import EditGroupScreen from './screens/EditGroup';
import MessageInfo from './screens/Chat/MessageInfo';
import strings from './utils/strings';
import AsyncStorage from '@react-native-async-storage/async-storage';
import PasswordChangedScreen from './screens/auth/PasswordChangedConfirmation';
import { useDispatch, useSelector } from 'react-redux';
// import { useAuthListener } from './hooks/useAuthListener';
import { setUser } from './store/slices/userSlice';
// import { useAuthListener } from './hooks/useAuthListener';
// import PasswordChangedScreen from './screens/auth/PasswordChangedConfirmation';
// import CustomStatusbar from './components/CustomStatusBar';
// Add your other screens here...

export type RootStackParamList = {
    [ Routes.WELCOME ]: undefined;
    [ Routes.ONBOARDING ]: undefined;
    [ Routes.LOGIN ]: undefined;
    [ Routes.SIGN_UP ]: undefined;
    [ Routes.GET_STARTED ]: undefined;
    [ Routes.SET_PASSWORD ]: undefined;

    // signupName: string;
    // signupEmail: string; // dynamic email
    // signupPhone: string; // dynamic phone

    [ Routes.VERIFY_EMAIL ]: {
        onEmailFrom: 'signup' | 'login' | 'forgetpassword' | 'editprofile', // to differentiate the flow
        // email: string;
        // phone?: string;
        // password?: string;
        onVerified?: () => Promise<void> | void;
    };
    [ Routes.VERIFY_PHONE ]: {
        onPhoneFrom: 'signup' | 'forgetpassword' | 'editprofile', // to differentiate the flow
        // phone: string;
        onVerified?: () => Promise<void> | void;
    };
    [ Routes.FORGET_PASSWORD ]: undefined;
    [ Routes.CREATE_NEW_PASSWORD ]: {
        onCreateNewPassFrom: 'email' | 'phone', // to differentiate the flow
        // email?: string;
        // phone?: string;
    };
    [ Routes.PASSWORD_CHANGED ]: undefined;
    [ Routes.ADD_FRIEND ]: undefined;
    [ Routes.CHATS ]: undefined;
    [ Routes.CHAT ]: {
        chatId: string;
        type: 'group' | 'private';
        friendUid?: string;
    };
    [ Routes.CREATE_GROUP ]: undefined;
    [ Routes.PROFILE_MENU ]: undefined;
    [ Routes.PROFILE ]: undefined;
    [ Routes.ABOUT_APP ]: undefined;
    [ Routes.TERMS ]: undefined;
    [ Routes.PRIVACY_POLICY ]: undefined;
    [ Routes.CONTACT_SUPPORT ]: undefined;
    [ Routes.FRIEND_PROFILE ]: {
        chatId: string,
        friendUid: string,
    };
    [ Routes.GROUP_PROFILE ]: {
        chatId: string,
    };
    [ Routes.GROUP_MEMBERS ]: {
        chatId: string,
    };
    [ Routes.EDIT_GROUP ]: {
        chatId: string,
    };
    [ Routes.MEDIA ]: {
        chatId: string,
    };
    [ Routes.PROFILE_EDIT_SUCCESS ]: undefined;
    [ Routes.MESSAGE_INFO ]: {
        messageId: string,
        chatId: string,
        type: 'group' | 'private';
        friendUid?: string;
    };

};


const Stack = createNativeStackNavigator<RootStackParamList>();


const AppNavigator = () => {
    const dispatch = useDispatch();
    // useAuthListener(); // Custom hook to listen to auth state changes
    const [ loading, setLoading ] = useState( true );

    useEffect( () => {
        const loadLanguage = async () => {
            const savedLang = await AsyncStorage.getItem( 'appLanguage' );
            console.log( savedLang, 'savedlang' );

            strings.setLanguage( savedLang || 'en-US' );
            dispatch( setUser( { language: savedLang || 'en-US' } ) );
            setLoading( false );
        };
        loadLanguage();
    }, [ dispatch ] );

    const isLoggedIn = useSelector( ( state: RootState ) => state.auth.isLoggedIn );


    const uid = useSelector( ( state: RootState ) => state.user.uid );
    console.log( "uid from AppNavigator ", uid );

    if ( loading ) return null;
    return (
        <NavigationContainer>
            <Stack.Navigator
                initialRouteName={ isLoggedIn ? "Chats" : "Welcome" }
                screenOptions={ { headerShown: false, headerShadowVisible: false } }
            >
                { StackScreen( Routes.WELCOME, WelcomeScreen ) }
                { StackScreen( Routes.ONBOARDING, OnboardingScreen ) }
                { StackScreen( Routes.GET_STARTED, GettingStartedScreen ) }
                { StackScreen( Routes.LOGIN, LoginScreen ) }
                { StackScreen( Routes.SIGN_UP, SignUpScreen ) }
                { StackScreen( Routes.SET_PASSWORD, SetPasswordScreen ) }
                { StackScreen( Routes.VERIFY_EMAIL, VerifyEmailScreen ) }
                { StackScreen( Routes.VERIFY_PHONE, VerifyPhoneScreen ) }
                { StackScreen( Routes.FORGET_PASSWORD, ForgetPasswordScreen ) }
                { StackScreen( Routes.CREATE_NEW_PASSWORD, CreateNewPasswordScreen ) }
                { StackScreen( Routes.PASSWORD_CHANGED, PasswordChangedScreen ) }
                { StackScreen( Routes.CHATS, ChatsScreen ) }
                { StackScreen( Routes.CHAT, ChatScreen ) }
                { StackScreen( Routes.MESSAGE_INFO, MessageInfo ) }
                { StackScreen( Routes.ADD_FRIEND, AddFriendScreen ) }
                { StackScreen( Routes.CREATE_GROUP, CreateGroupScreen ) }
                { StackScreen( Routes.PROFILE_MENU, ProfileMenuScreen ) }
                { StackScreen( Routes.PROFILE, ProfileScreen ) }
                { StackScreen( Routes.PROFILE_EDIT_SUCCESS, ProfileEditSuccess ) }
                { StackScreen( Routes.TERMS, TermsScreen ) }
                { StackScreen( Routes.PRIVACY_POLICY, PrivacyPolicyScreen ) }
                { StackScreen( Routes.CONTACT_SUPPORT, ContactSupportScreen ) }
                { StackScreen( Routes.ABOUT_APP, AboutAppScreen ) }
                { StackScreen( Routes.FRIEND_PROFILE, FriendProfile ) }
                { StackScreen( Routes.MEDIA, MediaScreen ) }
                { StackScreen( Routes.GROUP_PROFILE, GroupProfile ) }
                { StackScreen( Routes.GROUP_MEMBERS, GroupMembersScreen ) }
                { StackScreen( Routes.EDIT_GROUP, EditGroupScreen ) }

                {/* <Stack.Screen name="GroupMembers" component={ GroupMembersScreen } options={ { headerShown: false } } /> */ }

            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default AppNavigator;

export const StackScreen = (
    name: string,
    component: any,
    options: any = {},
) => {
    return (
        <Stack.Screen
            options={ {
                headerShown: false,
                ...options,
            } }
            name={ name }
            component={ component }
        />
    );
};
