import { ImageData } from "@/models/models";
import styles from "./AddImages.module.scss";
import { Button, IconButton, useTheme } from "@mui/material";
import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { AiOutlineUpload } from "react-icons/ai";
import { BiX } from "react-icons/bi";
import Image from "next/image";

interface ImagesProps {
  imgs: ImageData[];
  onBack: () => void;
  onSubmit: () => void;
  onAdd: (imgFils: File[]) => void;
  onRemove: (id: string) => void;
}

// max number of images users can upload
const maxImages = 20;

const AddImages = ({
  imgs,
  onAdd,
  onRemove,
  onSubmit,
  onBack,
}: ImagesProps) => {
  const theme = useTheme();
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (!acceptedFiles || acceptedFiles.length > maxImages) return;
    onAdd(acceptedFiles);
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/png": [".png"],
      "image/jpg": [".jpg"],
      "image/jpeg": [".jpeg"],
    },
  });

  return (
    <div className={styles.imageUpload}>
      <div
        className={styles.dropzone}
        {...getRootProps()}
        style={{
          backgroundColor: theme.palette.grey100.main,
          borderColor: theme.palette.grey200.main,
        }}
      >
        <input {...getInputProps()} />
        {isDragActive ? (
          <p>Drop the files here ...</p>
        ) : (
          <div className={styles.dropzoneInstructions}>
            <AiOutlineUpload size={25} />
            <p>
              Choose image files or drag and drop it here. <br /> Accepts: *jpg,
              *jpeg, *png
            </p>
          </div>
        )}
      </div>
      <div className={styles.imgPreviews}>
        {imgs.map((img) => (
          <div key={img._id} className={styles.imgWrapper}>
            <div className={styles.imgContainer}>
              <img
                className={styles.imgPreview}
                src={img.previewUrl}
                alt={"reference"}
                height={100}
              />
            </div>
            <IconButton
              onClick={() => {
                onRemove(img._id);
              }}
              className={styles.closeBtn}
            >
              <BiX color="#ffffff" />
            </IconButton>
          </div>
        ))}
      </div>
      {/* Buttons */}
      <div className={styles.btnContainer}>
        <Button variant="text" onClick={onBack}>
          previous
        </Button>
        <Button
          variant={imgs.length === 0 ? "text" : "contained"}
          onClick={() => {
            onSubmit();
          }}
        >
          {imgs.length === 0 ? "skip" : "continue"}
        </Button>
      </div>
    </div>
  );
};

export default AddImages;
