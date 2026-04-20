// src/context/firebase.tsx
import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signOut 
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "krashiai.firebaseapp.com",
  projectId: "krashiai",
  storageBucket: "krashiai.firebasestorage.app",
  messagingSenderId: "647172284027",
  appId: "1:647172284027:web:db6b46e057522518468cde",
  measurementId: "G-27WVVRWJ38"
};

const app = initializeApp(firebaseConfig);

// Services
export const auth = getAuth(app);
export const db = getFirestore(app);

// Google provider (for sign-in)
const provider = new GoogleAuthProvider();

// ✅ Helper functions
export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, provider);
    return result.user;
  } catch (error) {
    console.error("Google Sign-In Error:", error);
    throw error;
  }
};

export const logout = async () => {
  await signOut(auth);
};
