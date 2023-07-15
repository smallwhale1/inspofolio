import styles from "./AddImages.module.scss";
import { ImageUpload } from "@/models/models";
import { ListManager } from "@/util/ListManager";
import { Button, IconButton, useTheme } from "@mui/material";
import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { AiOutlineUpload } from "react-icons/ai";
import { BiX } from "react-icons/bi";

export interface ImageCreateProps {
  imgs: ImageUpload[];
  onSubmit: () => void;
  onBack: () => void;
  onAdd: (imgFiles: File[]) => void;
  onRemove: (id: string) => void;
}

// Two interfaces for whether we are creating for the first time or editing
export interface ImageEditProps {
  onSubmit: (newImgs: ImageUpload[]) => Promise<void>;
}

interface ImagesProps {
  createProps?: ImageCreateProps;
  editProps?: ImageEditProps;
}

// max number of images users can upload
const maxImages = 20;

const AddImages = ({ createProps, editProps }: ImagesProps) => {
  const theme = useTheme();
  const [currImgs, setCurrImgs] = useState<ImageUpload[]>([]);

  // callbacks for when files are dropped
  const onDropCreate = useCallback(
    (acceptedFiles: File[]) => {
      if (!acceptedFiles || acceptedFiles.length > maxImages) return;
      createProps?.onAdd(acceptedFiles);
    },
    [createProps]
  );

  const onDropEdit = useCallback((acceptedFiles: File[]) => {
    if (!acceptedFiles || acceptedFiles.length > maxImages) return;
    setCurrImgs((prev) => [
      ...prev,
      ...acceptedFiles.map((file, i) => ({
        _id: ListManager.getNewId(prev, i),
        file: file,
        previewUrl: URL.createObjectURL(file),
      })),
    ]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: createProps ? onDropCreate : onDropEdit,
    accept: {
      "image/*": [".png", ".jpg", ".jpeg", ".gif"],
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
        {createProps
          ? createProps.imgs.map((img) => (
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
                    createProps.onRemove(img._id);
                  }}
                  className={styles.closeBtn}
                >
                  <BiX color="#ffffff" />
                </IconButton>
              </div>
            ))
          : currImgs.map((img) => (
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
                    setCurrImgs((prev) =>
                      prev.filter((im) => im._id !== img._id)
                    );
                  }}
                  className={styles.closeBtn}
                >
                  <BiX color="#ffffff" />
                </IconButton>
              </div>
            ))}
      </div>
      {/* Buttons */}
      {createProps && (
        <div className={styles.btnContainer}>
          <Button variant="text" onClick={createProps.onBack}>
            previous
          </Button>
          <Button
            variant={createProps.imgs.length === 0 ? "text" : "contained"}
            onClick={() => {
              createProps.onSubmit();
            }}
          >
            {createProps.imgs.length === 0 ? "skip" : "continue"}
          </Button>
        </div>
      )}
      {editProps && (
        <Button
          onClick={() => {
            editProps.onSubmit(currImgs);
          }}
        >
          submit
        </Button>
      )}
    </div>
  );
};

export default AddImages;
