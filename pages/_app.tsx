import "@/styles/globals.scss";
import type { AppProps } from "next/app";
import { useRouter } from "next/router";
import { auth } from "@/config/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { AuthContext } from "@/contexts/AuthContext";
import { ThemeProvider } from "@mui/material";
import { lightTheme } from "@/theme";
import { Toaster, toast } from "react-hot-toast";
import { BiAlarmExclamation } from "react-icons/bi";
import { ToastContext } from "@/contexts/ToastContext";

// Toast notification
const notify = (message: string) =>
  toast(message, {
    // Styling
    style: { maxWidth: 500 },
    className: "",
    // Custom Icon
    icon: <BiAlarmExclamation size={20} />,
  });

export default function App({ Component, pageProps }: AppProps) {
  const [user, loading] = useAuthState(auth);
  const router = useRouter();
  const bodyColor =
    router.pathname === "/" || router.pathname === "/auth"
      ? lightTheme.palette.secondary.main
      : lightTheme.palette.bgColor.main;

  return (
    <ThemeProvider theme={lightTheme}>
      <AuthContext.Provider value={{ user, loading }}>
        <ToastContext.Provider value={{ setToastMessage: notify }}>
          <>
            <style jsx global>{`
              body {
                background-color: ${bodyColor};
              }
            `}</style>
          </>
          <Component {...pageProps} />
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                padding: "1rem",
              },
            }}
          ></Toaster>
        </ToastContext.Provider>
      </AuthContext.Provider>
    </ThemeProvider>
  );
}
