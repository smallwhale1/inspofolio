import { Project } from "@/models/models";
import styles from "./Palette.module.scss";
import { IconButton } from "@mui/material";
import { BiX } from "react-icons/bi";
import { useEffect } from "react";
import { ColorManager } from "@/util/ColorManager";

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
  return (
    <div className={styles.colorWrapper}>
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
