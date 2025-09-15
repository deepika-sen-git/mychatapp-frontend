import { createUserWithEmailAndPassword, UserCredential } from "firebase/auth";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "./firebaseConfig"; // adjust path
import { AppDispatch } from "../store";
import { setLoggedIn, setPhoneVerified } from "../store/slices/authSlice";
import { setUserProfile } from "../store/slices/userSlice";

/**
 * Creates a new Firebase user (email + password) and saves profile in Firestore
 */
export const createAccountAndSaveProfile = async (
    dispatch: AppDispatch,
    {
        email,
        password,
        name,
        phone,
        imageURL,
        userCode,
    }: {
        email: string;
        password: string;
        name: string;
        phone: string;
        imageURL?: string;
        userCode: string;
    }
) => {
    // Step 1: Create Firebase Auth account
    const userCredential: UserCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
    );
    const uid = userCredential.user.uid;

    // Step 2: Save profile in Firestore
    const userRef = doc( db, "users", uid );
    await setDoc( userRef, {
        name,
        email,
        phone,
        userCode,
        imageURL: imageURL || "",
        createdAt: serverTimestamp(),
        friends: [],
    } );

    // Step 3: Confirm saved data
    const docSnap = await getDoc( userRef );
    if ( !docSnap.exists() ) {
        throw new Error( "User profile not found after saving." );
    }
    const userData = docSnap.data();

    // Step 4: Update Redux
    dispatch( setLoggedIn( true ) );
    dispatch( setPhoneVerified( true ) );
    dispatch(
        setUserProfile( {
            uid,
            name: userData.name || "",
            email: userData.email || "",
            phone: userData.phone || "",
            imageURL: userData.imageURL || "",
            userCode: userData.userCode || "",
            createdAt: userData.createdAt
                ? userData.createdAt.seconds.toString()
                : null,
            language:'en-US',
        } )
    );
    console.log( "User profile created and saved:", userData );
    
    // dispatch( clearAuthTempData() );

    return uid;
};
