// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDUKegikFs6cesG4e9EAQD0erQt0csxUi4",
  authDomain: "cropmate-4d636.firebaseapp.com",
  projectId: "cropmate-4d636",
  storageBucket: "cropmate-4d636.firebasestorage.app",
  messagingSenderId: "156290003218",
  appId: "1:156290003218:web:62e2fea8b72b1fa51743cb"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);