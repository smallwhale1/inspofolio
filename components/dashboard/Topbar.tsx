import styles from "./Topbar.module.scss";
import { IconButton, useTheme } from "@mui/material";
import Logo from "../common/Logo";
import { RxExit } from "react-icons/rx";
import { BiUser } from "react-icons/bi";
import { AuthManager } from "@/firebase/AuthManager";
import { useRouter } from "next/router";
import { navbarLogoSize } from "@/util/constants";

interface TopbarProps {}

const Topbar = (props: TopbarProps) => {
  const theme = useTheme();
  const router = useRouter();

  const handleSignOut = async () => {
    await AuthManager.signOut();
    router.push("/auth");
  };

  return (
    <nav className={styles.topbar}>
      <Logo color={theme.palette.textColor.main} fontSize={navbarLogoSize} />
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
