import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { getUserPrivateChats, createPrivateChatInFirestore } from '../../api/privateChats';
import { db } from '../../utils/firebaseConfig';
import { collection, query, where, orderBy, onSnapshot, Timestamp } from 'firebase/firestore';
// import { listenToMessages } from './messagesSlice';

// ✅ Define type
export interface PrivateChat {
    chatId: string;
    members: string[];
    lastMessage: string;
    createdAt: string;  // ISO string
    updatedAt: Timestamp | string;  // ISO string
    type: 'private';

}

// ✅ State
interface PrivateChatsState {
    items: PrivateChat[];
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

const initialState: PrivateChatsState = {
    items: [],
    status: 'idle',
    error: null
};

//
// ✅ Thunk: fetch all private chats where user is a member
//
export const fetchPrivateChats = createAsyncThunk<PrivateChat[], string>(
    'privateChats/fetchPrivateChats',
    async (uid: string) => {
        const chats = await getUserPrivateChats(uid);
        return chats.map(chat => ({
            ...chat,
            createdAt: typeof chat.createdAt === 'string'
                ? chat.createdAt
                : chat.createdAt?.toDate().toISOString() || '',
            updatedAt: typeof chat.updatedAt === 'string'
                ? chat.updatedAt
                : chat.updatedAt?.toDate().toISOString() || '',
        }));
    }
);

//
// ✅ Thunk: create new private chat (when adding a new friend)
//
export const createPrivateChat = createAsyncThunk<
    PrivateChat,
    { currentUserId: string; friendId: string }
>(
    'privateChats/createPrivateChat',
    async ( { currentUserId, friendId } ) => {
        return await createPrivateChatInFirestore( currentUserId, friendId );
    }
);
// ✅ Real-time listener
export const listenPrivateChats = createAsyncThunk<void, string>(
    'privateChats/listenPrivateChats',
    async ( uid, { dispatch } ) => {
        const q = query(
            collection( db, 'chats' ),
            where( 'members', 'array-contains', uid ),
            where( 'type', '==', 'private' ),
            orderBy( 'updatedAt', 'desc' )
        );

        onSnapshot( q, snapshot => {
            const chats: PrivateChat[] = snapshot.docs.map( docSnap => {
                const data = docSnap.data();
                // dispatch( listenToMessages( docSnap.id ) );
                return {
                    chatId: docSnap.id,
                    members: data.members,
                    lastMessage: data.lastMessage || '',
                     createdAt: data.createdAt instanceof Timestamp 
        ? data.createdAt.toDate().toISOString() 
        : (data.createdAt ?? ''),
    updatedAt: data.updatedAt instanceof Timestamp 
        ? data.updatedAt.toDate().toISOString() 
        : (data.updatedAt ?? ''),
                    type: 'private'
                };
            } );
            dispatch( setPrivateChats( chats ) );
        //     console.log( "listenedPrivateChats " );
        //   chats.forEach( c => console.log( c.chatId, c.updatedAt ) );

        }, error => {
            console.error( '❌ listenPrivateChats error:', error );
        } );
    }
);

//
// ✅ Slice
//
const privateChatsSlice = createSlice( {
    name: 'privateChats',
    initialState,
    reducers: {
        setPrivateChats( state, action: PayloadAction<PrivateChat[]> ) {
            state.items = action.payload;
        },
        resetPrivateChats( state ) {
            state.items = [];
            state.status = 'idle';
            state.error = null;
        }
    },
    extraReducers: ( builder ) => {
        builder
            .addCase( fetchPrivateChats.pending, ( state ) => {
                state.status = 'loading';
            } )
            .addCase( fetchPrivateChats.fulfilled, ( state, action: PayloadAction<PrivateChat[]> ) => {
                state.status = 'succeeded';
                state.items = action.payload;
            } )
            .addCase( fetchPrivateChats.rejected, ( state, action ) => {
                state.status = 'failed';
                state.error = action.error.message ?? null;
            } )
            //
            // handle createPrivateChat thunk
            //
            .addCase( createPrivateChat.fulfilled, ( state, action: PayloadAction<PrivateChat> ) => {
                // add new chat to items
                console.log( "action.payload ", action.payload );

                state.items.push( action.payload );
            } );
    }
} );

export const { setPrivateChats, resetPrivateChats } = privateChatsSlice.actions;
export default privateChatsSlice.reducer;
