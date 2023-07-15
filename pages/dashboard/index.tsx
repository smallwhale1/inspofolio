import styles from "../../styles/dashboard/dashboard.module.scss";
import AuthGuardedLayout from "@/components/common/authGuarded/_layout";
import Projects from "@/components/dashboard/Projects";
import Topbar from "@/components/dashboard/Topbar";
import { Source_Sans_3 } from "next/font/google";
import { useTheme } from "@mui/material";

/**
 * This page will display all the user's dashboards
 */

const font = Source_Sans_3({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
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
