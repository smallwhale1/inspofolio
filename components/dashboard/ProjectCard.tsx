import styles from "./ProjectCard.module.scss";
import Image from "next/image";
import Link from "next/link";
import { Project } from "@/models/models";
import { useEffect, useRef, useState } from "react";
import { IconButton, useTheme } from "@mui/material";
import { BiX } from "react-icons/bi";

interface ProjectCardProps {
  project: Project;
  deleteProject: (id: string) => void;
}

const ProjectCard = ({ project, deleteProject }: ProjectCardProps) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [imgHeight, setImgHeight] = useState(0);
  const [imgLoaded, setImgLoaded] = useState(false);
  const theme = useTheme();

  useEffect(() => {
    if (!cardRef.current) return;
    const handleResize = () => {
      const width = cardRef.current?.getBoundingClientRect().width;
      if (width) {
        setImgHeight(width * 0.569);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <Link href={`/dashboard/${project._id}`}>
      <div className={styles.projectCard} ref={cardRef}>
        <div
          className={styles.imgContainer}
          style={{
            height: imgHeight,
            backgroundColor: theme.palette.secondary.main,
          }}
        >
          {project.imgs.length > 0 && (
            <Image
              onLoad={() => setImgLoaded(true)}
              className={`${styles.cardImg} ${
                imgLoaded && styles.cardImgShown
              }`}
              src={project.imgs[0].url}
              alt={`${project.name}`}
              fill
              priority
            />
          )}
        </div>
        <div className={styles.cardText}>
          <h4>{project.name}</h4>
          <p>
            {project.description
              ? project.description
              : "No description provided."}
          </p>
        </div>
        <IconButton
          sx={{
            position: "absolute",
            top: "2px",
            right: "2px",
          }}
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
            deleteProject(project._id);
          }}
        >
          <BiX color="#ffffff" />
        </IconButton>
      </div>
    </Link>
  );
};

export default ProjectCard;
