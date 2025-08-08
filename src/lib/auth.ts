
import { 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    type User
} from "firebase/auth";
import { auth } from "./firebase";

export const signUp = async (email, password) => {
    let result = null,
        error = null;
    try {
        result = await createUserWithEmailAndPassword(auth, email, password);
    } catch (e) {
        error = e;
    }

    return { result, error };
}

export const signIn = async (email, password) => {
    let result = null,
        error = null;
    try {
        result = await signInWithEmailAndPassword(auth, email, password);
    } catch (e) {
        error = e;
    }

    return { result, error };
}

export const logOut = async () => {
    let error = null;
    try {
        await signOut(auth);
    } catch (e) {
        error = e;
    }
    return { error };
}

export const useAuth = (callback: (user: User | null) => void) => {
    return onAuthStateChanged(auth, callback);
}
