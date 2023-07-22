import { auth, provider } from "@/config/firebase";
import { ErrorResponse } from "@/util/errorHandling";
import {
  UserCredential,
  createUserWithEmailAndPassword,
  signInAnonymously,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
} from "firebase/auth";

export class AuthManager {
  static signInWithGoogle = async (): Promise<
    UserCredential | ErrorResponse
  > => {
    try {
      const res = await signInWithPopup(auth, provider);
      return res;
    } catch (err) {
      if (err instanceof Error) {
        return {
          status: "error",
          message: err.message,
        };
      } else {
        return {
          status: "error",
          message: "An unknown error occured.",
        };
      }
    }
  };

  static signInAnon = async () => {
    const res = await signInAnonymously(auth);
    return res;
  };

  static signInEmailPassword = async (
    email: string,
    password: string
  ): Promise<UserCredential | ErrorResponse> => {
    try {
      const res = await signInWithEmailAndPassword(auth, email, password);
      return res;
    } catch (err) {
      if (err instanceof Error) {
        return {
          status: "error",
          message: err.message,
        };
      } else {
        return {
          status: "error",
          message: "An unknown error occured.",
        };
      }
    }
  };

  static signUpEmailPassword = async (
    email: string,
    password: string
  ): Promise<UserCredential | ErrorResponse> => {
    try {
      const res = await createUserWithEmailAndPassword(auth, email, password);
      return res;
    } catch (err) {
      if (err instanceof Error) {
        return {
          status: "error",
          message: err.message,
        };
      } else {
        return {
          status: "error",
          message: "An unknown error occured.",
        };
      }
    }
  };

  static signOut = async () => {
    const res = await signOut(auth);
    return res;
  };
}
