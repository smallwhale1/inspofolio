import styles from "./_layout.module.scss";
import { ReactElement } from "react";
import Sidebar from "./Sidebar";
import { ProjectSection } from "@/util/enums";
import Topbar from "./Topbar";
import { Source_Sans_3 } from "next/font/google";

type Props = {
  children: ReactElement;
  projectSection: ProjectSection;
  setProjectSection: (section: ProjectSection) => void;
};

const font = Source_Sans_3({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const ProjectLayout = ({
  children,
  projectSection,
  setProjectSection,
}: Props) => {
  return (
    <div className={`${styles.projectLayout} ${font.className}`}>
      <Topbar />
      <Sidebar
        projectSection={projectSection}
        setProjectSection={setProjectSection}
      />
      <main className={styles.main}>{children}</main>
    </div>
  );
};

export default ProjectLayout;
