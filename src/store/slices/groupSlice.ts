import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { createGroupChat, getUserGroups } from '../../api/groups'; // adjust path if different
import { db } from '../../utils/firebaseConfig';
import { collection, query, where, orderBy, onSnapshot, Timestamp } from 'firebase/firestore';
// import { listenToMessages } from './messagesSlice';

export interface Group {
    chatId: string;
    members: string[];
    type: 'group';
    groupName: string;
    imageURL: string;
    lastMessage: string;
    createdAt: string | Timestamp   ; // ISO string
    updatedAt: string | Timestamp; // ISO string
    adminId: string;
}

interface GroupsState {
    items: Group[];
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

const initialState: GroupsState = {
    items: [],
    status: 'idle',
    error: null,
};

// ✅ thunk: creates group in Firestore and returns it
export const createGroup = createAsyncThunk<
    Group,
    { selectedUsers: string[]; currentUserId: string; groupName: string; imageURL?: string }
>(
    'groups/createGroup',
    async ( { selectedUsers, currentUserId, groupName, imageURL } ) => {
        const group = await createGroupChat( selectedUsers, currentUserId, groupName, imageURL );
        // console.log( "createdGroup ", group );
        return group; // must match Group type
    }
);
export const fetchGroups = createAsyncThunk<Group[], string>(
    'groups/fetchGroups',
    async ( uid: string ) => {
        const groups = await getUserGroups( uid )
        // console.log( "gotUserGroups ", groups );
        return groups;
    }
);
export const listenGroups = createAsyncThunk<void, string>(
    'groups/listenGroups',
    async ( uid, { dispatch } ) => {
        const q = query(
            collection( db, 'chats' ),
            where( 'members', 'array-contains', uid ),
            where( 'type', '==', 'group' ),
            orderBy( 'updatedAt', 'desc' )
        );

        onSnapshot( q, snapshot => {
            const groups: Group[] = snapshot.docs.map( docSnap => {
                const data = docSnap.data();
                // console.log( "data ", data );
                // dispatch( listenToMessages( docSnap.id ) );
                return {
                    chatId: docSnap.id,
                    members: data.members,
                    groupName: data.groupName,
                    imageURL: data.imageURL,
                    lastMessage: data.lastMessage,
                    createdAt: data.createdAt instanceof Timestamp
                        ? data.createdAt.toDate().toISOString()
                        : ( data.createdAt ?? '' ),
                    updatedAt: data.updatedAt instanceof Timestamp
                        ? data.updatedAt.toDate().toISOString()
                        : ( data.updatedAt ?? '' ),
                    type: 'group',
                    adminId: data.adminId,
                };
            } );
            dispatch( setGroups( groups ) );
            // console.log( "listenedGroups " );
            // groups.forEach( c => console.log( c.chatId, c.updatedAt ) );
        }, error => {
            console.error( '❌ listenGroups error:', error );
        } );
    }
);

const groupsSlice = createSlice( {
    name: 'groups',
    initialState,
    reducers: {
        setGroups( state, action: PayloadAction<Group[]> ) {
            // console.log( "action.payload for setGroups", action.payload );
            state.items = action.payload;
            // console.log( "state.items after setGroups", state.items );
        },
        addGroup( state, action: PayloadAction<Group> ) {
            state.items.push( action.payload );
        },
        resetGroups( state ) {
            state.items = [];
            state.status = 'idle';
            state.error = null;
        },
        removeGroup: ( state, action: PayloadAction<string> ) => {
            state.items = state.items.filter( group => group.chatId !== action.payload );
            console.log( "Group Removed... " );
            console.log( "Groups left ", state.items.length );

        }

    },
    extraReducers: ( builder ) => {
        builder
            .addCase( createGroup.pending, ( state ) => {
                state.status = 'loading';
            } )
            .addCase( createGroup.fulfilled, ( state, action ) => {
                state.status = 'succeeded';
                // console.log( "action.payload to push in state.items ", action.payload );
                state.items.push( action.payload );
                // console.log( "state.items after group created and pushed ", state.items );

            } )
            .addCase( createGroup.rejected, ( state, action ) => {
                state.status = 'failed';
                state.error = action.error.message ?? null;
            } )
            .addCase( fetchGroups.pending, ( state ) => {
                state.status = 'loading';
            } )
            .addCase( fetchGroups.fulfilled, ( state, action: PayloadAction<Group[]> ) => {
                state.status = 'succeeded';
                state.items = action.payload;
            } )
            .addCase( fetchGroups.rejected, ( state, action ) => {
                state.status = 'failed';
                state.error = action.error.message ?? null;
            } );

    }
} );

export const { addGroup, resetGroups, setGroups, removeGroup } = groupsSlice.actions;
export default groupsSlice.reducer;
