import "@/styles/globals.scss";
import { auth } from "@/config/firebase";
import type { AppProps } from "next/app";
import { useAuthState } from "react-firebase-hooks/auth";
import { AuthContext } from "@/contexts/AuthContext";
import { ThemeProvider } from "@mui/material";
import { lightTheme } from "@/theme";

export default function App({ Component, pageProps }: AppProps) {
  const [user, loading] = useAuthState(auth);

  return (
    <ThemeProvider theme={lightTheme}>
      <AuthContext.Provider value={{ user, loading }}>
        <Component {...pageProps} />
      </AuthContext.Provider>
    </ThemeProvider>
  );
}
