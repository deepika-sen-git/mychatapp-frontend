import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import {
    collection,
    onSnapshot,
    orderBy,
    query,
    Timestamp,
    DocumentData,
    QuerySnapshot,
    doc,
    deleteDoc,
} from 'firebase/firestore';
import { formatMessageDate } from '../../utils/formatMessageDate';
import { db } from '../../utils/firebaseConfig';
import { updateLastMessage } from '../../api/messages';

export type MessageType = {
    id: string;
    text?: string;
    attachments?: { url: string; type: string }[];
    createdAt: Timestamp ;
    senderId: string;
    senderName: string;
    time: string;
    deleteAt?: Timestamp | null;
    seenBy: { userId: string; seenAt: Date }[];
};

type MediaType = {
    id: string;
    uri: string;
    date: string;
    type: string;
    createdAt: Timestamp;
    deleteAt?: Timestamp | null;
};

type MessagesState = {
    messagesByChat: { [ chatId: string ]: MessageType[] };
    mediaByChat: { [ chatId: string ]: MediaType[] };
    cleanupStatus?: 'idle' | 'loading' | 'succeeded' | 'failed';
};

const initialState: MessagesState = {
    messagesByChat: {},
    mediaByChat: {},
    cleanupStatus: 'idle',
};

const unsubscribeMap: Record<string, () => void> = {};

// 📌 Listen to live messages
export const listenToMessages = createAsyncThunk(
    'messages/listenToMessages',
    async ( chatId: string, { dispatch } ) => {
        if ( unsubscribeMap[ chatId ] ) unsubscribeMap[ chatId ]();

        const q = query(
            collection( db, 'chats', chatId, 'messages' ),
            orderBy( 'createdAt', 'asc' )
        );

        const unsubscribe = onSnapshot( q, ( snapshot: QuerySnapshot<DocumentData> ) => {
            const messages: MessageType[] = [];
            const media: MediaType[] = [];
            const now = new Date();

            snapshot.forEach( ( docSnap ) => {
                const data = docSnap.data();
                const deleteAt = data.deleteAt?.toDate?.();

                // ⏰ Skip expired (UI only – cleanup thunk will delete)
                if ( deleteAt && deleteAt <= now ) return;

                const msg: MessageType = {
                    id: docSnap.id,
                    text: data.text,
                    attachments: data.attachments,
                    createdAt: data.createdAt,
                    senderId: data.senderId,
                    senderName: data.senderName,
                    time: data.time,
                    deleteAt: data.deleteAt || null,
                    seenBy: data.seenBy,
                };
                messages.push( msg );

                if ( Array.isArray( data.attachments ) ) {
                    data.attachments.forEach( ( att: any ) => {
                        media.push( {
                            id: `${ docSnap.id }_${ att.url }`,
                            uri: att.url,
                            type: att.type,
                            date: formatMessageDate( data.createdAt?.toDate?.() || new Date() ),
                            createdAt: data.createdAt,
                            deleteAt: data.deleteAt || null,
                        } );
                    } );
                }
            } );

            dispatch( setMessages( { chatId, messages } ) );
            dispatch( setChatMedia( { chatId, media } ) );
        } );
        await updateLastMessage( chatId ); // ✅ update last message
        unsubscribeMap[ chatId ] = unsubscribe;
    }
);

// 📌 Stop listening
export const stopListeningToMessages = createAsyncThunk(
    'messages/stopListeningToMessages',
    async ( chatId: string, { dispatch } ) => {
        if ( unsubscribeMap[ chatId ] ) {
            unsubscribeMap[ chatId ]();
            delete unsubscribeMap[ chatId ];
        }
        dispatch( clearMessages( { chatId } ) );
        dispatch( clearChatMedia( { chatId } ) );
    }
);

// 📌 Cleanup thunk → delete from Firestore + update Redux
export const cleanupMessages = createAsyncThunk(
    'messages/cleanupMessages',
    async ( chatId: string, { getState } ) => {
        const state = getState() as { messages: MessagesState };
        const currentMessages = state.messages.messagesByChat[ chatId ] || [];

        const now = new Date();
        const expiredMessages = currentMessages.filter(
            ( msg ) => msg.deleteAt && msg.deleteAt.toDate() <= now
        );
        const remainingMessages = currentMessages.filter(
            ( msg ) => !msg.deleteAt || msg.deleteAt.toDate() > now
        );

        // 🔥 Delete from Firestore
        for ( const msg of expiredMessages ) {
            await deleteDoc( doc( db, 'chats', chatId, 'messages', msg.id ) );
        }
        

        return { chatId, remainingMessages };
    }
);

const messagesSlice = createSlice( {
    name: 'messages',
    initialState,
    reducers: {
        setMessages: (
            state,
            action: PayloadAction<{ chatId: string; messages: MessageType[] }>
        ) => {
            state.messagesByChat[ action.payload.chatId ] = action.payload.messages;
        },
        clearMessages: ( state, action: PayloadAction<{ chatId: string }> ) => {
            delete state.messagesByChat[ action.payload.chatId ];
        },
        setChatMedia: (
            state,
            action: PayloadAction<{ chatId: string; media: MediaType[] }>
        ) => {
            state.mediaByChat[ action.payload.chatId ] = action.payload.media;
        },
        clearChatMedia: ( state, action: PayloadAction<{ chatId: string }> ) => {
            delete state.mediaByChat[ action.payload.chatId ];
        },
    },
    extraReducers: ( builder ) => {
        builder
            .addCase( cleanupMessages.pending, ( state ) => {
                state.cleanupStatus = 'loading';
            } )
            .addCase( cleanupMessages.fulfilled, ( state, action ) => {
                const { chatId, remainingMessages } = action.payload;
                state.messagesByChat[ chatId ] = remainingMessages;
                state.cleanupStatus = 'succeeded';
            } )
            .addCase( cleanupMessages.rejected, ( state ) => {
                state.cleanupStatus = 'failed';
            } );
    },
} );

export const {
    setMessages,
    clearMessages,
    setChatMedia,
    clearChatMedia,
} = messagesSlice.actions;

export default messagesSlice.reducer;
