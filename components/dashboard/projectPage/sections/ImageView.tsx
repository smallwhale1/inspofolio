import styles from "./ImageView.module.scss";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { GiHorizontalFlip } from "react-icons/gi";
import { IconButton, Tooltip } from "@mui/material";
import { BsX } from "react-icons/bs";
import { TbColorPicker, TbColorPickerOff } from "react-icons/tb";
import { ChromePicker } from "react-color";

type Props = {
  imgElement: HTMLImageElement;
  url: string;
  setModalOpen: (open: boolean) => void;
};

const flipDuration = 0.5;

const ImageView = ({ imgElement, url, setModalOpen }: Props) => {
  const [flipping, setFlipping] = useState(false);
  const [flipped, setFlipped] = useState(false);
  const [imgHeight, setImgHeight] = useState(window.innerHeight - 64);
  const [showCanvas, setShowCanvas] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [colorPickerState, setColorPickerState] = useState<
    "inactive" | "active"
  >("inactive");
  const [activeColor, setActiveColor] = useState<{
    r: number;
    g: number;
    b: number;
  } | null>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [pointerPosition, setPointerPosition] = useState<{
    top: number;
    left: number;
  }>({
    top: 0,
    left: 0,
  });

  useEffect(() => {
    if (!flipping) return;
    setShowCanvas(false);
    setTimeout(() => {
      setFlipped((prev) => !prev);
    }, (flipDuration * 1000) / 2);
    setTimeout(() => {
      setShowCanvas(true);
      setFlipping(false);
    }, flipDuration * 1000);
  }, [flipping]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerHeight) {
        setImgHeight(window.innerHeight - 64);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !imgRef.current) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    canvas.width =
      (imgElement.naturalWidth / imgElement.naturalHeight) * imgHeight;
    canvas.height = imgHeight;
    ctx.drawImage(imgRef.current, 0, 0, canvas.width, canvas.height);
  }, [imgHeight]);

  const handleImgLoad = (img: HTMLImageElement) => {
    imgRef.current = img;
    setShowColorPicker(true);
  };

  const handleColorPicker = () => {
    if (colorPickerState === "active") {
      setActiveColor(null);
      setColorPickerState("inactive");
      setShowCanvas(false);
    } else {
      setShowCanvas(true);
      const canvas = canvasRef.current;
      if (!canvas || !imgRef.current) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      canvas.width =
        (imgElement.naturalWidth / imgElement.naturalHeight) * imgHeight;
      canvas.height = imgHeight;
      ctx.drawImage(imgRef.current, 0, 0, canvas.width, canvas.height);
      setColorPickerState("active");
    }
  };

  useEffect(() => {
    if (colorPickerState !== "active") return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const handlePointerMove = (e: PointerEvent) => {
      const bounding = canvas.getBoundingClientRect();
      let x: number = e.clientX - bounding.left;
      let y: number = e.clientY - bounding.top;

      if (y < bounding.height / 2) {
        setPointerPosition({
          left: e.clientX,
          top: e.clientY + 20,
        });
      } else {
        setPointerPosition({
          left: e.clientX,
          top: e.clientY - 240,
        });
      }
      // handling flipped case
      if (flipped) {
        x = bounding.width - x;
      }
      const pixel = ctx.getImageData(x, y, 1, 1);
      const data = pixel.data;
      setActiveColor({ r: data[0], g: data[1], b: data[2] });
    };

    const handlePointerOut = () => {
      setActiveColor(null);
    };

    canvas.addEventListener("pointermove", handlePointerMove);
    canvas.addEventListener("pointerout", handlePointerOut);
    return () => {
      canvas.removeEventListener("pointermove", handlePointerMove);
      canvas.removeEventListener("pointerout", handlePointerOut);
    };
  }, [colorPickerState, flipped]);

  return (
    <>
      <div style={{ height: "100%", padding: "2rem", position: "relative" }}>
        <Image
          onClick={(e) => {
            e.stopPropagation();
          }}
          onLoadingComplete={handleImgLoad}
          height={imgHeight}
          width={
            (imgElement.naturalWidth / imgElement.naturalHeight) * imgHeight
          }
          src={url}
          alt="reference"
          className={`${styles.imgReference} ${
            flipping && styles.imgFlipping
          } ${flipped && styles.flipped}`}
        />
        <div
          className={`${styles.canvasWrapper} ${
            flipping && styles.canvasFlipping
          } ${flipped && styles.canvasFlipped}`}
          style={{
            display: showCanvas ? "block" : "none",
            height: imgHeight,
            width:
              (imgElement.naturalWidth / imgElement.naturalHeight) * imgHeight,
          }}
        >
          <canvas ref={canvasRef} />
        </div>
      </div>
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
        {showColorPicker && (
          <Tooltip
            title={
              colorPickerState === "active"
                ? "Exit Color Picker"
                : "Enter Color Picker"
            }
          >
            <IconButton onClick={handleColorPicker}>
              {colorPickerState === "active" ? (
                <TbColorPickerOff color="#ffffff" size={30} />
              ) : (
                <TbColorPicker color="#ffffff" size={30} />
              )}
            </IconButton>
          </Tooltip>
        )}

        <Tooltip title="Flip Horizontal">
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
        </Tooltip>
        <Tooltip title="Exit Image View">
          <IconButton
            className={styles.exitBtn}
            onClick={() => setModalOpen(false)}
          >
            <BsX color="#ffffff" size={30} />
          </IconButton>
        </Tooltip>
      </div>
      <div
        style={{
          pointerEvents: "none",
          display: "block",
          position: "absolute",
          top: pointerPosition.top,
          left: pointerPosition.left,
        }}
      >
        {activeColor && <ChromePicker disableAlpha color={activeColor} />}
      </div>
    </>
  );
};

export default ImageView;
