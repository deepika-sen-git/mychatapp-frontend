import React from 'react';
import { FlatList } from 'react-native';
import ChatsListItem from './ChatListItem';

export type ChatItemType = {
    id: string;
    avatar?: string;
    name: string;
    lastMessage: string;
    time: string;
    unreadCount?: number;
    isGroup: boolean;
    friendUid?: string;
};

type Props = {
    data: ChatItemType[];
    onPressItem: ( item: ChatItemType ) => void;
};

const ChatsList: React.FC<Props> = ( { data, onPressItem } ) => {
    // console.log( '🟡 ChatsList rendered, items count:', data.length );


    return (
        <FlatList
            data={ data }
            keyExtractor={ item => item.id }
            renderItem={ ( { item } ) => (
                <ChatsListItem
                    avatar={ item.avatar }
                    name={ item.name }
                    message={ item.lastMessage }
                    time={ item.time }
                    unreadCount={ item.unreadCount }

                    isGroup={ item.isGroup }
                    onPress={ () => onPressItem( item ) }
                />
            ) }
        />
    );
};

export default React.memo( ChatsList );

