import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../utils/firebaseConfig';
import { addMembersToGroup } from '../../api/groups';

export interface Member {
    id: string;
    name: string;
    phone: string;
    imageURL: string;
}

interface GroupMembersState {
    membersByGroup: {
        [ chatId: string ]: Member[];
    };
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

const initialState: GroupMembersState = {
    membersByGroup: {},
    status: 'idle',
    error: null,
};
const getUsersByIds = async ( userIds: string[] ): Promise<Member[]> => {
    const memberDocs = await Promise.all(
        userIds.map( async ( uid ) => {
            const docRef = doc( db, 'users', uid );
            const docSnap = await getDoc( docRef );
            if ( !docSnap.exists() ) return null;

            const data = docSnap.data();
            return {
                id: docSnap.id,
                name: data.name,
                phone: data.phone,
                imageURL: data.imageURL,
            };
        } )
    );

    return memberDocs.filter( Boolean ) as Member[];
};


// ✅ Thunk to fetch member data for one group
export const fetchGroupMembers = createAsyncThunk<
    { chatId: string; members: Member[] },
    { chatId: string; memberIds: string[] }
>(
    'groupMembers/fetchGroupMembers',
    async ( { chatId, memberIds } ) => {
        const members = await getUsersByIds( memberIds );
        return { chatId, members };
    }
);

// ✅ Thunk to add member data for one group
export const addGroupMembers = createAsyncThunk<
    { chatId: string; members: Member[] },
    { chatId: string; memberIds: string[] }
>(
    'groupMembers/addGroupMembers',
    async ( { chatId, memberIds }, thunkAPI ) => {
        try {
            // ✅ Step 1: Add members to Firestore group document
            await addMembersToGroup( chatId, memberIds );
            // ✅ Step 2: Fetch the user data of added members
            const members = await getUsersByIds( memberIds );
            return { chatId, members };

        }
        catch ( error ) {
            console.error( 'Error in addGroupMembers thunk:', error );
            return thunkAPI.rejectWithValue( 'Failed to add group members' );
        }
    }
);

const groupMembersSlice = createSlice( {
    name: 'groupMembers',
    initialState,
    reducers: {

        setGroupMembers( state, action: PayloadAction<
            {
                chatId: string;
                members: Member[];
            }> ) {
            const { chatId, members } = action.payload;
            state.membersByGroup[ chatId ] = members;

        },
        resetGroupMembers( state ) {
            console.log( "state.membersByGroup ", state.membersByGroup );
            state.membersByGroup = {};
            state.status = 'idle';
            state.error = null;
            console.log( "state.membersByGroup ", state.membersByGroup );
        },
    },
    extraReducers: ( builder ) => {
        builder
            .addCase( fetchGroupMembers.pending, ( state ) => {
                state.status = 'loading';
            } )
            .addCase( fetchGroupMembers.fulfilled, ( state, action ) => {
                const { chatId, members } = action.payload;
                state.membersByGroup[ chatId ] = members;
                state.status = 'succeeded';
            } )
            .addCase( fetchGroupMembers.rejected, ( state, action ) => {
                state.status = 'failed';
                state.error = action.error.message ?? null;
            } )
            .addCase( addGroupMembers.pending, ( state ) => {
                state.status = 'loading';
            } )
            .addCase( addGroupMembers.fulfilled, ( state, action ) => {
                const { chatId, members } = action.payload;
                const existing = state.membersByGroup[ chatId ] || [];

                const merged = [
                    ...existing,
                    ...members.filter(
                        ( newMember: Member ) => !existing.find( ( m ) => m.id === newMember.id )
                    ),
                ];

                state.membersByGroup[ chatId ] = merged;
                state.status = 'succeeded';
            } )

            .addCase( addGroupMembers.rejected, ( state, action ) => {
                state.status = 'failed';
                state.error = action.error.message ?? null;
            } );
    },
} );

export const { resetGroupMembers, setGroupMembers } = groupMembersSlice.actions;
export default groupMembersSlice.reducer;
