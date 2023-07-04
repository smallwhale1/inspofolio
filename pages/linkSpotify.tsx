import LinkSpotify from "@/components/create/LinkSpotify";
import styles from "../styles/linkSpotify.module.scss";
import { useTheme } from "@mui/material";

type Props = {};

const linkSpotify = (props: Props) => {
  const theme = useTheme();
  return (
    <div
      className={styles.linkSpotify}
      style={{ backgroundColor: theme.palette.bgColor.main }}
    >
      <LinkSpotify />
    </div>
  );
};

export default linkSpotify;
