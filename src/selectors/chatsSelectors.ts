// selectors/chatsSelectors.ts
import { createSelector } from 'reselect';
import { RootState } from '../store';
import { selectUnseenCountByChat } from './selectUnseenCountByChat';
import { formatTime } from '../api/messages';


export const selectCombinedChats = createSelector(
    [
        ( state: RootState ) => state.privateChats.items,
        ( state: RootState ) => state.groups.items,
        ( state: RootState ) => state.friends.items,
        ( state: RootState ) => state.user.uid,
        selectUnseenCountByChat,
    ],
    ( privateChats, groups, friends, uid, unseenCounts ) => {
        if ( !uid ) return [];

        // 🔥 Build friends map for O(1) lookup
        const friendsMap = Object.fromEntries( friends.map( f => [ f.id, f ] ) );

        const privateChatList = privateChats.map( chat => {
            const friendUid = chat.members.find( id => id !== uid ) ?? '';
            const friend = friendsMap[ friendUid ];

            return {
                id: chat.chatId,
                avatar: friend?.imageURL ?? null, // fallback
                name: friend?.name ?? 'Deleted User',
                lastMessage: chat.lastMessage ?? '',
                time: formatTime( chat.updatedAt ),
                updatedAt: chat.updatedAt ? new Date( chat.updatedAt.toString() ).getTime() : 0,
                isGroup: false,
                friendUid,
                phone: friend?.phone ?? '',
                email: friend?.email ?? '',
                unreadCount: unseenCounts[ chat.chatId ] || 0,
            };
        } );

        const groupChatList = groups.map( group => ( {
            id: group.chatId,
            avatar: group.imageURL ?? null,
            name: group.groupName,
            lastMessage: group.lastMessage ?? '',
            time: formatTime( group.updatedAt ),
            updatedAt: group.updatedAt ? new Date( group.updatedAt.toString() ).getTime() : 0,
            isGroup: true,
            unreadCount: unseenCounts[ group.chatId ] || 0,
        } ) );

        // 🔥 Merge + sort
        return [ ...privateChatList, ...groupChatList ].sort(
            ( a, b ) => b.updatedAt - a.updatedAt
        );
    }
);
