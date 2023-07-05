import Image from "next/image";
import styles from "./ImageCard.module.scss";
import { useEffect, useRef, useState } from "react";
import { extractColors } from "extract-colors";

type Props = {
  url: string;
};

const ImageCard = ({ url }: Props) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const imgAspectRatio = useRef<number>(0);
  const [imgHeight, setImgHeight] = useState(100);
  const [imgLoaded, setImgLoaded] = useState(false);
  const [imgModalOpen, setImgModalOpen] = useState(false);

  useEffect(() => {
    if (!imgLoaded || !cardRef.current || !imgAspectRatio.current) return;
    const handleResize = () => {
      const width = cardRef.current?.getBoundingClientRect().width;
      if (width) {
        setImgHeight(imgAspectRatio.current * width);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [imgLoaded]);

  const handleLoadingComplete = async (img: HTMLImageElement) => {
    // const palette = await extractColors(img);

    const { naturalWidth, naturalHeight } = img;
    const aspectRatio = naturalHeight / naturalWidth;
    imgAspectRatio.current = aspectRatio;
    setImgLoaded(true);
  };

  return (
    <>
      <button
        className={styles.imgCard}
        onClick={() => {
          setImgModalOpen(true);
        }}
      >
        <div className={styles.imgWrapper}>
          <div
            className={styles.imgContainer}
            ref={cardRef}
            style={{ height: imgHeight }}
          >
            <Image
              src={url}
              alt="project reference"
              className={styles.img}
              fill
              onLoadingComplete={handleLoadingComplete}
            />
          </div>
        </div>
      </button>
      <Modal modalOpen={imgModalOpen} setModalOpen={setImgModalOpen}>
        <ImageView imgSrc={url} />
      </Modal>
    </>
  );
};

import { Box, IconButton, Modal as MUIModal } from "@mui/material";
import React, { ReactElement } from "react";
import ImageView from "./ImageView";
import { BiX } from "react-icons/bi";

type ModalProps = {
  modalOpen: boolean;
  setModalOpen: (open: boolean) => void;
  children: ReactElement;
};

const modalStyle = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  height: "100vh",
  width: "100vw",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  padding: "1rem",
  boxSizing: "border-box",
  borderRadius: "0.5rem",
};

// TODO: move this somewhere else, the masonry is messing with it
const Modal = ({ modalOpen, setModalOpen, children }: ModalProps) => {
  return (
    <MUIModal open={modalOpen} disableAutoFocus>
      <div>
        <Box sx={{ ...modalStyle }}>{children}</Box>
        <IconButton
          className={styles.exitBtn}
          onClick={() => setModalOpen(false)}
        >
          <BiX color="#ffffff" size={30} />
        </IconButton>
      </div>
    </MUIModal>
  );
};

export default ImageCard;
