// src/store/slices/authSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
    name: string;
    email: string;
    phone: string;
    password: string;
    isEmailVerified: boolean;
    isPhoneVerified: boolean;
    user: any | null; // store full logged-in user data here
    imageURL: string;
    userCode: string;
    isLoggedIn: boolean;
}

const initialState: AuthState = {
    name: '',
    email: '',
    phone: '',
    password: '',
    imageURL: '',
    isEmailVerified: false,
    isPhoneVerified: false,
    user: null,
    userCode: '',
    isLoggedIn: false,
};

export const authSlice = createSlice( {
    name: 'auth',
    initialState,
    reducers: {
        setAuthInfo: ( state, action: PayloadAction<{ name?: string; email: string; phone: string; password?: string; imageURL?: string }> ) => {
            state.name = action.payload.name || state.name;
            state.email = action.payload.email;
            state.phone = action.payload.phone;
            state.password = action.payload.password || state.password;
            state.imageURL = action.payload.imageURL || state.imageURL;
        },
        setAuthField: ( state, action: PayloadAction<{ field: keyof AuthState; value: any }> ) => {
            state[ action.payload.field ] = action.payload.value;
        },
        setEmailVerified: ( state, action: PayloadAction<boolean> ) => {
            state.isEmailVerified = action.payload;
        },
        setPhoneVerified: ( state, action: PayloadAction<boolean> ) => {
            state.isPhoneVerified = action.payload;
        },
        setAuthUser: ( state, action: PayloadAction<any> ) => {
            state.user = action.payload;
        },
        resetAuth: () => initialState,
        setLoggedIn: ( state, action ) => {
            state.isLoggedIn = action.payload;
        },
        logout: ( state ) => {
            state.isLoggedIn = false;
            state.isEmailVerified = false;
            // optionally clear other user data
        },
        clearAuthTempData: ( state ) => {
            state.name = '';
            state.email = '';
            state.phone = '';
            state.password = '';
            state.imageURL = '';
            state.isEmailVerified = false;
            state.isPhoneVerified = false;
            state.userCode = '';
            // keep isLoggedIn untouched
        },
    },
} );

export const { setAuthInfo, setEmailVerified, setPhoneVerified, setAuthUser, resetAuth, setLoggedIn, logout, clearAuthTempData, setAuthField } = authSlice.actions;
export default authSlice.reducer;
