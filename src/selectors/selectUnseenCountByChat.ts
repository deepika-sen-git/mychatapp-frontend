import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "../store";

export const selectUnseenCountByChat = createSelector(
    [
        ( state: RootState ) => state.messages.messagesByChat, // all messages grouped by chatId
        ( state: RootState ) => state.user.uid
    ],
    ( messagesByChat, currentUserId ) => {
        const unseenCounts: Record<string, number> = {};
        Object.keys( messagesByChat ).forEach( chatId => {
            const messages = messagesByChat[ chatId ];
            unseenCounts[ chatId ] = messages.filter( msg => !msg.seenBy?.some( item => item.userId === currentUserId ) ).length;

        } );


        return unseenCounts;
    }
);
