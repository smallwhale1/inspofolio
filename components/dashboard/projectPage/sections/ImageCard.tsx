import Image from "next/image";
import styles from "./ImageCard.module.scss";
import { useEffect, useRef, useState } from "react";

type Props = {
  img: ImageData;
  imgDelete: (id: string) => void;
};

const ImageCard = ({ img, imgDelete }: Props) => {
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
    const { naturalWidth, naturalHeight } = img;
    const aspectRatio = naturalHeight / naturalWidth;
    imgAspectRatio.current = aspectRatio;
    setImgLoaded(true);
  };

  return (
    <>
      <div
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
              src={img.url}
              alt="project reference"
              className={styles.img}
              fill
              onLoadingComplete={handleLoadingComplete}
            />
          </div>
          <IconButton
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              imgDelete(img._id);
            }}
            className={styles.closeBtn}
          >
            <BiX color="#ffffff" />
          </IconButton>
        </div>
      </div>
      <Modal modalOpen={imgModalOpen} setModalOpen={setImgModalOpen}>
        <ImageView setModalOpen={setImgModalOpen} imgSrc={img.url} />
      </Modal>
    </>
  );
};

import { Box, IconButton, Modal as MUIModal } from "@mui/material";
import React, { ReactElement } from "react";
import ImageView from "./ImageView";
import { BiX } from "react-icons/bi";
import { ImageData } from "@/models/models";
import { lightTheme } from "@/theme";

type ModalProps = {
  modalOpen: boolean;
  setModalOpen: (open: boolean) => void;
  children: ReactElement;
};

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  height: "100vh",
  width: "100vw",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  boxSizing: "border-box",
  backgroundColor: "#000000b4",
};

// TODO: move this somewhere else, the masonry is messing with it
const Modal = ({ modalOpen, setModalOpen, children }: ModalProps) => {
  return (
    <MUIModal open={modalOpen} disableAutoFocus>
      <Box sx={{ ...modalStyle }}>{children}</Box>
    </MUIModal>
  );
};

export default ImageCard;
