import { Button, IconButton, useTheme } from "@mui/material";
import styles from "./Topbar.module.scss";
import { navbarLogoSize } from "@/util/constants";
import Logo from "@/components/common/Logo";
import { BiUser } from "react-icons/bi";
import { RxExit } from "react-icons/rx";
import { useRouter } from "next/router";
import { AuthManager } from "@/firebase/AuthManager";

type Props = {};

const Topbar = (props: Props) => {
  const theme = useTheme();
  const router = useRouter();
  const handleSignOut = async () => {
    await AuthManager.signOut();
    router.push("/auth");
  };
  return (
    <nav
      className={styles.topbar}
      style={{
        backgroundColor: theme.palette.bgColor.main,
      }}
    >
      <ul className={styles.navbarBtns}>
        <li className={styles.btnItem}>
          <IconButton>
            <BiUser color={theme.palette.textColor.main} />
          </IconButton>
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
