// // Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
// // TODO: Add SDKs for Firebase products that you want to use
// // https://firebase.google.com/docs/web/setup#available-libraries

// // Your web app's Firebase configuration
// // For Firebase JS SDK v7.20.0 and later, measurementId is optional
// const firebaseConfig = {
//   apiKey: "",
//   authDomain: "",
//   projectId: "",
//   storageBucket: "",
//   messagingSenderId: "",
//   appId: "",
//   measurementId: "G-3YCNLNEQS5"
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);
// const auth = getAuth(app);
// export { app, auth };
// const analytics = getAnalytics(app);

// // File: src/context/firebase.tsx

// import { initializeApp } from "firebase/app";
// import { getAuth } from "firebase/auth";

// // Your web app's Firebase configuration
// const firebaseConfig = {
  
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);

// // Initialize Firebase Auth
// const auth = getAuth(app);

// // 👇 THIS IS THE MOST IMPORTANT LINE
// export { app, auth };

// src/context/firebase.tsx
import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signOut 
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// ✅ Paste your Firebase config from Firebase Console
const firebaseConfig = {
  apiKey: "AIzaSyAiTWDaxZU1kLl2H-mIon4exZBrI8e22nc",
  authDomain: "agrismart-2d32a.firebaseapp.com",
  projectId: "agrismart-2d32a",
  storageBucket: "agrismart-2d32a.firebasestorage.app",
  messagingSenderId: "754053135918",
  appId: "1:754053135918:web:bc6b4291cc4193a11a69bf",
  measurementId: "G-435C8EF1F7"
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
