import { Button, useTheme } from "@mui/material";
import styles from "./LoadingButton.module.scss";
import { Oval } from "react-loader-spinner";
import { ReactElement } from "react";

type Props = {
  onSubmit: () => void;
  loading: boolean;
  text: string;
  color?:
    | "inherit"
    | "primary"
    | "secondary"
    | "success"
    | "error"
    | "info"
    | "warning";
  icon?: ReactElement;
  iconRight?: boolean;
};

const LoadingButton = ({
  onSubmit,
  loading,
  text,
  color,
  icon,
  iconRight,
}: Props) => {
  const theme = useTheme();

  return (
    <Button
      variant={"contained"}
      color={color}
      onClick={() => {
        onSubmit();
      }}
    >
      <span className={styles.btnContent}>
        {icon && !iconRight && icon}
        {text}
        {loading && (
          <Oval
            height={20}
            width={20}
            color="#ffffff"
            visible={true}
            ariaLabel="oval-loading"
            secondaryColor={theme.palette.grey200.main}
            strokeWidth={3}
            strokeWidthSecondary={3}
          />
        )}
        {icon && iconRight && icon}
      </span>
    </Button>
  );
};

export default LoadingButton;
