import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage'; // make sure you have this installed
import authReducer from './slices/authSlice';
import userReducer from './slices/userSlice';
import friendsReducer from './slices/friendsSlice';
import groupReducer from './slices/groupSlice';
import privateChatsReducer from './slices/privateChatsSlice';
import groupMembersReducer from './slices/groupMembersSlice';
import messagesReducer from './slices/messagesSlice';
// import statusBarReducer from './slices/statusBarSlice';

// persist config
const persistConfig = {
    key: 'root',
    storage: AsyncStorage,
    whitelist: [ 'auth', 'user', 'friends', 'groups', 'privateChats', 'groupMembers', 'messages' ],
};

// combine reducers
const rootReducer = combineReducers( {
    auth: authReducer,
    user: userReducer,
    friends: friendsReducer,
    groups: groupReducer,
    privateChats: privateChatsReducer,
    groupMembers: groupMembersReducer,
    messages: messagesReducer,
    // statusBar: statusBarReducer,
} );

const persistedReducer = persistReducer( persistConfig, rootReducer );

// create store
export const store = configureStore( {
    reducer: persistedReducer,
    middleware: ( getDefaultMiddleware ) =>
        getDefaultMiddleware( {
            immutableCheck: false, // 🚫 disables that heavy check
            serializableCheck: false, // redux-persist sometimes triggers this
        } ),
} );

export const persistor = persistStore( store );

// type helpers
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
