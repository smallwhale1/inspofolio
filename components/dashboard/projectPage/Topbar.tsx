import { IconButton, useTheme } from "@mui/material";
import styles from "./Topbar.module.scss";
import { BiUser } from "react-icons/bi";
import { RxExit } from "react-icons/rx";
import { useRouter } from "next/router";
import { AuthManager } from "@/firebase/AuthManager";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "@/contexts/AuthContext";

type Props = {};

const Topbar = (props: Props) => {
  const [profileVisible, setProfileVisible] = useState(false);
  const theme = useTheme();
  const router = useRouter();
  const handleSignOut = async () => {
    await AuthManager.signOut();
    router.push("/auth");
  };
  const { loading, user } = useContext(AuthContext);

  useEffect(() => {
    const handlePointerDown = () => {
      setProfileVisible(false);
    };

    window.addEventListener("pointerdown", handlePointerDown);

    return () => window.removeEventListener("pointer", handlePointerDown);
  }, []);

  return (
    <nav
      className={styles.topbar}
      style={{
        backgroundColor: theme.palette.bgColor.main,
      }}
    >
      <ul className={styles.navbarBtns}>
        <li className={styles.btnItem}>
          <IconButton
            onClick={() => {
              setProfileVisible(true);
            }}
          >
            <BiUser color={theme.palette.textColor.main} />
          </IconButton>
          {profileVisible && (
            <div
              onPointerDown={(e) => {
                e.stopPropagation();
              }}
              className={styles.profilePopup}
              style={{
                backgroundColor: theme.palette.bgColor.main,
                borderColor: theme.palette.grey200.main,
              }}
            >
              {!loading && (user?.email ? user.email : "Anonymous")}
            </div>
          )}
        </li>
        <li className={styles.btnItem}>
          <IconButton onClick={handleSignOut}>
            <RxExit color={theme.palette.textColor.main} />
          </IconButton>
        </li>
      </ul>
    </nav>
  );
};

export default Topbar;
