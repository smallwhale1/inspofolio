import styles from "../../styles/auth/auth.module.scss";
import Image from "next/image";
import Logo from "@/components/common/Logo";
import Head from "next/head";
import { Source_Sans_3 } from "next/font/google";
import { useContext, useEffect, useRef, useState } from "react";
import { Button, Tab, Tabs, TextField, useTheme } from "@mui/material";
import { useRouter } from "next/router";
import { AuthManager } from "@/firebase/AuthManager";
import { BsPlayFill } from "react-icons/bs";
import { fadeDuration } from "@/util/constants";
import { ProjectsManager } from "@/firebase/ProjectsManager";
import { isErrorRes } from "@/util/errorHandling";
import { ToastContext } from "@/contexts/ToastContext";

const font = Source_Sans_3({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

enum AuthType {
  SIGNUP,
  LOGIN,
}

const Auth = () => {
  const [bgImgLoaded, setBgImgLoaded] = useState(false);
  const [visible, setVisible] = useState(false);
  const [isResponsive, setIsResponsive] = useState(false);
  const [authType, setAuthType] = useState<AuthType>(AuthType.SIGNUP);
  const [exiting, setExiting] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const nextRoute = useRef<string>("/");
  const router = useRouter();
  const theme = useTheme();
  const { setToastMessage } = useContext(ToastContext);

  const handleGoogleSignIn = async () => {
    const user = await AuthManager.signInWithGoogle();
    if (isErrorRes(user)) {
      setToastMessage(user.message);
      return;
    }
    const hasProject = await ProjectsManager.userHasProject(user.user.uid);
    if (hasProject) {
      nextRoute.current = "/dashboard";
      setExiting(true);
    } else {
      nextRoute.current = "/create";
      setExiting(true);
    }
  };

  const handleAnonymousSignIn = async () => {
    const user = await AuthManager.signInAnon();
    const hasProject = await ProjectsManager.userHasProject(user.user.uid);
    if (hasProject) {
      nextRoute.current = "/dashboard";
      setExiting(true);
    } else {
      nextRoute.current = "/create?guest=true";
      setExiting(true);
    }
  };

  const handleEmailSignIn = async () => {
    if (email === "" || password === "") {
      setToastMessage("Email or password cannot be empty.");
      return;
    }
    if (authType === AuthType.LOGIN) {
      const res = await AuthManager.signInEmailPassword(email, password);
      if (isErrorRes(res)) {
        setToastMessage(res.message);
        return;
      }
      const hasProject = await ProjectsManager.userHasProject(res.user.uid);
      if (hasProject) {
        nextRoute.current = "/dashboard";
        setExiting(true);
      } else {
        nextRoute.current = "/create";
        setExiting(true);
      }
    } else {
      const res = await AuthManager.signUpEmailPassword(email, password);
      if (isErrorRes(res)) {
        setToastMessage(res.message);
        return;
      }
      const signInRes = await AuthManager.signInEmailPassword(email, password);
      if (isErrorRes(signInRes)) {
        setToastMessage(signInRes.message);
        return;
      }
      nextRoute.current = "/create";
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
      }, 300);
    }
    return () => setVisible(false);
  }, [bgImgLoaded]);

  useEffect(() => {
    if (!exiting) return;
    setTimeout(() => {
      router.push(nextRoute.current);
    }, fadeDuration * 1000);
  }, [exiting, router]);

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
          sizes="100vw"
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
          <div className={`${styles.right}`}>
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
            <TextField
              type="email"
              label="Email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
              }}
            />
            <TextField
              type="password"
              label="Password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
              }}
            />
            <Button
              variant="contained"
              onClick={() => {
                handleEmailSignIn();
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
                  sizes="16px"
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

export default Auth;
