import styles from "../../styles/create/create.module.scss";
import AddNameDescription from "../../components/create/steps/AddNameDescription";
import AddImages from "../../components/create/steps/AddImages";
import AddLinks from "../../components/create/steps/AddLinks";
import AddTags from "@/components/create/steps/AddTags";
import Image from "next/image";
import AuthGuardedLayout from "@/components/common/authGuarded/_layout";
import { useTheme } from "@mui/material";
import { useRouter } from "next/router";
import { ReactNode, useContext, useEffect, useState } from "react";
import { Playfair_Display } from "next/font/google";
import { BsArrowRightCircle } from "react-icons/bs";
import { fadeDuration } from "@/util/constants";
import { CreateProject } from "@/util/interfaces";
import { CreateManager } from "@/util/CreateManager";
import { ProjectsManager } from "@/firebase/ProjectsManager";
import { AuthContext } from "@/contexts/AuthContext";

interface Step {
  label: string;
  description?: string;
  component: ReactNode;
}

enum AnimationState {
  RIGHT = "right",
  LEFT = "left",
  CENTER = "center",
}

const animationDuration = 0.5;

const font = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const create = () => {
  const [currStep, setCurrStep] = useState<number>(0);
  const [bgImgLoaded, setBgImgLoaded] = useState(false);
  const [visible, setVisible] = useState(false);
  const [project, setProject] = useState<CreateProject>({
    name: "",
    description: "",
    imgs: [],
    palette: [],
    links: [],
    tags: [],
  });
  const { user, loading } = useContext(AuthContext);
  const [animationState, setAnimationState] = useState<AnimationState>(
    AnimationState.CENTER
  );
  // Query parameter for first time or if they don't have any projects yet
  const router = useRouter();
  const theme = useTheme();
  const [submitting, setSubmitting] = useState(false);

  const handleProjectSubmit = async () => {
    console.log(project);
    if (!user) return;
    setSubmitting(true);
    const res = await ProjectsManager.addProject(project, user.uid);
    setSubmitting(false);
  };

  const getAnimationClass = () => {
    switch (animationState) {
      case AnimationState.CENTER:
        return styles.centerAnimation;
      case AnimationState.LEFT:
        return styles.leftAnimation;
      case AnimationState.RIGHT:
        return styles.rightAnimation;
    }
  };

  const animateStep = (type: "next" | "prev", intermediate?: () => void) => {
    if (type === "prev") {
      setAnimationState(AnimationState.RIGHT);
      setTimeout(() => {
        intermediate?.();
        setAnimationState(AnimationState.LEFT);
        setTimeout(() => {
          setAnimationState(AnimationState.CENTER);
        }, animationDuration * 1000);
      }, animationDuration * 1000);
    } else {
      setAnimationState(AnimationState.LEFT);
      setTimeout(() => {
        intermediate?.();
        setAnimationState(AnimationState.RIGHT);
        setTimeout(() => {
          setAnimationState(AnimationState.CENTER);
        }, animationDuration * 1000);
      }, animationDuration * 1000);
    }
  };

  const addImgs = (imgFiles: File[]) => {
    CreateManager.addImgs(imgFiles, setProject);
  };

  const removeImg = (id: string) => {
    CreateManager.removeImg(id, setProject);
  };

  const addTag = (newTag: string) => {
    CreateManager.addTag(newTag, project, setProject);
  };

  const removeTag = (id: string) => {
    CreateManager.removeTag(id, setProject);
  };

  const addLink = (newLink: string, title: string) => {
    CreateManager.addLink(newLink, setProject, title);
  };

  const removeLink = (id: string) => {
    CreateManager.removeLink(id, setProject);
  };

  const steps: Step[] = [
    {
      label: "Enter a name for your project.",
      component: (
        <AddNameDescription
          onSubmit={(name, description) => {
            setProject((prev) => ({ ...prev, name, description }));
            animateStep("next", () => {
              setCurrStep((prev) => prev + 1);
            });
          }}
        />
      ),
    },
    {
      label: "Add reference images (optional).",
      component: (
        <AddImages
          imgs={project.imgs}
          onAdd={addImgs}
          onRemove={removeImg}
          onBack={() => {
            animateStep("prev", () => {
              setCurrStep((prev) => prev - 1);
            });
          }}
          onSubmit={() => {
            animateStep("next", () => {
              setCurrStep((prev) => prev + 1);
            });
          }}
        />
      ),
    },
    {
      label: "Add links (optional).",
      description:
        "Add links to content that you want to reference (e.g. Pinterest, Instagram, Twitter, etc.)",
      component: (
        <AddLinks
          links={project.links}
          onBack={() => {
            animateStep("prev", () => {
              setCurrStep((prev) => prev - 1);
            });
          }}
          onAdd={addLink}
          onRemove={removeLink}
          onSubmit={() => {
            animateStep("next", () => {
              setCurrStep((prev) => prev + 1);
            });
          }}
        />
      ),
    },
    {
      label: "Add tags (up to 5).",
      description:
        "Add keywords or phrases that describe your project (e.g. vibrant, ethereal, bold, dynamic, mystical, etc.). These will be used to auto-generate Spotify playlists.",
      component: (
        <AddTags
          loading={submitting}
          onBack={() => {
            animateStep("prev", () => {
              setCurrStep((prev) => prev - 1);
            });
          }}
          tags={project.tags}
          onAdd={addTag}
          onRemove={removeTag}
          onSubmit={handleProjectSubmit}
        />
      ),
    },
  ];

  useEffect(() => {
    setVisible(true);
  }, []);

  return (
    <AuthGuardedLayout>
      <div
        className={`${styles.create} ${font.className} ${
          visible && styles.visible
        }`}
        style={{
          backgroundColor: theme.palette.bgColor.main,
          transitionDuration: `${fadeDuration}s`,
        }}
      >
        {/*  Overall layout for each step */}
        <div className={styles.left}>
          <div className={styles.heading}>
            {router.query.guest && (
              <span
                className={styles.label}
                style={{ color: theme.palette.primary.main }}
              >
                demo
              </span>
            )}
            <h2>Create a new project.</h2>
            <p style={{ color: theme.palette.textGrey.main }}>
              Each project contains the images, palette, links, and playlists
              for your reference during your workflow. Don't worry about adding
              everything now, you can always add content later!
            </p>
            <div className={styles.stepLabel}>
              <BsArrowRightCircle />
              <span>
                Step {currStep + 1} of {steps.length}
              </span>
            </div>
          </div>
          {/* Content specific section */}
          <div
            className={`${styles.stepContent} ${getAnimationClass()}`}
            style={{ transitionDuration: `${animationDuration}s` }}
          >
            <h1>{steps[currStep].label}</h1>
            <p>{steps[currStep].description && steps[currStep].description} </p>
            {steps[currStep].component}
          </div>
        </div>
        {/* Image background */}
        <div className={styles.right}>
          <Image
            className={`${styles.bgImg} ${bgImgLoaded && styles.fadeIn}`}
            src="/assets/images/inspofolio-auth-bg-1.jpg"
            alt="buildings background"
            fill
            onLoad={() => {
              setBgImgLoaded(true);
            }}
          />
          <div className={styles.overlay}></div>
        </div>
      </div>
    </AuthGuardedLayout>
  );
};

export default create;
