import AuthGuardedLayout from "@/components/common/authGuarded/_layout";
import styles from "../../styles/dashboard/dashboard.module.scss";
import Projects from "@/components/dashboard/Projects";
import Topbar from "@/components/dashboard/Topbar";
import { useTheme } from "@mui/material";
import { Playfair_Display } from "next/font/google";

/**
 * This page will display all the user's dashboards
 */

const font = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const Dashboard = () => {
  const theme = useTheme();

  return (
    <AuthGuardedLayout>
      <div
        className={`${styles.dashboard} ${font.className}`}
        style={{ backgroundColor: theme.palette.bgColor.main }}
      >
        <Topbar />
        <Projects />
      </div>
    </AuthGuardedLayout>
  );
};

export default Dashboard;
