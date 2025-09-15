// // src/hooks/useAuthListener.ts
// import { useEffect } from "react";
// import { onAuthStateChanged } from "firebase/auth";
// import { useDispatch } from "react-redux";
// import { auth } from "../utils/firebaseConfig";
// import { setAuthUser, setLoggedIn, resetAuth } from "../store/slices/authSlice";
// import { setUserProfile, resetUserProfile } from "../store/slices/userSlice";
// import { getDoc, doc } from "firebase/firestore";
// import { db } from "../utils/firebaseConfig";

// export function useAuthListener() {
//     const dispatch = useDispatch();

//     useEffect( () => {
//         const unsubscribe = onAuthStateChanged( auth, async ( firebaseUser ) => {
//             console.log("Auth state changed:", firebaseUser );
            
//             if ( firebaseUser ) {
//                 // ✅ Store Firebase user in authSlice
//                 dispatch( setAuthUser( firebaseUser ) );
//                 dispatch( setLoggedIn( true ) );

//                 // ✅ Load user profile from Firestore
//                 const userRef = doc( db, "users", firebaseUser.uid );
//                 const snap = await getDoc( userRef );
//                 if ( snap.exists() ) {
//                     dispatch( setUserProfile( snap.data() as any ) );
//                 }
//             } else {
                
//                 // 🔴 Logged out → reset both
//                 // dispatch( resetAuth() );
//                 // dispatch( resetUserProfile() );
//             }
//         } );

//         return unsubscribe;
//     }, [ dispatch ] );
// }
