import { collection, deleteDoc, doc, getDoc, getDocs, limit, orderBy, query, Timestamp, updateDoc, } from 'firebase/firestore';
import { db } from '../utils/firebaseConfig';
import { formatMessageDate } from '../utils/formatMessageDate';

export type media = {

    id: string,
    uri: string,
    date: string,
    type: string,
    createdAt: Timestamp,

}[];

export const formatTime = ( isoDate?: string | Timestamp ) => {
    if ( !isoDate ) return '';
    const date = new Date( isoDate instanceof Timestamp ? isoDate.toDate() : isoDate );
    const now = new Date();

    const isToday =
        date.getDate() === now.getDate() &&
        date.getMonth() === now.getMonth() &&
        date.getFullYear() === now.getFullYear();

    const timeStr = `${ date.getHours().toString().padStart( 2, '0' ) }:${ date.getMinutes().toString().padStart( 2, '0' ) }`;

    if ( isToday ) {
        return timeStr;
    } else {
        const dateStr = `${ date.getDate().toString().padStart( 2, '0' ) }/${ ( date.getMonth() + 1 ).toString().padStart( 2, '0' ) }`;
        return `${ timeStr }    ${ dateStr }`; // e.g., 10:25 02/01
    }
};

export const getChatMediaAttachments = async ( chatId: string ) => {
    try {
        const messagesRef = collection( db, 'chats', chatId, 'messages' );
        const snapshot = await getDocs( messagesRef );

        const media: media = [];

        snapshot.forEach( doc => {
            const data = doc.data();
            if ( data.attachments && Array.isArray( data.attachments ) ) {
                data.attachments.forEach( att => {
                    media.push( {
                        id: doc.id + '_' + att.url, // to make it unique
                        uri: att.url,
                        type: att.type,
                        date: formatMessageDate( data.createdAt?.toDate?.() || new Date() ),
                        createdAt: data.createdAt,
                    } );
                } );
            }
        } );

        return media;
    } catch ( error ) {
        console.error( 'Error fetching media attachments:', error );
        return [];
    }
};


/**
 * Re-apply deleteAt to all messages in a chat whenever setting changes
 */
export const applyDeleteAtToOldMessages = async (
    chatId: string,
    deleteAfterDays: number | null
) => {
    if ( !chatId ) return;

    try {
        const messagesRef = collection( db, "chats", chatId, "messages" );
        const snapshot = await getDocs( messagesRef );

        const updates: Promise<any>[] = [];

        snapshot.forEach( ( docSnap ) => {
            const data = docSnap.data();

            // case 1: deleteAfterDays is null → reset deleteAt
            if ( deleteAfterDays === null ) {
                updates.push(
                    updateDoc( doc( db, "chats", chatId, "messages", docSnap.id ), {
                        deleteAt: null,
                    } )
                );
                return;
            }

            // case 2: deleteAfterDays is a number → recalc based on createdAt
            if ( data.createdAt ) {
                const createdAt: Date = data.createdAt.toDate();
                const deleteAt = new Date( createdAt );
                deleteAt.setDate( deleteAt.getDate() + deleteAfterDays );

                if ( deleteAt <= new Date() ) {
                    // expired → delete immediately
                    updates.push(
                        deleteDoc( doc( db, "chats", chatId, "messages", docSnap.id ) )
                    );
                } else {
                    // still valid → update deleteAt
                    updates.push(
                        updateDoc( doc( db, "chats", chatId, "messages", docSnap.id ), {
                            deleteAt: Timestamp.fromDate( deleteAt ),
                        } )
                    );
                }
            }
        } );

        await Promise.all( updates );
        console.log(
            `✅ Re-applied deleteAt for ${ updates.length } messages in chat ${ chatId }`
        );
    } catch ( err ) {
        console.error( "❌ Error applying deleteAt to old messages:", err );
    }
};


/**
 * Updates chat document with the latest message after a change
 */
export const updateLastMessage = async ( chatId: string ) => {
    if ( !chatId ) return;

    try {
        const messagesRef = collection( db, "chats", chatId, "messages" );
        const q = query( messagesRef, orderBy( "createdAt", "desc" ), limit( 1 ) );
        const snapshot = await getDocs( q );
        const chatRef = doc( db, "chats", chatId );
        const chatSnap = await getDoc( chatRef );
        // console.log( "Updating last message for chat:", chatId );
        // console.log( "Chat document data:", chatSnap.data() );


        let lastMessage = "";
        let updatedAt: Timestamp | string = '';

        if ( !snapshot.empty ) {
            const msgData = snapshot.docs[ 0 ].data();
            lastMessage =
                msgData.text ||
                ( msgData.attachments?.length ? "📎 Attachment" : "" );
            updatedAt = msgData.createdAt || '';
        }
        if ( !lastMessage ) {
            updatedAt = chatSnap.data()?.createdAt || '';
        }
        // console.log( "Last message data:", lastMessage, updatedAt );

        await updateDoc( doc( db, "chats", chatId ), {
            lastMessage,
            updatedAt,
            time: formatTime( updatedAt ),

        } );

        // console.log( `✅ Last message updated for chat ${ chatId }` );
    } catch ( e ) {
        console.error( "❌ Failed to update last message:", e );
    }
};
