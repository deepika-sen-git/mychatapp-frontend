import firestore from "@react-native-firebase/firestore";

export const checkUserExists = async ( identifier: string ) => {
    console.log( 'Checking user existence for:', identifier );
    
    try {
        // Case 1: email
        if ( identifier.includes( "@" ) ) {
            // Email case → search in Firestore "users" collection
            const snapshot = await firestore()
                .collection( "users" )
                .where( "email", "==", identifier )
                .limit( 1 )
                .get();

            return { exists: !snapshot.empty, user: snapshot.docs[ 0 ]?.data() };
        }

        // Case 2: phone (assuming you store it in Firestore "users" collection)
        const snapshot = await firestore()
            .collection( "users" )
            .where( "phone", "==", identifier )
            .limit( 1   )
            .get();

        return { exists: !snapshot.empty, user: snapshot.docs[ 0 ]?.data() };
    } catch ( error: any ) {
        console.error( "Error checking user existence:", error );
        return { exists: false, error: error.message };
    }
};
