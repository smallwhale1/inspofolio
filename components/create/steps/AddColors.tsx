import { useState } from "react";
import styles from "./AddColors.module.scss";
import { ChromePicker } from "react-color";
import { Button } from "@mui/material";

type Props = {
  onAdd: (color: string) => void;
};

const AddColors = ({ onAdd }: Props) => {
  const [color, setColor] = useState("#ffffff");
  return (
    <div className={styles.addColors}>
      <ChromePicker color={color} onChange={(color) => setColor(color.hex)} />
      <Button
        variant="contained"
        onClick={() => onAdd(color)}
        sx={{ width: 225 }}
      >
        add color
      </Button>
    </div>
  );
};

export default AddColors;
