import { useEffect, useState } from "react";
import styles from "./ImageView.module.scss";
import { GiHorizontalFlip } from "react-icons/gi";
import { IconButton } from "@mui/material";
import { BiX } from "react-icons/bi";
import { BsX } from "react-icons/bs";
import Image from "next/image";

type Props = {
  imgElement: HTMLImageElement;
  url: string;
  setModalOpen: (open: boolean) => void;
};

const flipDuration = 0.5;

const ImageView = ({ imgElement, url, setModalOpen }: Props) => {
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
    <div style={{ height: "100%", padding: "2rem" }}>
      <Image
        onClick={(e) => {
          e.stopPropagation();
        }}
        height={window.innerHeight - 64}
        width={
          (imgElement.naturalWidth / imgElement.naturalHeight) *
          (window.innerHeight - 64)
        }
        src={url}
        alt="reference"
        className={`${styles.imgReference} ${flipping && styles.imgFlipping} ${
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
