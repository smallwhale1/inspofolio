import Image from "next/image";
import styles from "./ImageCard.module.scss";
import { useEffect, useRef, useState } from "react";
import { ImageData } from "@/models/models";
import { IconButton } from "@mui/material";
import { BiX } from "react-icons/bi";

type Props = {
  img: ImageData;
  imgDelete: (id: string) => void;
  onClick: (img: HTMLImageElement, url: string) => void;
};

const ImageCard = ({ img, imgDelete, onClick }: Props) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const imgAspectRatio = useRef<number>(0);
  const [imgHeight, setImgHeight] = useState(100);
  const [imgLoaded, setImgLoaded] = useState(false);
  const imgRef = useRef<HTMLImageElement | null>(null);

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
    imgRef.current = img;
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
          if (!imgRef.current) return;
          onClick(imgRef.current, img.url);
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
              sizes="(max-width: 768px) 100vw, (max-width: 1000px) 50vw, 33vw"
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
    </>
  );
};

export default ImageCard;
