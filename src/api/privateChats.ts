import { doc, setDoc, getDocs, query, collection, where, getDoc, updateDoc, Timestamp } from 'firebase/firestore';
import { db } from '../utils/firebaseConfig';

//
// ✅ Fetch private chats where user is a member
//
export async function getUserPrivateChats( uid: string ) {
    const q = query(
        collection( db, 'chats' ),
        where( 'type', '==', 'private' ),
        where( 'members', 'array-contains', uid )
    );

    const snap = await getDocs( q );

    return snap.docs.map( snapDoc => ( {
        chatId: snapDoc.id,
        ...( snapDoc.data() as {
            members: string[];
            lastMessage: string;
            createdAt: Timestamp | string;
            updatedAt: Timestamp | string;
            type: 'private';
        } )
    } ) );
}

//
// ✅ Create new private chat if it doesn't exist
//
export async function createPrivateChatInFirestore( currentUserId: string, friendId: string ) {
    // consistent chatId
    const chatId = [ currentUserId, friendId ].sort().join( '_' );
    console.log( "chatId when creating chat", chatId );

    const chatRef = doc( db, 'chats', chatId );
    const chatSnap = await getDoc( chatRef );

    if ( !chatSnap.exists() ) {
        await setDoc( chatRef, {
            members: [ currentUserId, friendId ],
            type: 'private',
            lastMessage: '',
            createdAt: Timestamp.now(),
            updatedAt: Timestamp.now(),
            time: ''
        } );
    }

    return {
        chatId,
        members: [ currentUserId, friendId ],
        type: 'private' as const,
        lastMessage: '',
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
    };
}
// Example Firestore updater
export async function updateChatDeleteSetting( chatId: string, deleteAfterDays: number | null ) {
    await updateDoc( doc( db, 'chats', chatId ), {
        deleteAfterDays // "Never", "01 Day", etc.
    } );
}
export async function getChatDeleteSetting( chatId: string ) {
    try {
        const chatRef = doc( db, 'chats', chatId );
        const chatSnap = await getDoc( chatRef );

        if ( !chatSnap.exists() ) {
            console.warn( `Chat ${ chatId } does not exist.` );
            return null;
        }

        const chatData = chatSnap.data();
        // Assuming your field name in Firestore is "deleteAfterDays"
        return chatData.deleteAfterDays ?? null;
    } catch ( error ) {
        console.error( "Error fetching delete setting:", error );
        return null;
    }
}