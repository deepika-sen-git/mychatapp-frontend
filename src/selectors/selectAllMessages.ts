import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "../store";

export const selectAllMessages = createSelector(
    ( state: RootState ) => state.messages.messagesByChat,
    ( messagesByChat ) => {
        return Object.entries( messagesByChat ).flatMap( ( [ chatId, messages ] ) =>
            messages.map( ( msg: any ) => ( {
                ...msg,
                chatId, // ✅ keep reference to parent chat
            } ) )
        );
    }
);
