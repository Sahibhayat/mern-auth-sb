// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-auth-a909b.firebaseapp.com",
  projectId: "mern-auth-a909b",
  storageBucket: "mern-auth-a909b.appspot.com",
  messagingSenderId: "691385029241",
  appId: "1:691385029241:web:ba432451be008b85eafaa8"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);