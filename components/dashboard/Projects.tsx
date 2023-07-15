import styles from "./Projects.module.scss";
import { Button } from "@mui/material";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import { ProjectsManager } from "@/firebase/ProjectsManager";
import { AuthContext } from "@/contexts/AuthContext";
import { Project } from "@/models/models";
import ProjectCard from "./ProjectCard";

/*
 * TODO: Palette merging bug
 *
 */

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

  const projectDelete = async (id: string) => {
    const res = await ProjectsManager.removeProject(id);
    setProjects((prev) => prev.filter((project) => project._id !== id));
  };

  return (
    <div className={`${styles.projects}`}>
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
        {!fetching && (
          <div className={styles.projectsGrid}>
            {projects.length === 0 ? (
              <div>No projects yet.</div>
            ) : projects.length < 3 ? (
              <>
                {projects.map((project) => (
                  <ProjectCard
                    key={project._id}
                    project={project}
                    deleteProject={projectDelete}
                  />
                ))}
                {/* Placeholders for layout */}
                <div></div>
                <div></div>
              </>
            ) : (
              projects.map((project) => (
                <ProjectCard
                  key={project._id}
                  project={project}
                  deleteProject={projectDelete}
                />
              ))
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default Projects;
