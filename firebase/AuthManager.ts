import { auth, provider } from "@/config/firebase";
import { signInAnonymously, signInWithPopup, signOut } from "firebase/auth";

export class AuthManager {
  static signInWithGoogle = async () => {
    const res = await signInWithPopup(auth, provider);
    return res;
  };

  static signInAnon = async () => {
    const res = await signInAnonymously(auth);
    return res;
  };

  static signOut = async () => {
    const res = await signOut(auth);
    return res;
  };
}
