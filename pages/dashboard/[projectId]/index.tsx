import styles from "../../../styles/dashboard/projectPage/projectPage.module.scss";
import ImageReferences from "@/components/dashboard/projectPage/sections/ImageReferences";
import Links from "@/components/dashboard/projectPage/sections/Links";
import ProjectLayout from "@/components/dashboard/projectPage/_layout";
import { useContext, useEffect, useRef, useState } from "react";
import Palette from "@/components/dashboard/projectPage/sections/Palette";
import Music from "@/components/dashboard/projectPage/sections/Music";
import { ProjectsManager } from "@/firebase/ProjectsManager";
import { Link, Project } from "@/models/models";
import { ProjectSection } from "@/util/enums";
import { useRouter } from "next/router";
import { AuthContext } from "@/contexts/AuthContext";
import LoadingButton from "@/components/common/LoadingButton";
import { useTheme } from "@mui/material";
import { IoMdAddCircleOutline } from "react-icons/io";
import EditModal from "@/components/dashboard/projectPage/EditModal";
import AddLinks from "@/components/create/steps/AddLinks";

type Props = {};

const Project = (props: Props) => {
  const router = useRouter();
  const [projectSection, setProjectSection] = useState<ProjectSection>(
    ProjectSection.IMAGES
  );
  const [project, setProject] = useState<Project | null>(null);
  const { user, loading } = useContext(AuthContext);
  const fetchedData = useRef(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalSubmitting, setModalSubmitting] = useState(false);
  const theme = useTheme();

  const getSection = () => {
    if (!project) return <></>;
    switch (projectSection) {
      case ProjectSection.IMAGES:
        return <ImageReferences project={project} />;
      case ProjectSection.LINKS:
        return <Links removeLink={handleLinkRemove} project={project} />;
      case ProjectSection.PALETTE:
        return <Palette removeColor={handlePaletteRemove} project={project} />;
      case ProjectSection.MUSIC:
        return <Music project={project} />;
    }
  };

  const handleLinkSubmit = async (newLinks: Link[]) => {
    if (!project) return;
    await ProjectsManager.updateProject(project._id, "links", [
      ...project.links,
      ...newLinks,
    ]);
    setProject((prev) =>
      prev ? { ...prev, links: [...prev.links, ...newLinks] } : null
    );
    setModalOpen(false);
  };

  const handleLinkRemove = async (id: string) => {
    if (!project) return;
    await ProjectsManager.updateProject(
      project._id,
      "links",
      project.links.filter((link) => link._id !== id)
    );
    setProject((prev) =>
      prev
        ? { ...prev, links: prev.links.filter((link) => link._id !== id) }
        : null
    );
  };

  const handlePaletteRemove = async (hex: string) => {
    if (!project) return;
    await ProjectsManager.updateProject(
      project._id,
      "palette",
      project.palette.filter((color) => color.hex !== hex)
    );
    setProject((prev) =>
      prev
        ? {
            ...prev,
            palette: prev.palette.filter((color) => color.hex !== hex),
          }
        : null
    );
  };

  const getModalContent = () => {
    if (!project) return <></>;
    switch (projectSection) {
      case ProjectSection.IMAGES:
        return <div>To be implemented</div>;
      case ProjectSection.LINKS:
        return (
          <AddLinks
            links={project.links}
            editProps={{ onSubmit: handleLinkSubmit }}
          />
        );
      case ProjectSection.PALETTE:
        return <div>To be implemented</div>;
      case ProjectSection.MUSIC:
        return <div>To be implemented</div>;
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
      <>
        {project && (
          <div className={styles.sectionTop}>
            <h2 className={styles.sectionHeading}>{projectSection}</h2>
            {projectSection !== ProjectSection.MUSIC && (
              <LoadingButton
                text="Add"
                icon={<IoMdAddCircleOutline size={20} />}
                iconRight
                color="primary"
                onSubmit={() => {
                  setModalOpen(true);
                }}
                loading={false}
              />
            )}
          </div>
        )}
        {project ? getSection() : <></>}
        <EditModal modalOpen={modalOpen} setModalOpen={setModalOpen}>
          {getModalContent()}
        </EditModal>
      </>
    </ProjectLayout>
  );
};

export default Project;
