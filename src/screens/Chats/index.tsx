import React, { useEffect, useMemo, useCallback, useRef, useState } from 'react';
import { View, TouchableOpacity, Pressable, Text, Image, FlatList, Alert } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import svgImages from '../../utils/svgImages';
import CustomFancyHeader from '../../components/CustomHeader';
import ChatsList, { ChatItemType } from '../../components/ChatsList';
import { RootStackParamList } from '../../AppNavigator';
import { AppDispatch, RootState } from '../../store';
import { listenPrivateChats } from '../../store/slices/privateChatsSlice';
import { listenGroups } from '../../store/slices/groupSlice';
import Colors from '../../theme/colors';
import styles from './styles';
import { chatListItemStyle } from '../../components/ChatListItem';
import globalUse, { wp } from '../../utils/globalUse';
import Routes from '../../utils/Routes';
import { selectCombinedChats } from '../../selectors/chatsSelectors';
import { listenFriends } from '../../store/slices/friendsSlice';
import strings from '../../utils/strings';
import { listenToMessages, stopListeningToMessages } from "../../store/slices/messagesSlice";
import { selectAllMessages } from '../../selectors/selectAllMessages';
import { useStatusBarColor } from '../../context';
import { useFocusEffect } from '@react-navigation/native';

type Props = NativeStackScreenProps<RootStackParamList, typeof Routes.CHATS>;

const ChatsScreen: React.FC<Props> = ( { navigation } ) => {
     const { setColor } = useStatusBarColor();
            
                useFocusEffect(
                    React.useCallback( () => {
                        setColor( Colors.appHeader );  
                    }, [] )
                );
    const dispatch = useDispatch<AppDispatch>();
    const { uid } = useSelector( ( state: RootState ) => state.user );
    // const privateChats = useSelector( ( state: RootState ) => state.privateChats.items );
    // const groups = useSelector( ( state: RootState ) => state.groups.items );
    // const friends = useSelector( ( state: RootState ) => state.friends.items );

    const chats = useSelector( selectCombinedChats );
    const messages = useSelector( selectAllMessages );
    const totalFriends = useSelector( ( state: RootState ) => state.friends.items.length );

    const [ searchValue, setSearchValue ] = useState( "" );

    const [ showDropdown, setShowDropdown ] = React.useState( false );
    const [ showSearchBar, setShowSearchBar ] = React.useState( false );

    // console.log( "chats ", chats );
    // console.log( 'chats data:', chats.map( c => c.id ) );

    // listen Firestore in real time
    useEffect( () => {
        if ( uid ) {
            dispatch( listenPrivateChats( uid ) );
            dispatch( listenGroups( uid ) );
            dispatch( listenFriends( uid ) );
        }
    }, [ uid, dispatch ] );


    // useEffect( () => {
    //     if ( chats.length === 0 ) return;

    //     // Start listening for all chats
    //     chats.forEach( chat => {
    //         dispatch( listenToMessages( chat.id ) );
    //         console.log("Listening to messages for chat: ", chat.id);

    //     } );

    //     // Cleanup listeners when screen unmounts
    //     return () => {
    //         chats.forEach( chat => {
    //             dispatch( stopListeningToMessages( chat.id ) );
    //         } );
    //     };
    // }, [ chats, dispatch ] );


    // Inside your component
    const prevChatsRef = useRef<string[]>( [] );

    useEffect( () => {
        if ( chats.length === 0 ) return;

        const prevChats = prevChatsRef.current;
        const newChats = chats.map( c => c.id );

        // find added & removed chats
        const added = newChats.filter( id => !prevChats.includes( id ) );
        const removed = prevChats.filter( id => !newChats.includes( id ) );

        // add new listeners
        added.forEach( id => {
            dispatch( listenToMessages( id ) );
            // console.log( "✅ Listening to messages for chat:", id );
        } );

        // remove old listeners
        removed.forEach( id => {
            dispatch( stopListeningToMessages( id ) );
            // console.log( "🛑 Stopped listening for chat:", id );
        } );

        // update ref for next run
        prevChatsRef.current = newChats;
    }, [ chats, dispatch ] );

    const handleCreateGroup = () => {
        
            if ( totalFriends === 0 ) {
                Alert.alert( "You don't have friends to create group" );
            } else {
                navigation.navigate( Routes.CREATE_GROUP );
                setShowDropdown( false );
            }
        
    }


    const handlePressItem = useCallback(
        ( item: ChatItemType ) => {
            navigation.navigate( Routes.CHAT, {
                chatId: item.id,
                type: item.isGroup ? 'group' : 'private',
                friendUid: item.friendUid
            } );
        },
        [ navigation ]
    );

    // Search logic
    const searchResults = useMemo( () => {
        if ( !showSearchBar || !searchValue.trim() ) return [];

        const q = searchValue.toLowerCase();
        const results: any[] = [];
        console.log(chats, "chats");

        // 🔍 Search in chats
        chats.forEach( ( chat ) => {
            if ( chat.name.toLowerCase().includes( q ) ) {
                results.push( {
                    type: "chat",
                    chatId: chat.id,
                    title: chat.name,
                    subtitle: "Chat name match",
                    avatar: chat.avatar,
                    isGroup: chat.isGroup,
                    friendUid: chat.friendUid,
                } );
            }

            if ( !chat.isGroup && chat.phone?.includes( q ) ) {
                results.push( {
                    type: "phone",
                    chatId: chat.id,
                    title: chat.name,
                    subtitle: `Phone: ${ chat.phone }`,
                    avatar: chat.avatar,
                    isGroup: chat.isGroup,
                    friendUid: chat.friendUid,
                } );
            }

            if ( !chat.isGroup && chat.email?.includes( q ) ) {
                results.push( {
                    type: "email",
                    chatId: chat.id,
                    title: chat.name,
                    subtitle: `Email: ${ chat.email }`,
                    avatar: chat.avatar,
                    isGroup: chat.isGroup,
                    friendUid: chat.friendUid,
                } );
            }
        } );

        // 🔍 Search in messages
        messages.forEach( ( msg: any ) => {
            if ( msg.text?.toLowerCase().includes( q ) ) {
                console.log("Message match:", msg.text, q);
                
                const parentChat = chats.find( ( c ) => c.id === msg.chatId );
                if ( parentChat ) {
                    results.push( {
                        type: "message",
                        chatId: parentChat.id,
                        title: parentChat.name,
                        subtitle: `Message: ${ msg.text }`,
                        avatar: parentChat.avatar,
                        isGroup: parentChat.isGroup,
                        friendUid: parentChat.friendUid,
                    } );
                }
            }
        } );
        return results;
    }, [ showSearchBar, searchValue, chats, messages ] );


    const renderItem = ( { item } ) => (
        <TouchableOpacity
            style={chatListItemStyle.container}
            onPress={ () => {
                setSearchValue( '' );
                setShowSearchBar( false );
                navigation.navigate( Routes.CHAT, {
                    chatId: item.chatId,
                    type: item.isGroup ? 'group' : 'private',
                    friendUid: item.friendUid
                } )
            }
                
            }
        >

            { item.avatar ? (
                <Image source={ { uri: item.avatar } } style={chatListItemStyle.avatar } />
            ) : (
                <View>
                        { item.isGroup ? <Image source={ require( '../../assets/pngs/GroupProfile.png' ) } style={ chatListItemStyle.avatar } />
                            : <Image source={ require( '../../assets/pngs/EmptyProfile.png' ) } style={ chatListItemStyle.avatar } />

 }
                </View>
            ) }

            <View style={chatListItemStyle.content }>
                <Text style={ chatListItemStyle.name }>{ item.title }</Text>
                { item.subtitle && (
                    <Text style={ chatListItemStyle.message } numberOfLines={ 1 }>
                        { item.subtitle }
                    </Text>
                ) }
            </View>
        </TouchableOpacity>
    );


    const rightIcons = useMemo( () => [
        <TouchableOpacity key="search" onPress={ () => setShowSearchBar( prev => !prev ) } style={ { marginRight: 16 } }>
            <svgImages.SearchIcon />
        </TouchableOpacity>,
        <TouchableOpacity key="menu" onPress={ () => navigation.navigate( Routes.PROFILE_MENU ) }>
            <svgImages.MenuIcon />
        </TouchableOpacity>
    ], [ navigation ] );
    // console.log( "chats ", chats );

    return (
        <View style={ { flex: 1 } }>
            <CustomFancyHeader
                leftTitle={ strings.MyChat }
                showSearch={ showSearchBar }
                rightIcons={ rightIcons }
                searchValue={ searchValue }
                onSearchChange={ setSearchValue }
                onSearchClear={ () => {
                    setSearchValue( '' );
                    setShowSearchBar( false );
                } }
            />
            <View style={ { marginTop: 0.5, padding: 5, backgroundColor: Colors.lightBG, height: globalUse.HEIGHT * 0.9 } }>
                { searchValue ?
                    ( searchResults.length ? <FlatList
                        data={ searchResults }
                        keyExtractor={ ( _, i ) => i.toString() }
                        renderItem={ renderItem }
                    /> : <View style={{alignItems:'center', margin:wp(20)}}>
                        <Text style={{color:Colors.subHeading}}>No Results Found</Text>
                    </View> )
                   : null }

                { !searchValue ? (
                    chats.length === 0 ? (
                        <View style={ { alignItems: 'center', marginTop: globalUse.HEIGHT * 0.2, opacity: 0.1 } }>
                            <svgImages.UserPlusIcon />
                        </View>
                    ) : (
                        <ChatsList data={ chats } onPressItem={ handlePressItem } />
                    )
                ) : ( null ) }



            </View>

            {/* Floating + dropdown */ }
            <View style={ styles.floatingContainer }>
                { showDropdown && (
                    <View style={ styles.dropdown }>
                        <Pressable style={ ( { pressed } ) => [ styles.dropdownItem, pressed && styles.dropdownItemPressed ] }
                            onPress={ () => { navigation.navigate( Routes.ADD_FRIEND ); setShowDropdown( false ); } }>
                            <svgImages.UserPlusIcon1 />
                            <Text style={ styles.dropdownText }>{ strings.addFriend }</Text>
                        </Pressable>
                        <View style={ {borderBottomColor:Colors.textInputBorder, borderBottomWidth:1} } />
                        <Pressable style={ ( { pressed } ) => [ styles.dropdownItem, pressed && styles.dropdownItemPressed ] }
                            onPress={handleCreateGroup}>
                            <svgImages.UsersPlusIcon />
                            <Text style={ styles.dropdownText }>{ strings.createGroup }</Text>
                        </Pressable>
                    </View>
                ) }
                <TouchableOpacity onPress={ () => setShowDropdown( prev => !prev ) } style={ styles.plusIcon }>
                    <svgImages.PlusIcon />
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default ChatsScreen;
