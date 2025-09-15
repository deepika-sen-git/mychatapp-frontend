import { doc, setDoc, collection, getDocs, query, where, getDoc, arrayUnion, updateDoc, arrayRemove, Timestamp } from 'firebase/firestore';
import { db } from '../utils/firebaseConfig';

export async function createGroupChat(
    selectedUsers: string[],
    currentUserId: string,
    groupName: string,
    imageURL?: string
) {
    const members = [ ...new Set( [ ...selectedUsers, currentUserId ] ) ];
    console.log( "members ", members );


    const chatId = `group_${ Date.now() }`; // simple unique ID
    console.log( "chatId for creating group", chatId );


    const chatRef = doc( db, 'chats', chatId );

    await setDoc( chatRef, {
        members,
        type: 'group',
        groupName,
        imageURL: imageURL || '',
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
        lastMessage: '',
        time: '',
        adminId: currentUserId,
    } );

    const savedDoc = await getDoc( chatRef );
    const data = savedDoc.data();

    return {
        chatId,
        members,
        type: 'group' as const,
        groupName,
        imageURL: imageURL ?? '',
        lastMessage: '',
        createdAt: data?.createdAt instanceof Timestamp
            ? data.createdAt.toDate().toISOString()
            : (data?.createdAt ?? ''),
        updatedAt: data?.updatedAt instanceof Timestamp
            ? data.updatedAt.toDate().toISOString()
            : (data?.updatedAt ?? ''),
        adminId: currentUserId,


    };
}
export async function getUserGroups( uid: string ) {
    const q = query(
        collection( db, 'chats' ),
        where( 'type', '==', 'group' ),
        where( 'members', 'array-contains', uid )
    );

    const snap = await getDocs( q );

    return snap.docs.map( doc => ( {
        chatId: doc.id,
        ...( doc.data() as {
            members: string[];
            type: 'group';
            groupName: string;
            imageURL: string;
            lastMessage: string;
            createdAt: Timestamp |  string;
            updatedAt: Timestamp | string;
            adminId: string,

        } )
    } ) );
}


export const removeMemberFromGroup = async ( chatId: string, userId: string ) => {
    try {
        const groupRef = doc( db, 'chats', chatId );
        await updateDoc( groupRef, {
            members: arrayRemove( userId ),
        } );
        console.log( 'User removed from group' );
    } catch ( error ) {
        console.error( 'Error removing user from group:', error );
    }
};

export const addMembersToGroup = async ( chatId: string, userIds: string[] ) => {
    try {
        await updateDoc( doc( db, 'chats', chatId ), { members: arrayUnion( ...userIds ) } );
        console.log( 'User added to Group' );
    } catch ( error ) {
        console.error( 'Error adding user to Group:', error );
    }
};
export const changeGroupName = async ( chatId: string, groupName: string ) => {
    try {
        await updateDoc( doc( db, 'chats', chatId ), { groupName } );
        console.log( ' Group Name changed in Group' );
    } catch ( error ) {
        console.error( 'Error changing group name in Group:', error );
    }
};
export const changeGroupImage = async ( chatId: string, groupImage: string ) => {
    try {
        await updateDoc( doc( db, 'chats', chatId ), { imageURL: groupImage } );
        console.log( ' Group Name changed in Group' );
    } catch ( error ) {
        console.error( 'Error changing group name in Group:', error );
    }
};