import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyDUKegikFs6cesG4e9EAQD0erQt0csxUi4",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "cropmate-4d636.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "cropmate-4d636",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "cropmate-4d636.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "156290003218",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:156290003218:web:62e2fea8b72b1fa51743cb",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
