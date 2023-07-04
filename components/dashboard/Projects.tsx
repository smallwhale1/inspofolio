import styles from "./Projects.module.scss";
import { Button } from "@mui/material";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import { ProjectsManager } from "@/firebase/ProjectsManager";
import { AuthContext } from "@/contexts/AuthContext";
import { Project } from "@/models/models";
import ProjectCard from "./ProjectCard";
import PuffLoader from "../common/animation/PuffLoader";
import FoldingBoxesLoader from "../common/animation/FoldingBoxesLoader";

const Projects = () => {
  const router = useRouter();
  const { user, loading } = useContext(AuthContext);
  const [projects, setProjects] = useState<Project[]>([]);
  const [fetching, setFetching] = useState(false);

  useEffect(() => {
    const fetchProjects = async () => {
      setFetching(true);
      if (loading || !user) return;
      const projects = await ProjectsManager.getProjects(user.uid);
      setProjects(projects);
      setFetching(false);
    };

    fetchProjects();
  }, [user, loading]);

  return (
    <div className={styles.projects}>
      <div className={styles.projectsHeading}>
        <h2>Your Projects</h2>
        <Button
          onClick={() => {
            router.push("/create");
          }}
          variant="contained"
        >
          create
        </Button>
      </div>
      {/* Projects */}
      <main className={styles.main}>
        {fetching ? (
          <FoldingBoxesLoader />
        ) : (
          // <PuffLoader />
          <div className={styles.projectsGrid}>
            {projects.length === 0 ? (
              <div>No projects yet.</div>
            ) : projects.length < 3 ? (
              <>
                {projects.map((project) => (
                  <ProjectCard project={project} />
                ))}
                <div></div>
                <div></div>
              </>
            ) : (
              projects.map((project) => <ProjectCard project={project} />)
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default Projects;
