import { doc, getDoc } from 'firebase/firestore';
import { db } from '../utils/firebaseConfig';


// uid = current user's uid
export async function getFriendsData( uid: string ) {
    // 1️⃣ Get current user's document
    const userDocRef = doc( db, 'users', uid );
    const userDocSnap = await getDoc( userDocRef );
    const userData = userDocSnap.data();

    if ( !userData?.friends ) return []; // no friends

    // 2️⃣ Fetch each friend's data in parallel
    const friendDocs = await Promise.all(
        userData.friends.map( async ( friendUid: string | undefined ) => {
            if ( !friendUid ) return null;
            const friendDocRef = doc( db, 'users', friendUid );
            const friendDocSnap = await getDoc( friendDocRef );
            return friendDocSnap.exists() ? { id: friendDocSnap.id, ...friendDocSnap.data() } : null;
        } )
    );

    // 3️⃣ Filter out any nulls (e.g., if a friend's doc didn't exist)
    return friendDocs.filter( Boolean );
}
