import styles from "../../styles/dashboard/dashboard.module.scss";
import Projects from "@/components/dashboard/Projects";
import Topbar from "@/components/dashboard/Topbar";
import { AuthContext } from "@/contexts/AuthContext";
import { useTheme } from "@mui/material";
import { Playfair_Display } from "next/font/google";
import { useContext, useEffect } from "react";

type Props = {};

/**
 * This page will display all the user's dashboards
 */

const font = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const Dashboard = (props: Props) => {
  const theme = useTheme();
  const { user } = useContext(AuthContext);
  useEffect(() => {
    if (user) {
    }
  }, []);
  return (
    <div
      className={`${styles.dashboard} ${font.className}`}
      style={{ backgroundColor: theme.palette.bgColor.main }}
    >
      <Topbar />
      <Projects />
    </div>
  );
};

export default Dashboard;
