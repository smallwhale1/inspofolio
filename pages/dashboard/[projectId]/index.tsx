import styles from "../../../styles/dashboard/projectPage/projectPage.module.scss";
import ImageReferences from "@/components/dashboard/projectPage/sections/ImageReferences";
import Links from "@/components/dashboard/projectPage/sections/Links";
import LoadingButton from "@/components/common/LoadingButton";
import CustomModal from "@/components/dashboard/projectPage/CustomModal";
import AddLinks from "@/components/create/steps/AddLinks";
import AuthGuardedLayout from "@/components/common/authGuarded/_layout";
import AddImages from "@/components/create/steps/AddImages";
import ProjectLayout from "@/components/dashboard/projectPage/_layout";
import Palette from "@/components/dashboard/projectPage/sections/Palette";
import Music from "@/components/dashboard/projectPage/sections/Music";
import { useContext, useEffect, useState } from "react";
import { ProjectsManager } from "@/firebase/ProjectsManager";
import { ImageUpload, Link, Project } from "@/models/models";
import { ProjectSection } from "@/util/enums";
import { useRouter } from "next/router";
import { AuthContext } from "@/contexts/AuthContext";
import { IconButton, useTheme } from "@mui/material";
import { IoMdAddCircleOutline } from "react-icons/io";
import { BiPlus } from "react-icons/bi";
import { StorageManager } from "@/firebase/StorageManager";
import { Track } from "@/util/SpotifyManager";
import { isErrorRes } from "@/util/errorHandling";
import { ToastContext } from "@/contexts/ToastContext";

const Project = () => {
  const router = useRouter();
  const [projectSection, setProjectSection] = useState<ProjectSection>(
    ProjectSection.IMAGES
  );
  const [routeValidity, setRouteValidity] = useState<
    "loading" | "valid" | "invalid"
  >("loading");
  const [project, setProject] = useState<Project | null>(null);
  const { user, loading } = useContext(AuthContext);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalSubmitting, setModalSubmitting] = useState(false);
  const theme = useTheme();
  const { setToastMessage } = useContext(ToastContext);
  const [minimized, setMinimized] = useState(false);

  const handleImgDelete = async (id: string) => {
    if (!user || !project) return;
    const res = await StorageManager.removeImg(id, user.uid);
    if (isErrorRes(res)) {
      setToastMessage(res.message);
      return;
    }
    const projectRes = await ProjectsManager.updateProject(
      project._id,
      "imgs",
      project.imgs.filter((img) => img._id !== id)
    );
    if (isErrorRes(projectRes)) {
      setToastMessage(projectRes.message);
      return;
    }
    setProject((prev) =>
      prev
        ? { ...prev, imgs: prev?.imgs.filter((img) => img._id !== id) }
        : null
    );
  };

  const handleResize = () => {
    if (window.innerWidth <= 600) {
      setMinimized(true);
    } else {
      setMinimized(false);
    }
  };

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    handleResize();

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const getSection = () => {
    if (!project) return <></>;
    switch (projectSection) {
      case ProjectSection.IMAGES:
        return (
          <ImageReferences
            project={project}
            handleImgDelete={handleImgDelete}
          />
        );
      case ProjectSection.LINKS:
        return <Links removeLink={handleLinkRemove} project={project} />;
      case ProjectSection.PALETTE:
        return <Palette removeColor={handlePaletteRemove} project={project} />;
      case ProjectSection.MUSIC:
        return (
          <Music
            project={project}
            onAdd={handlePlaylistAdd}
            onRemove={handlePlaylistRemove}
          />
        );
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

  const handleImgUpdate = async (newImgs: ImageUpload[]) => {
    if (!project || !user) return;
    const imgs = await ProjectsManager.updateImages(project, newImgs, user.uid);
    if (isErrorRes(imgs)) {
      setToastMessage(imgs.message);
      return;
    }
    setProject((prev) =>
      prev === null ? null : { ...prev, imgs: [...prev.imgs, ...imgs] }
    );
    setModalOpen(false);
  };

  const handlePlaylistAdd = async (track: Track) => {
    if (!project || typeof project.playlist === "string") return;
    // right now, only handling the list of tracks case
    if (project.playlist.some((t) => t.id === track.id)) return;
    await ProjectsManager.updateProject(project._id, "playlist", [
      ...project.playlist,
      track,
    ]);
    setProject({ ...project, playlist: [...project.playlist, track] });
  };

  const handlePlaylistRemove = async (trackId: string) => {
    if (!project || typeof project.playlist === "string") return;
    await ProjectsManager.updateProject(
      project._id,
      "playlist",
      project.playlist.filter((t) => t.id !== trackId)
    );
    setProject({
      ...project,
      playlist: project.playlist.filter((t) => t.id !== trackId),
    });
  };

  const getModalContent = () => {
    if (!project) return <></>;
    switch (projectSection) {
      case ProjectSection.IMAGES:
        return (
          <AddImages
            editProps={{
              onSubmit: handleImgUpdate,
            }}
          />
        );
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
      const res = await ProjectsManager.getProject(id);
      if (isErrorRes(res)) {
        setToastMessage(res.message);
        setRouteValidity("invalid");
      } else {
        setProject(res);
        setRouteValidity("valid");
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
    <AuthGuardedLayout>
      <>
        {routeValidity !== "loading" &&
          (routeValidity === "valid" ? (
            <ProjectLayout
              projectSection={projectSection}
              setProjectSection={setProjectSection}
            >
              <>
                {project && (
                  <div className={styles.sectionTop}>
                    <h2 className={styles.sectionHeading}>{projectSection}</h2>
                    {projectSection !== ProjectSection.MUSIC &&
                      (minimized ? (
                        <IconButton color="primary">
                          <BiPlus />
                        </IconButton>
                      ) : (
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
                      ))}
                  </div>
                )}
                {project ? getSection() : <></>}
                <CustomModal modalOpen={modalOpen} setModalOpen={setModalOpen}>
                  {getModalContent()}
                </CustomModal>
              </>
            </ProjectLayout>
          ) : (
            <div>You aren&apos;t authorized to access this resource.</div>
          ))}
      </>
    </AuthGuardedLayout>
  );
};

export default Project;
