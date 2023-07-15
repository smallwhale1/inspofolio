import { useEffect, useState } from "react";
import styles from "./ImageView.module.scss";
import { GiHorizontalFlip } from "react-icons/gi";
import { IconButton } from "@mui/material";
import { BiX } from "react-icons/bi";
import { BsX } from "react-icons/bs";

type Props = {
  imgSrc: string;
  imgElement?: HTMLImageElement;
  setModalOpen: (open: boolean) => void;
};

const flipDuration = 0.5;

const ImageView = ({ imgSrc, imgElement, setModalOpen }: Props) => {
  const [flipping, setFlipping] = useState(false);
  const [flipped, setFlipped] = useState(false);

  useEffect(() => {
    if (!flipping) return;
    setTimeout(() => {
      setFlipped((prev) => !prev);
    }, (flipDuration * 1000) / 2);
    setTimeout(() => {
      setFlipping(false);
    }, flipDuration * 1000);
  }, [flipping]);

  return (
    <div
      className={`${styles.imgWrapper}`}
      style={{ height: "100%", padding: "2rem" }}
    >
      <img
        onClick={(e) => {
          e.stopPropagation();
        }}
        src={imgSrc}
        height={"100%"}
        className={`${flipping && styles.imgFlipping} ${
          flipped && styles.flipped
        }`}
      />
      <div
        className={styles.tools}
        style={{
          position: "absolute",
          right: "1rem",
          top: "1rem",
          display: "flex",
          gap: "1rem",
        }}
      >
        <IconButton>
          <GiHorizontalFlip
            color="#ffffff"
            size={30}
            onClick={() => {
              if (flipping) return;
              setFlipping(true);
            }}
          />
        </IconButton>
        <IconButton
          className={styles.exitBtn}
          onClick={() => setModalOpen(false)}
        >
          <BsX color="#ffffff" size={30} />
        </IconButton>
      </div>
    </div>
  );
};

export default ImageView;
