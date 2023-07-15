import { createContext } from "react";

interface ToastInfo {
  setToastMessage: (message: string) => void;
}

export const ToastContext = createContext<ToastInfo>({
  setToastMessage: (message: string) => {},
});
