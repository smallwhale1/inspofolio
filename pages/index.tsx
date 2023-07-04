import styles from "@/styles/Home.module.scss";
import Logo from "@/components/common/Logo";
import { useTheme } from "@mui/material";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "@/contexts/AuthContext";
import FoldingBoxesLoader from "@/components/common/animation/FoldingBoxesLoader";

// in seconds
const animationDuration = 1;
const delay = 6;

export default function Home() {
  const theme = useTheme();
  const router = useRouter();
  const { user, loading } = useContext(AuthContext);
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    if (loading) return;
    setTimeout(() => {
      setExiting(true);
      setTimeout(() => {
        router.push("/linkSpotify");
        // if (user) {
        //   router.push("/dashboard");
        // } else {
        //   router.push("/auth");
        // }
      }, animationDuration * 1000);
    }, delay * 1000);
  }, [user, loading]);

  return (
    <>
      <main
        className={`${styles.main} ${exiting && styles.fadeOut}`}
        style={{
          backgroundColor: theme.palette.secondary.main,
          transitionDuration: `${animationDuration}s`,
        }}
      >
        {/* <Logo fontSize={"3rem"} color="#ffffff" flipping hideText /> */}
        <FoldingBoxesLoader />
      </main>
    </>
  );
}
