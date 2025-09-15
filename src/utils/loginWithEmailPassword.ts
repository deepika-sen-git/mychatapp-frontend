import auth from '@react-native-firebase/auth';
import { Alert } from 'react-native';

export const loginWithEmailPassword = async ( email: string, password: string ) => {
    try {
        console.log( "signing in...." );
        const userCredential = await auth().signInWithEmailAndPassword( email, password );
        // console.log( userCredential );
        console.log( "signed in user:", userCredential.user );
        

        return { success: true, user: userCredential.user };
    } catch ( error: any ) {
       
        console.error( 'Login error:', error );
        return { success: false, message: error.message };
    }
};
