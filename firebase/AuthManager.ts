import { auth, provider } from "@/config/firebase";
import {
  createUserWithEmailAndPassword,
  signInAnonymously,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
} from "firebase/auth";

export class AuthManager {
  static signInWithGoogle = async () => {
    const res = await signInWithPopup(auth, provider);
    return res;
  };

  static signInAnon = async () => {
    const res = await signInAnonymously(auth);
    return res;
  };

  static signInEmailPassword = async (email: string, password: string) => {
    try {
      const res = await signInWithEmailAndPassword(auth, email, password);
      return res;
    } catch (err) {
      if (err instanceof Error) {
        return err.message;
      } else {
        return "An unknown error occured.";
      }
    }
  };

  static signUpEmailPassword = async (email: string, password: string) => {
    try {
      const res = await createUserWithEmailAndPassword(auth, email, password);
      return res;
    } catch (err) {
      if (err instanceof Error) {
        return err.message;
      } else {
        return "An unknown error occured.";
      }
    }
  };

  static signOut = async () => {
    const res = await signOut(auth);
    return res;
  };
}
