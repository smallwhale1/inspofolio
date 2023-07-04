import { createContext } from "react";
import { User } from "firebase/auth";
import { UserInfo } from "@/models/models";

interface AuthInfo {
  user: User | null | undefined;
  loading: boolean;
  setUserInfo?: (userInfo: UserInfo) => void;
  userInfo?: UserInfo;
}

export const AuthContext = createContext<AuthInfo>({
  user: undefined,
  loading: true,
  setUserInfo: () => {},
});
