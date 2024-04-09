import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBiUKez9cO0Mi2MF2PNbMFjYEGvuVNLy5w",
  authDomain: "weather-app-70eae.firebaseapp.com",
  projectId: "weather-app-70eae",
  storageBucket: "weather-app-70eae.appspot.com",
  messagingSenderId: "864164771987",
  appId: "1:864164771987:web:137bcf208a49c360f27566",
  measurementId: "G-V9TDJL7XW4"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleAuth = new GoogleAuthProvider();
export const db = getFirestore(app);