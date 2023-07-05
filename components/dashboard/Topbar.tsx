import styles from "./Topbar.module.scss";
import { IconButton, useTheme } from "@mui/material";
import Logo from "../common/Logo";
import { RxExit } from "react-icons/rx";
import { BiUser } from "react-icons/bi";
import { AuthManager } from "@/firebase/AuthManager";
import { useRouter } from "next/router";
import { navbarLogoSize } from "@/util/constants";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "@/contexts/AuthContext";

interface TopbarProps {}

const Topbar = ({}: TopbarProps) => {
  const theme = useTheme();
  const router = useRouter();
  const [profileVisible, setProfileVisible] = useState(false);
  const { loading, user } = useContext(AuthContext);

  const handleSignOut = async () => {
    await AuthManager.signOut();
    router.push("/auth");
  };

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
      <Logo color={theme.palette.textColor.main} fontSize={navbarLogoSize} />

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
