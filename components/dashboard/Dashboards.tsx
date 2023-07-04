import { Button } from "@mui/material";
import styles from "./Dashboards.module.scss";
import { useRouter } from "next/router";

const Dashboards = () => {
  const router = useRouter();
  return (
    <div className={styles.dashboards}>
      <div className={styles.dashboardHeading}>
        <h2>Your Projects</h2>
        <Button
          onClick={() => {
            router.push("/create");
          }}
          variant="contained"
        >
          create
        </Button>
      </div>
    </div>
  );
};

export default Dashboards;
