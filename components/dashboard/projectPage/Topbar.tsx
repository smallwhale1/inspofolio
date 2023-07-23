import styles from "./Topbar.module.scss";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import { IconButton, Tooltip, useTheme } from "@mui/material";
import { AuthManager } from "@/firebase/AuthManager";
import { AuthContext } from "@/contexts/AuthContext";
import { BiUser } from "react-icons/bi";
import { RxExit } from "react-icons/rx";
import { LuLayoutDashboard } from "react-icons/lu";

const Topbar = () => {
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
          <Tooltip title="Dashboard">
            <IconButton
              onClick={() => {
                router.push("/dashboard");
              }}
            >
              <LuLayoutDashboard color={theme.palette.textColor.main} />
            </IconButton>
          </Tooltip>
        </li>
        <li className={styles.btnItem}>
          <Tooltip title="User">
            <IconButton
              onClick={() => {
                setProfileVisible(true);
              }}
            >
              <BiUser color={theme.palette.textColor.main} />
            </IconButton>
          </Tooltip>
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
          <Tooltip title="Sign Out">
            <IconButton onClick={handleSignOut}>
              <RxExit color={theme.palette.textColor.main} />
            </IconButton>
          </Tooltip>
        </li>
      </ul>
    </nav>
  );
};

export default Topbar;
