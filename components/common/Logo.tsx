import styles from "./Logo.module.scss";
import { Croissant_One } from "next/font/google";
import { GiAirZigzag } from "react-icons/gi";

const croissant = Croissant_One({ weight: "400", subsets: ["latin"] });

interface LogoProps {
  color?: string;
  fontSize?: string | number;
  hideText?: boolean;
  vertical?: boolean;
  flipping?: boolean;
}
const Logo = ({ color, fontSize, hideText, vertical, flipping }: LogoProps) => {
  return (
    <h1
      className={`${styles.logo} ${croissant.className}`}
      style={{
        color: color ? color : "auto",
        fontSize: fontSize ? fontSize : "auto",
        flexDirection: vertical ? "column" : "row",
      }}
    >
      <div
        className={`${styles.iconWrapper} ${
          flipping && styles.animationWrapper
        }`}
      >
        <GiAirZigzag />
      </div>
      {!hideText && <span>Inspofolio</span>}
    </h1>
  );
};

export default Logo;
