import styles from "../../../styles/dashboard/projectPage/projectPage.module.scss";
import ImageReferences from "@/components/dashboard/projectPage/sections/ImageReferences";
import Links from "@/components/dashboard/projectPage/sections/Links";
import ProjectLayout from "@/components/dashboard/projectPage/_layout";
import { useContext, useEffect, useRef, useState } from "react";
import Palette from "@/components/dashboard/projectPage/sections/Palette";
import Music from "@/components/dashboard/projectPage/sections/Music";
import { ProjectsManager } from "@/firebase/ProjectsManager";
import { Project } from "@/models/models";
import { ProjectSection } from "@/util/enums";
import { useRouter } from "next/router";
import { AuthContext } from "@/contexts/AuthContext";
import LoadingButton from "@/components/common/LoadingButton";
import { useTheme } from "@mui/material";
import { IoMdAddCircleOutline } from "react-icons/io";

type Props = {};

const Project = (props: Props) => {
  const router = useRouter();
  const [projectSection, setProjectSection] = useState<ProjectSection>(
    ProjectSection.IMAGES
  );
  const [project, setProject] = useState<Project | null>(null);
  const { user, loading } = useContext(AuthContext);
  const fetchedData = useRef(false);
  const theme = useTheme();

  const getSection = () => {
    if (!project) return <></>;
    switch (projectSection) {
      case ProjectSection.IMAGES:
        return <ImageReferences project={project} />;
      case ProjectSection.LINKS:
        return <Links project={project} />;
      case ProjectSection.PALETTE:
        return <Palette project={project} />;
      case ProjectSection.MUSIC:
        return <Music project={project} />;
    }
  };

  useEffect(() => {
    if (loading) return;
    const id = router.asPath.split("/").pop();
    if (!id || !user) return;
    const fetchProject = async () => {
      fetchedData.current = true;
      const res = await ProjectsManager.getProject(id);
      if (typeof res === "string") {
        // error
      } else {
        console.log(res);
        setProject(res);
      }
    };

    fetchProject();
  }, [router, loading, user]);

  useEffect(() => {
    if (router.query.section) {
      setProjectSection(router.query.section as ProjectSection);
    }
  }, [router]);

  return (
    <ProjectLayout
      projectSection={projectSection}
      setProjectSection={setProjectSection}
    >
      <div>
        {project && (
          <div className={styles.sectionTop}>
            <h2 className={styles.sectionHeading}>{projectSection}</h2>
            <LoadingButton
              text="Add"
              icon={<IoMdAddCircleOutline size={20} />}
              iconRight
              color="primary"
              onSubmit={() => {}}
              loading={false}
            />
          </div>
        )}
        {project ? getSection() : <></>}
      </div>
    </ProjectLayout>
  );
};

export default Project;
