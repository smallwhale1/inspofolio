import { Puff } from "react-loader-spinner";
import styles from "./PuffLoader.module.scss";
import { useTheme } from "@mui/material";

type Props = {};

const PuffLoader = (props: Props) => {
  const theme = useTheme();
  return (
    <div className={styles.loaderContainer}>
      <Puff
        height="80"
        width="80"
        radius={1}
        color={theme.palette.primary.main}
        ariaLabel="puff-loading"
        visible={true}
      />
    </div>
  );
};

export default PuffLoader;
