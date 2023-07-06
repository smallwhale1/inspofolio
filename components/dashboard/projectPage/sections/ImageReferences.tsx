import styles from "./ImageReferences.module.scss";
import { ImageData, Project } from "@/models/models";
import { useContext, useEffect, useState } from "react";
import Masonry from "react-masonry-css";
import ImageCard from "./ImageCard";
import { ProjectsManager } from "@/firebase/ProjectsManager";
import { AuthContext } from "@/contexts/AuthContext";
import { StorageManager } from "@/firebase/StorageManager";

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

  return (
    <div className={styles.container}>
      <Masonry
        breakpointCols={breakCols}
        className="my-masonry-grid"
        columnClassName="my-masonry-grid_column"
      >
        {project.imgs.map((img) => (
          <ImageCard key={img._id} img={img} imgDelete={handleImgDelete} />
        ))}
      </Masonry>
    </div>
  );
};

export default ImageReferences;
