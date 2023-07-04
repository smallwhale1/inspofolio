import "@/styles/globals.scss";
import { auth } from "@/config/firebase";
import type { AppProps } from "next/app";
import { useAuthState } from "react-firebase-hooks/auth";
import { AuthContext } from "@/contexts/AuthContext";
import { ThemeProvider } from "@mui/material";
import { lightTheme } from "@/theme";
import { useRouter } from "next/router";

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
        <>
          <style jsx global>{`
            body {
              background-color: ${bodyColor};
            }
          `}</style>
        </>
        <Component {...pageProps} />
      </AuthContext.Provider>
    </ThemeProvider>
  );
}
