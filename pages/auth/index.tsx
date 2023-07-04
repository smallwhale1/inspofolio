import styles from "../../styles/auth/auth.module.scss";
import Image from "next/image";
import Logo from "@/components/common/Logo";
import Head from "next/head";
import { Playfair_Display } from "next/font/google";
import { useEffect, useRef, useState } from "react";
import { Button, Tab, Tabs, TextField, useTheme } from "@mui/material";
import { useRouter } from "next/router";
import { AuthManager } from "@/firebase/AuthManager";
import { BsPlayFill } from "react-icons/bs";
import { fadeDuration } from "@/util/constants";

const font = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

enum AuthType {
  SIGNUP,
  LOGIN,
}

const auth = () => {
  const [bgImgLoaded, setBgImgLoaded] = useState(false);
  const [visible, setVisible] = useState(false);
  const [isResponsive, setIsResponsive] = useState(false);
  const [authType, setAuthType] = useState<AuthType>(AuthType.SIGNUP);
  const [exiting, setExiting] = useState(false);
  const nextRoute = useRef<string>("/");
  const router = useRouter();
  const theme = useTheme();

  const handleGoogleSignIn = async () => {
    const user = await AuthManager.signInWithGoogle();
    if (authType === AuthType.SIGNUP) {
      nextRoute.current = "/create?firsttime=true";
      setExiting(true);
    } else {
      nextRoute.current = "/create?firsttime=true";
      setExiting(true);
    }
  };

  const handleAnonymousSignIn = async () => {
    const user = await AuthManager.signInAnon();
    console.log(user);
    if (authType === AuthType.SIGNUP) {
      nextRoute.current = "/create?firsttime=true&guest=true";
      setExiting(true);
    } else {
      nextRoute.current = "/create?firsttime=true&guest=true";
      setExiting(true);
    }
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 750) {
        setIsResponsive(true);
      } else {
        setIsResponsive(false);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (bgImgLoaded) {
      setTimeout(() => {
        setVisible(true);
      }, 500);
    }
  }, [bgImgLoaded]);

  useEffect(() => {
    if (!exiting) return;
    setTimeout(() => {
      router.push(nextRoute.current);
    }, fadeDuration * 1000);
  }, [exiting]);

  return (
    <>
      <Head>
        <title>Welcome to Inspofolio!</title>
        <meta
          name="description"
          content="A multimedia platform for managing your creative process."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main
        className={`${styles.main} ${font.className} ${
          exiting && styles.exiting
        }`}
        style={{
          backgroundColor: theme.palette.secondary.main,
          color: theme.palette.textColor.main,
          transitionDuration: `${fadeDuration}s`,
        }}
      >
        <Image
          className={`${styles.bgImg} ${bgImgLoaded && styles.fadeIn}`}
          src="/assets/images/inspofolio-auth-bg-1.jpg"
          alt="buildings background"
          fill
          onLoad={() => {
            setBgImgLoaded(true);
          }}
          priority
        />
        <div
          className={`${styles.overlay} ${bgImgLoaded && styles.fadeInHalf}`}
        ></div>
        <div className={styles.content}>
          {/* Left side */}
          {!isResponsive && (
            <div className={`${styles.left} ${visible && styles.fadeInBottom}`}>
              {!isResponsive && <Logo fontSize={"1.8rem"} />}
              <p className={styles.description}>
                A multimedia platform for managing your creative process.
              </p>
            </div>
          )}
          {/* Right side */}
          <div className={styles.right}>
            {isResponsive && (
              <Logo
                color={theme.palette.secondary.main}
                fontSize={"1.5rem"}
                hideText
              />
            )}
            <h2>
              {authType === AuthType.LOGIN ? "Login" : "Create an account"}
            </h2>
            {/* Auth Tabs */}
            <Tabs value={authType} onChange={(e, val) => setAuthType(val)}>
              <Tab value={AuthType.SIGNUP} label="sign up"></Tab>
              <Tab value={AuthType.LOGIN} label="login"></Tab>
            </Tabs>
            <TextField label="Email" />
            <TextField label="Password" />
            <Button
              variant="contained"
              onClick={() => {
                router.push("/create");
              }}
              color="secondary"
            >
              {authType === AuthType.LOGIN ? "submit" : "create account"}
            </Button>
            <div className={styles.orDelimitter}>
              <div className={styles.delimitter}></div>
              <span>or</span>
            </div>
            <Button
              variant="outlined"
              onClick={handleGoogleSignIn}
              color="secondary"
            >
              <span className={styles.iconBtn}>
                <Image
                  src="/assets/google-logo.png"
                  alt="google logo"
                  width={16}
                  height={16}
                />
                continue with google
              </span>
            </Button>
            <Button variant="contained" onClick={handleAnonymousSignIn}>
              <span className={styles.iconBtn} style={{ gap: "0.5rem" }}>
                <BsPlayFill size={25} /> demo without account
              </span>
            </Button>
          </div>
        </div>
      </main>
    </>
  );
};

export default auth;
