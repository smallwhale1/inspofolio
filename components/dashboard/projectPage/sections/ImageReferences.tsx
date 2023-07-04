import styles from "./ImageReferences.module.scss";
import { Project } from "@/models/models";
import { useState } from "react";
import Masonry from "react-masonry-css";
import ImageCard from "./ImageCard";
import { ListManager } from "@/util/ListManager";
import { ImageList } from "@mui/material";

type Props = {
  project: Project;
};

const breakCols = {
  default: 4,
  1200: 3,
  1000: 2,
  750: 1,
};

interface ImageInfo {
  _id: string;
  url: string;
}

const ImageReferences = ({ project }: Props) => {
  const [images, setImages] = useState<ImageInfo[]>(
    project.imageUrls.map((img, i) => ({ url: img, _id: (i + 1).toString() }))
  );

  return (
    <div className={styles.container}>
      <Masonry
        breakpointCols={breakCols}
        className="my-masonry-grid"
        columnClassName="my-masonry-grid_column"
      >
        {images.map((img) => (
          <ImageCard key={img._id} url={img.url} />
        ))}
      </Masonry>
    </div>
  );
};

export default ImageReferences;
