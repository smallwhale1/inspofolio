import { Project } from "@/models/models";
import styles from "./Links.module.scss";
import LinkCard from "@/components/create/steps/LinkCard";
import { Tab, Tabs } from "@mui/material";
import { useState } from "react";

type Props = {
  project: Project;
};

enum LinkView {
  ALL = "all",
  PINTEREST = "pinterest",
  INSTAGRAM = "instagram",
}

const Links = ({ project }: Props) => {
  const [linkView, setLinkView] = useState<LinkView>(LinkView.ALL);

  const getView = () => {
    switch (linkView) {
      case LinkView.ALL:
        return (
          <div className={styles.linkGrid}>
            {project.links.map((link) => (
              <LinkCard link={link} clickable removeLink={() => {}} />
            ))}
          </div>
        );
      case LinkView.PINTEREST:
        return <></>;
      default:
        return <></>;
    }
  };
  return (
    <div className={styles.links}>
      <Tabs
        value={linkView}
        onChange={(e, val) => {
          setLinkView(val);
        }}
      >
        {Object.values(LinkView).map((view) => (
          <Tab label={view} value={view} />
        ))}
      </Tabs>
      {getView()}
    </div>
  );
};

export default Links;
