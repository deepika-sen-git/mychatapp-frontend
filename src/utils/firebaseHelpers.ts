//src/utils/firebaseHelpers.ts
import { DocumentData, QueryDocumentSnapshot } from 'firebase/firestore';
type ChatItemType = {
    id: string;
    avatar?: string;
    name: string;
    message: string;
    time: string;
    unreadCount?: number;
    date?: string;
    isGroup: boolean;
};

export function mapChatDocToChatItem( doc: QueryDocumentSnapshot<DocumentData> ): ChatItemType {
    const data = doc.data();

    return {
        id: doc.id,
        avatar: data.avatar,
        name: data.name,
        message: data.lastMessage ?? '',
        time: data.time ?? '',
        unreadCount: data.unreadCount ?? 0,
        date: '',  // optional
        isGroup: data.isGroup ?? false
    };
}

