import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { getFriendsData } from '../../api/friends';
import { onSnapshot, doc, getDoc } from 'firebase/firestore';
import { db } from '../../utils/firebaseConfig';

export interface Friend {
    id: string;
    name: string;
    imageURL: string;
    email: string;
    phone: string;
    userCode: string;
}
interface FriendsState {
    items: Friend[];
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

const initialState: FriendsState = {
    items: [],
    status: 'idle',
    error: null
};

export const fetchFriends = createAsyncThunk<Friend[], string>(
    'friends/fetchFriends',
    async ( uid: string ) => {
        return await getFriendsData( uid );

    }
);
export const listenFriends = createAsyncThunk<void, string>(
    'friends/listenFriends',
    async ( uid, { dispatch } ) => {
        const userDocRef = doc( db, 'users', uid );

        onSnapshot( userDocRef, async ( docSnap ) => {
            if ( docSnap.exists() ) {
                const userData = docSnap.data();
                const friendsList = userData.friends || [];

                if ( Array.isArray( friendsList ) ) {
                    const friendsData = await Promise.all(
                        friendsList.map( async ( friendUid: string | undefined ) => {
                            if ( !friendUid ) return null;
                            const friendDoc = await getDoc( doc( db, 'users', friendUid ) );
                            return friendDoc.exists()
                                ? { id: friendDoc.id, ...( friendDoc.data() as any ) }
                                : null;
                        } )
                    );

                    dispatch( setFriends( friendsData.filter( Boolean ) as Friend[] ) );
                }
            }
        }, ( error ) => {
            console.error( "❌ listenFriends error:", error );
        } );
    }
);


const friendsSlice = createSlice( {
    name: 'friends',
    initialState,
    reducers: {
        addFriend( state, action ) {
            const newFriend = action.payload as Friend;
            if ( !state.items.some( friend => friend.id === newFriend.id ) ) {
                state.items.push( newFriend );
            }
        },
        resetFriends( state ) {
            state.items = [];
            state.status = 'idle';
            state.error = null;
        },
        setFriends( state, action: PayloadAction<Friend[]> ) {
            state.items = action.payload;
        }

    },
    extraReducers: ( builder ) => {
        builder
            .addCase( fetchFriends.pending, ( state ) => {
                state.status = 'loading';
            } )
            .addCase( fetchFriends.fulfilled, ( state, action ) => {
                state.status = 'succeeded';
                state.items = action.payload;
            } )
            .addCase( fetchFriends.rejected, ( state, action ) => {
                state.status = 'failed';
                state.error = action.error.message ?? null;
            } );
    }
} );

export default friendsSlice.reducer;
export const { addFriend, resetFriends, setFriends } = friendsSlice.actions;
