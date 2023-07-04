import styles from "./Sidebar.module.scss";
import { useTheme } from "@mui/material";
import Logo from "../common/Logo";
import { navbarLogoSize } from "@/util/constants";
import Link from "next/link";
import { useRouter } from "next/router";

type Props = {};

const menuItems = ["images", "links", "palette", "music"];

const Sidebar = (props: Props) => {
  const theme = useTheme();
  const router = useRouter();
  return (
    <div className={styles.sidebar}>
      <Logo color={theme.palette.textColor.main} fontSize={navbarLogoSize} />
      <ul className={styles.menuItems}>
        {menuItems.map((item) => (
          <li key={item}>
            <Link href={`/dashboard/${router.pathname}/${item}`}>{item}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
