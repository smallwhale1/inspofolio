import styles from "./ImageReferences.module.scss";
import { Project } from "@/models/models";
import { useContext, useState } from "react";
import Masonry from "react-masonry-css";
import ImageCard from "./ImageCard";
import { AuthContext } from "@/contexts/AuthContext";
import { Box, Modal as MUIModal } from "@mui/material";
import { ReactElement } from "react";
import ImageView from "./ImageView";

type Props = {
  project: Project;
  handleImgDelete: (id: string) => Promise<void>;
};

const breakCols = {
  default: 3,
  1200: 2,
  900: 1,
};

const ImageReferences = ({ project, handleImgDelete }: Props) => {
  const { user, loading } = useContext(AuthContext);
  const [imgModalOpen, setImgModalOpen] = useState(false);
  const [img, setImg] = useState<{
    imgElement: HTMLImageElement;
    url: string;
  } | null>(null);

  const handleImgClick = (imgElement: HTMLImageElement, url: string) => {
    setImg({ imgElement: imgElement, url });
    setImgModalOpen(true);
  };

  return (
    <div className={styles.container}>
      <Masonry
        breakpointCols={breakCols}
        className="my-masonry-grid"
        columnClassName="my-masonry-grid_column"
      >
        {project.imgs.map((img) => (
          <ImageCard
            key={img._id}
            img={img}
            imgDelete={handleImgDelete}
            onClick={handleImgClick}
          />
        ))}
      </Masonry>
      <Modal modalOpen={imgModalOpen} setModalOpen={setImgModalOpen}>
        <>
          {img && (
            <ImageView
              setModalOpen={setImgModalOpen}
              imgElement={img.imgElement}
              url={img.url}
            />
          )}
        </>
      </Modal>
    </div>
  );
};

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

export default ImageReferences;
