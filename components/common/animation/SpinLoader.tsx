import styles from "./SpinLoader.module.scss";
import { Puff } from "react-loader-spinner";
import { useTheme } from "@mui/material";

const SpinLoader = () => {
  const theme = useTheme();
  return (
    <div className={styles.loaderContainer}>
      <Puff
        height={50}
        width={50}
        radius={1}
        color={theme.palette.primary.main}
        ariaLabel="puff-loading"
        visible={true}
      />
    </div>
  );
};

export default SpinLoader;
