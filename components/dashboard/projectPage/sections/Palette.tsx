import { Project } from "@/models/models";
import styles from "./Palette.module.scss";

type Props = {
  project: Project;
};

const Palette = ({ project }: Props) => {
  return (
    <div className={styles.paletteGrid}>
      {project.palette.length === 0
        ? "No colors yet"
        : project.palette.map((color) => <ColorSwatch color={color.hex} />)}
    </div>
  );
};

type ColorSwatchProps = {
  color: string;
};

const ColorSwatch = ({ color }: ColorSwatchProps) => {
  return (
    <div
      className={styles.colorSwatch}
      style={{ backgroundColor: color }}
    ></div>
  );
};

export default Palette;
