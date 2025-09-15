// src/store/slices/userSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserState {
    uid: string;
    name: string;
    email: string;
    phone: string;
    imageURL: string;
    userCode: string;
    createdAt: string | null;
    language?: string;
}

const initialState: UserState = {
    uid: '',
    name: '',
    email: '',
    phone: '',
    imageURL: '',
    userCode: '',
    createdAt: null,
    language:'',
};

export const userSlice = createSlice( {
    name: 'user',
    initialState,
    reducers: {
        setUserProfile: ( state, action: PayloadAction<UserState> ) => {
            return action.payload; // replace entire profile
        },
        setUser: ( state, action: PayloadAction<Partial<UserState>> ) => {
            Object.assign( state, action.payload );
        },

        resetUserProfile: () => initialState,
        
    },
} );

export const { setUserProfile, setUser, resetUserProfile } = userSlice.actions;
export default userSlice.reducer;
