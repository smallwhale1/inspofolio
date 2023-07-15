import { useEffect, useState } from "react";
import styles from "./ImageView.module.scss";
import { GiHorizontalFlip } from "react-icons/gi";
import { IconButton } from "@mui/material";

type Props = {
  imgSrc: string;
  imgElement?: HTMLImageElement;
};

const ImageView = ({ imgSrc, imgElement }: Props) => {
  const [flipped, setFlipped] = useState(false);

  useEffect(() => {}, []);

  return (
    <div
      className={styles.imgWrapper}
      style={{ height: "100%", padding: "2rem" }}
    >
      <img
        onClick={(e) => {
          e.stopPropagation();
        }}
        src={imgSrc}
        height={"100%"}
      />
      <div
        className={styles.tools}
        style={{
          position: "absolute",
          left: "5px",
          top: "5px",
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
        }}
      >
        <IconButton>
          <GiHorizontalFlip />
        </IconButton>
      </div>
    </div>
  );
};

export default ImageView;
