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
    const palette = await extractColors(img);

    const { naturalWidth, naturalHeight } = img;
    const aspectRatio = naturalHeight / naturalWidth;
    imgAspectRatio.current = aspectRatio;
    setImgLoaded(true);
  };

  return (
    <div className={styles.imgCard} ref={cardRef} style={{ height: imgHeight }}>
      <Image
        src={url}
        alt="project reference"
        className={styles.img}
        fill
        onLoadingComplete={handleLoadingComplete}
      />
    </div>
  );
};

{
}

export default ImageCard;
