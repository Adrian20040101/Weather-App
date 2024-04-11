import { auth, googleAuth } from  "../../config/firebase-config";
import { createUserWithEmailAndPassword, signInWithPopup, signOut, signInWithEmailAndPassword } from "firebase/auth";
import { useState } from 'react';

export const Auth = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    console.log(auth?.currentUser?.email);

    const signUp = async () => {
        try {
            await createUserWithEmailAndPassword(auth, email, password);
        } catch (err) {
            console.error(err);
        }
    };

    const logIn = async () => {
        try {
            await signInWithEmailAndPassword(auth, email, password);
        } catch (err) {
            console.error(err);
        }
    };

    const signInWithGoogle = async () => {
        try {
            await signInWithPopup(auth, googleAuth);
        } catch (err) {
            console.error(err);
        }
    };

    const logout = async () => {
        try {
            await signOut(auth);
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div>
            <input 
                placeholder = "Email..."
                onChange = {(e) => setEmail(e.target.value)}/>
            <input 
                placeholder = "Password..."
                type="password"
                onChange = {(e) => setPassword(e.target.value)}/>
            <button onClick={signUp}> Sign Up </button>
            <button onClick={logIn}> Log In </button>
            <button onClick={signInWithGoogle}> Sign in with Google </button>
            <button onClick={logout}> Log Out </button>
        </div>
    );
}