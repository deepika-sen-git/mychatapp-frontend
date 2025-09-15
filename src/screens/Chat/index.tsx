import React, { useEffect, useRef, useState } from 'react';
import {
    View, Text, FlatList, Image, TextInput, TouchableOpacity, Modal, ScrollView,
    KeyboardAvoidingView
} from 'react-native';
import styles from './styles';
import svgImages from '../../utils/svgImages';
import Routes from '../../utils/Routes';
import { RootStackParamList } from '../../AppNavigator';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import CustomFancyHeader from '../../components/CustomHeader';
// import Colors from '../../theme/colors';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store';

import { Alert } from 'react-native';
import {
    collection, doc, addDoc, updateDoc, serverTimestamp,
    arrayUnion,
    writeBatch,
    query,
    onSnapshot,
    deleteDoc,
    getDoc,
    Timestamp
} from 'firebase/firestore';
import { db } from '../../utils/firebaseConfig';
import { Asset, launchImageLibrary } from 'react-native-image-picker';
import {compressMedia, uploadMediaToCloudinary } from '../../utils/uploadToCloudinary';
import Video from 'react-native-video';
import { pickCameraImageOrVideo } from '../../utils/imagePicker';
import { fetchGroupMembers } from '../../store/slices/groupMembersSlice';
import { cleanupMessages, listenToMessages, MessageType, stopListeningToMessages } from '../../store/slices/messagesSlice';
import strings from '../../utils/strings';
import { getChatDeleteSetting } from '../../api/privateChats';
import { updateLastMessage } from '../../api/messages';
import { compressImage } from '../../utils/compressImage';
// import { getChatDeleteSetting } from '../../api/privateChats';
// import { StyleSheet } from "react-native";
// import globalUse from "../../utils/globalUse";

type Props = NativeStackScreenProps<RootStackParamList, typeof Routes.CHAT>;

const ChatScreen: React.FC<Props> = ( { route, navigation } ) => {
    const { chatId, type, friendUid } = route.params;
    const { uid, name } = useSelector( ( state: RootState ) => state.user );
    const flatListRef = useRef<FlatList>( null );
    const [ initialScrollDone, setInitialScrollDone ] = useState( false );

    const messages = useSelector(
        ( state: RootState ) => state.messages.messagesByChat[ chatId ] || []
    );
    const [ text, setText ] = useState( '' );
    const [ showAttachmentModal, setShowAttachmentModal ] = useState( false );
    const [ attachmentsPreview, setAttachmentsPreview ] = useState<Asset[]>( [] );
    const [ previewAsset, setPreviewAsset ] = useState<Asset | { uri: string; type?: string } | null>( null );
    const [ showActions, setShowActions ] = useState<string | null>( null );
    const friend = useSelector( ( state: RootState ) =>
        state.friends.items.find( f => f.id === friendUid )
    );
    const group = useSelector( ( state: RootState ) =>
        state.groups.items.find( f => f.chatId === chatId )
    );
    // console.log("group-> ", group);

    const dispatch = useDispatch<AppDispatch>();

    // Scroll instantly to bottom on first load
    useEffect( () => {
        if ( !initialScrollDone && messages.length > 0 ) {
            flatListRef.current?.scrollToEnd( { animated: false } );
            setInitialScrollDone( true );
        }
    }, [ messages, initialScrollDone ] );

    // Auto-scroll for new messages only if already at bottom
    const handleContentSizeChange = () => {
        if ( initialScrollDone ) {
            flatListRef.current?.scrollToEnd( { animated: true } );
        }
    };



    useEffect( () => {
        if ( group?.chatId && group?.members?.length > 0 ) {
            dispatch( fetchGroupMembers( {
                chatId: group.chatId,
                memberIds: group.members,
            } ) );
        }
    }, [ dispatch, group ] );
    useEffect( () => {
        if ( !chatId ) return;

        // 👂 Start listening + cleanup
        dispatch( listenToMessages( chatId ) );
        dispatch( cleanupMessages( chatId ) );

        return () => {
            dispatch( stopListeningToMessages( chatId ) );
        };
    }, [ chatId, dispatch ] );


    // useEffect( () => {
    //     console.log( "messages text:", messages.map( message => `${ message.text } ${ message.seenBy.map( item => item.userId ) } ` )[ messages.length - 1 ] );
    // }, [ messages ] );


    // // 📡 Listen to chat messages
    // useEffect( () => {
    //     const q = query(
    //         collection( db, 'chats', chatId, 'messages' ),
    //         orderBy( 'createdAt' )
    //     );
    //     const unsubscribe = onSnapshot( q, snapshot => {
    //         const list = snapshot.docs.map( doc => ( { id: doc.id, ...( doc.data() as Omit<MessageType, 'id'> ) } ) );
    //         dispatch( setMessages( { chatId, messages: list } ) );
    //     } );
    //     return unsubscribe;
    // }, [ chatId, dispatch ] );

    useEffect( () => {
        const q = query( collection( db, 'chats', chatId, 'messages' ) );
        const unsub = onSnapshot( q, snapshot => {
            const batch = writeBatch( db );
            snapshot.docs.forEach( docSnap => {
                const data = docSnap.data();
                const alreadySeen = data.seenBy?.some( ( s: any ) => s.userId === uid );

                if ( !alreadySeen ) {
                    batch.update( docSnap.ref, {
                        seenBy: arrayUnion( { userId: uid, seenAt: new Date() } ) // client time
                    } );
                    // console.log( uid, "seen all messages in", chatId );
                }
            } );
            batch.commit();
        } );

        return unsub;
    }, [ chatId, uid ] );


    // 📤 Send message with Cloudinary URLs only
    const sendMessage = async () => {
        if ( !text.trim() && attachmentsPreview.length === 0 ) return;
        let textToSend = text;
        let attachmentsPreviewToSend = attachmentsPreview;
        console.log("attachmentsPreview", attachmentsPreview);
        
        setText( ' ' );
        setAttachmentsPreview( [] );

        try {
            let uploadedAttachments: { type: 'image' | 'video', url: string }[] = [];

            for ( const asset of attachmentsPreviewToSend ) {
                const compressedUri = await compressMedia( asset );

                const url = await uploadMediaToCloudinary( {
                    ...asset,
                    uri: compressedUri,
                } );
                

                if ( url ) {
                    const type = asset.type?.startsWith( 'video' ) ? 'video' : 'image';
                    uploadedAttachments.push( { type, url } );
                }
            }

            const now = new Date();
            const timeStr = `${ now.getHours().toString().padStart( 2, '0' ) }:${ now.getMinutes().toString().padStart( 2, '0' ) }`;
            // 1. Get delete setting
            const deleteAfterDays = await getChatDeleteSetting( chatId );

            // 2. Calculate expiresAt if needed
            let deleteAt = null;
            if ( deleteAfterDays && typeof deleteAfterDays === "number" ) {
                deleteAt = new Date();
                deleteAt.setDate( deleteAt.getDate() + deleteAfterDays );
            }
            await addDoc( collection( db, 'chats', chatId, 'messages' ), {
                text: textToSend.trim() || null,
                senderId: uid,
                senderName: name,
                createdAt: serverTimestamp(),
                time: timeStr,
                attachments: uploadedAttachments.length > 0 ? uploadedAttachments : null,
                deleteAt: deleteAt ? Timestamp.fromDate( deleteAt ) : null, // ✅
                seenBy: [ { userId: uid, seenAt: new Date() } ]

            } );

            await updateDoc( doc( db, 'chats', chatId ), {

                time: timeStr
            } );
            await updateLastMessage( chatId ); // ✅ update last message


        } catch ( e ) {
            console.error( '❌ Failed to send:', e );
        }
    };

    const handleDeleteMessage = async () => {
        try {
            const messageRef = doc( db, 'chats', chatId, 'messages', showActions! );

            // Get the deleted message data before removing it
            const messageSnap = await getDoc( messageRef );
            if ( !messageSnap.exists() ) return;

            // const deletedMessageData = messageSnap.data();

            // 1. Delete the message
            await deleteDoc( messageRef );
            setShowActions( null );

            // // 2. Check if it was the last message in Firestore
            // const chatRef = doc( db, 'chats', chatId );
            // const chatSnap = await getDoc( chatRef );
            // if ( !chatSnap.exists() ) return;

            // const { lastMessage } = chatSnap.data();

            // if (
            //     lastMessage === deletedMessageData.text ||
            //     lastMessage === '📎 Attachment' // for attachments
            // ) {
            //     // 3. Get the new last message
            //     const messagesRef = collection( db, 'chats', chatId, 'messages' );
            //     const q = query( messagesRef, orderBy( 'createdAt', 'desc' ), limit( 1 ) );
            //     const newLastMsgSnap = await getDocs( q );

            //     let newLastMessage = '';
            //     let newUpdatedAt = null;
            //     if ( !newLastMsgSnap.empty ) {
            //         const msgData = newLastMsgSnap.docs[ 0 ].data();
            //         newLastMessage = msgData.text || ( msgData.attachments?.length ? '📎 Attachment' : '' );
            //         newUpdatedAt = msgData.createdAt || serverTimestamp(); // Prefer createdAt
            //     }

            //     // 4. Update chat doc
            //     await updateDoc( chatRef, {
            //         lastMessage: newLastMessage,
            //         updatedAt: newUpdatedAt
            //     } );
            
            await updateLastMessage( chatId ); // ✅ update last message
        } catch ( e ) {
            console.error( '❌ Failed to delete message:', e );
        }
    };




    const handleCameraImagePick = () => {
        console.log( "Handling camera image pick..." );

        Alert.alert(
            'Select Media Type',
            'Do you want to capture a Photo or Record a Video?',
            [
                {
                    text: 'Photo',
                    onPress: async () => {
                        const asset = await pickCameraImageOrVideo( 'photo' );
                        if ( asset ) {
                            setAttachmentsPreview( prev => [ ...prev, asset ] );
                        }
                        setShowAttachmentModal( false );
                    },
                },
                {
                    text: 'Video',
                    onPress: async () => {
                        const asset = await pickCameraImageOrVideo( 'video' );
                        if ( asset ) {
                            setAttachmentsPreview( prev => [ ...prev, asset ] );
                        }
                        setShowAttachmentModal( false );
                    },
                },
                { text: 'Cancel', style: 'cancel' },
            ],
            { cancelable: true }
        );
    };

    const handleGalleryImagePick = async () => {
        const res = await launchImageLibrary( { mediaType: 'mixed', selectionLimit: 5, quality: 0.8 } );
        if ( !res.didCancel && res.assets ) setAttachmentsPreview( res.assets );
        setShowAttachmentModal( false );
    }
    const handleShowInfo = () => {
        navigation.navigate( Routes.MESSAGE_INFO, {
            chatId,
            messageId: showActions,
            type,
            friendUid: friendUid

        } );
        setShowActions( null )
    }


    // 🖼 Render message item outside return
    const renderItem = ( { item }: { item: MessageType } ) => {
        const isMyMsg = item.senderId === uid;
        const isSeen = type === 'group' ? item.seenBy.length === group?.members?.length : item.seenBy.some( user => user.userId === friendUid );

        return (
            <TouchableOpacity
                style={ [ styles.messageContainer, isMyMsg ? styles.myMessage : styles.otherMessage ] }
                onLongPress={ () => setShowActions( item.id ) }
            >
                { type === 'group' && !isMyMsg && (
                    <Text style={ styles.sender }>{ item.senderName || strings.deletedUser }</Text>
                ) }

                { item.text && <Text style={ styles.messageText }>{ item.text }</Text> }
                { item.attachments && (
                    <View style={ [ styles.attachmentsRow, isMyMsg ? { alignSelf: 'flex-end' }:{alignSelf:'flex-start'}]}>
                        { item.attachments.map( ( file, idx ) => {
                            const isVideo = file.type === 'video';
                            const uri = file.url;

                            return (
                                <View key={ idx }>

                                    { isVideo ?
                                        <TouchableOpacity onPress={ () => setPreviewAsset( { uri, type: isVideo ? 'video/mp4' : 'image/*' } ) } style={ { position: 'relative', marginRight: 8 } }>
                                            {/* <Video source={ { uri: item.uri } } style={ styles.mediaItem } /> */ }
                                            <Image source={ { uri: uri.replace( '/upload/', '/upload/so_2/' ).replace( '.mp4', '.jpg' ) } } style={ styles.attachmentImage } />
                                            <View style={ styles.previewVideo }>
                                                <svgImages.VideoPlayIcon width={ 32 } height={ 32 } />
                                            </View>
                                        </TouchableOpacity>
                                        :
                                        <TouchableOpacity onPress={ () => setPreviewAsset( { uri, type: isVideo ? 'video/mp4' : 'image/*' } ) } >
                                            <Image source={ { uri } } style={ styles.attachmentImage } />
                                        </TouchableOpacity> }
                                </View>
                            );

                        } ) }
                    </View>
                ) }

                <View style={ { flexDirection: 'row', justifyContent: isMyMsg ? 'flex-end' : 'flex-start', gap: 5 } }>
                    <Text style={ styles.time }>{ item.time }</Text>
                    { isMyMsg && isSeen && <svgImages.SeenIcon /> }
                    { isMyMsg && !isSeen && <svgImages.UnseenIcon /> }
                </View>
            </TouchableOpacity>
        );
    };
    // console.log( "chatId ", chatId );


    return (
        <View style={ { flex: 1 } }>
            <CustomFancyHeader
                leftIcon={ <svgImages.ArrowLeftIcon /> }
                leftStyle={ { opacity: 0.6 } }
                onLeftPress={ () => navigation.reset( {
                    index: 0,
                    routes: [ { name: Routes.CHATS } ]
                } ) }
                centerTitle={ strings.messages }
                showSubHeader
                subHeaderTitle={ type === 'group' ? group?.groupName : friend?.name ? friend?.name : strings.deletedUser }
                subHeaderSubtitle={ type === 'group' ? `${ strings.tapToViewGroupInfo }` : friend?.phone }
                subHeaderRightIcon={ <svgImages.DotsCircleIcon /> }
                subHeaderAvatar={
                    type === 'group' ?
                        group?.imageURL ? group?.imageURL : 'groupProfile'
                        :
                        friend?.imageURL ? friend?.imageURL : 'userProfile'

                }
                onSubHeaderPress={ () => { friendUid ? navigation.navigate( Routes.FRIEND_PROFILE, { chatId, friendUid } ) : navigation.navigate( Routes.GROUP_PROFILE, { chatId } ) } }
                onSubHeaderRightPress={ () => { friendUid ? navigation.navigate( Routes.FRIEND_PROFILE, { chatId, friendUid } ) : navigation.navigate( Routes.GROUP_PROFILE, { chatId } ) } }

            />

            <KeyboardAvoidingView style={ styles.container }>
                <FlatList
                    ref={ flatListRef }
                    data={ messages }
                    keyExtractor={ item => item.id }
                    renderItem={ renderItem }
                    contentContainerStyle={ { padding: 20 } }
                    onContentSizeChange={ handleContentSizeChange }
                />

                {/* Input row */ }
                <View style={ { borderTopWidth: 1, borderTopColor: '#eee' } }>
     
                    <View style={ styles.inputRow }>
                        <TouchableOpacity onPress={ () => setShowAttachmentModal( true ) }>
                            <svgImages.AddIcon />
                        </TouchableOpacity>
                        <View style={ styles.input }>
                            { attachmentsPreview.length > 0 && (
                                <ScrollView horizontal style={ { marginVertical: 8, marginLeft: 10 } }>
                                    { attachmentsPreview.map( ( item, idx ) => (
                                        <TouchableOpacity
                                            key={ idx }
                                            onPress={ () => setPreviewAsset( item ) }
                                            style={ { position: 'relative', marginRight: 8 } }
                                        >
                                            <Image
                                                source={ { uri: item.uri } }
                                                style={ { width: 80, height: 80, borderRadius: 8 } }
                                            />
                                            { item.type?.startsWith( 'video' ) && (
                                                <View style={ styles.previewVideo }>
                                                    <svgImages.VideoPlayIcon width={ 30 } height={ 30 } />
                                                </View>
                                            ) }
                                        </TouchableOpacity>

                                    ) ) }
                                </ScrollView>
                            ) }
                            <TextInput

                                value={ text }
                                onChangeText={ setText }
                                placeholder={ strings.typeMessage }
                            />
                        </View>

                        <TouchableOpacity onPress={ sendMessage }>
                            <svgImages.SendIcon />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Preview modal */ }
                <Modal visible={ !!previewAsset } animationType="fade">
                    <View style={ styles.previewModal }>
                        <TouchableOpacity onPress={ () => setPreviewAsset( null ) } style={ styles.crossIcon }>
                            <svgImages.CrossIcon width={ 40 } height={ 40 } />
                        </TouchableOpacity>
                        { previewAsset?.type?.startsWith( 'video' ) ? (
                            <Video source={ { uri: previewAsset.uri } } style={ styles.previewAsset } controls resizeMode="contain" />
                        ) : (
                            <Image source={ { uri: previewAsset?.uri } } style={ styles.previewAsset } resizeMode="contain" />
                        ) }
                    </View>
                </Modal>
                {/* Modal for actions */ }
                <Modal visible={ !!showActions } transparent animationType="fade">
                    <TouchableOpacity style={ styles.modalOverlay } onPress={ () => setShowActions( null ) }>
                        <View style={ styles.modalCard }>
                            <TouchableOpacity style={ styles.actionButton } onPress={ () => handleShowInfo() }>
                                <svgImages.InfoIcon />
                                <Text style={ styles.actionText }>{ strings.info }</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={ styles.actionButton } onPress={ () => handleDeleteMessage() }>
                                <svgImages.DustBinBold />
                                <Text style={ styles.actionText }>{ strings.delete }</Text>
                            </TouchableOpacity>
                        </View>
                    </TouchableOpacity>
                </Modal>

                {/* Attachment modal */ }
                <Modal visible={ showAttachmentModal } transparent animationType="fade">
                    <TouchableOpacity style={ { flex: 1 } } activeOpacity={ 1 } onPress={ () => setShowAttachmentModal( false ) }>
                        <View style={ styles.attModal }>
                            <TouchableOpacity
                                onPress={ handleCameraImagePick }
                                style={ styles.attModalBtn }
                            >
                                <svgImages.CameraIcon width={ 43 } height={ 43 } />
                                <Text style={ { fontWeight: '500' } }>{ strings.camera }</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={ handleGalleryImagePick }
                                style={ styles.attModalBtn }
                            >
                                <svgImages.GalleryIcon width={ 43 } height={ 43 } />
                                <Text style={ { fontWeight: '500' } }>{ strings.gallery }</Text>
                            </TouchableOpacity>
                        </View>
                    </TouchableOpacity>
                </Modal>
            </KeyboardAvoidingView>
        </View>
    );
};

export default ChatScreen;



