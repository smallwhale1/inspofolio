import { Project } from "@/models/models";
import styles from "./Palette.module.scss";
import { IconButton } from "@mui/material";
import { BiX } from "react-icons/bi";
import { useContext, useEffect } from "react";
import { ColorManager } from "@/util/ColorManager";
import { ToastContext } from "@/contexts/ToastContext";

type Props = {
  project: Project;
  removeColor: (hex: string) => Promise<void>;
};

const Palette = ({ project, removeColor }: Props) => {
  return (
    <div className={styles.paletteGrid}>
      {project.palette.length === 0
        ? "No colors yet"
        : ColorManager.simpleSort(project.palette).map((color) => (
            <ColorSwatch
              key={color.hex}
              color={color.hex}
              removeColor={removeColor}
            />
          ))}
    </div>
  );
};

type ColorSwatchProps = {
  color: string;
  removeColor: (hex: string) => Promise<void>;
};

const ColorSwatch = ({ color, removeColor }: ColorSwatchProps) => {
  const { setToastMessage } = useContext(ToastContext);

  const copyContent = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setToastMessage("Successfully copied to clipboard.");
    } catch (err) {
      console.error("Failed to copy: ", err);
      setToastMessage("Failed to copy.");
    }
  };

  return (
    <div className={styles.colorWrapper} onClick={() => copyContent(color)}>
      <div className={styles.colorContainer}>
        <div
          className={styles.colorSwatch}
          style={{ backgroundColor: color }}
        ></div>
      </div>
      <IconButton
        className={styles.closeBtn}
        onClick={(e) => {
          removeColor(color);
        }}
        onPointerDown={(e) => {
          e.stopPropagation();
        }}
      >
        <BiX color="#ffffff" />
      </IconButton>
      <span>{color}</span>
    </div>
  );
};

export default Palette;
