// firebaseConfig.ts
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, serverTimestamp, arrayUnion } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyA1GiGkmaLOwgbBZ7fne9N4boUAE1ULhxg",
    authDomain: "mychatapp-d7dd9.firebaseapp.com",
    projectId: "mychatapp-d7dd9",
    storageBucket: "mychatapp-d7dd9.firebasestorage.app",
    messagingSenderId: "1021902014332",
    appId: "1:1021902014332:web:c89f187db7a6fa6db5c6f9",
    measurementId: "G-M81BSEJY70"
};

const app = initializeApp( firebaseConfig );

// Initialize services
export const auth = getAuth( app );

export const db = getFirestore( app );

// Export helpers for cleaner code
export { serverTimestamp, arrayUnion };
