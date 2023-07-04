import styles from "./_layout.module.scss";
import { ReactElement } from "react";
import Sidebar from "./Sidebar";
import { ProjectSection } from "@/util/enums";
import Topbar from "./Topbar";

type Props = {
  children: ReactElement;
  projectSection: ProjectSection;
  setProjectSection: (section: ProjectSection) => void;
};

const ProjectLayout = ({
  children,
  projectSection,
  setProjectSection,
}: Props) => {
  return (
    <div className={styles.projectLayout}>
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
