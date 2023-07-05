import { Project } from "@/models/models";
import styles from "./Links.module.scss";
import LinkCard from "@/components/create/steps/LinkCard";
import { Tab, Tabs } from "@mui/material";
import { useState } from "react";
import {
  InstagramEmbed,
  PinterestEmbed,
  TwitterEmbed,
  TikTokEmbed,
  YouTubeEmbed,
} from "react-social-media-embed";
import { LinkManager } from "@/util/LinkManager";

type Props = {
  project: Project;
  removeLink: (id: string) => void;
};

enum LinkView {
  ALL = "all",
  INSTAGRAM = "instagram",
  PINTEREST = "pinterest",
  TIKTOK = "tiktok",
  YOUTUBE = "youtube",
  TWITTER = "twitter",
}

const Links = ({ project, removeLink }: Props) => {
  const [linkView, setLinkView] = useState<LinkView>(LinkView.ALL);

  const getView = () => {
    switch (linkView) {
      case LinkView.ALL:
        return (
          <div className={styles.linkGrid}>
            {project.links.map((link, i) => (
              <LinkCard
                key={i}
                link={link}
                clickable
                removeLink={() => {
                  removeLink(link._id);
                }}
                editLink={() => {}}
              />
            ))}
          </div>
        );
      case LinkView.PINTEREST:
        return (
          <div className={styles.embedGrid}>
            {project.links
              .filter((link) => LinkManager.validPinterestEmbed(link.url))
              .map((link, i) => (
                <PinterestEmbed key={i} url={link.url} width={"100%"} />
              ))}
            <div></div>
            <div></div>
          </div>
        );
      case LinkView.INSTAGRAM:
        return (
          <div className={styles.embedGrid}>
            {project.links
              .filter((link) => LinkManager.validInstagramEmbed(link.url))
              .map((link, i) => (
                <InstagramEmbed key={i} url={link.url} width={"100%"} />
              ))}
            <div></div>
            <div></div>
          </div>
        );
      case LinkView.YOUTUBE:
        return (
          <div className={styles.embedGrid}>
            {project.links
              .filter((link) => LinkManager.validYoutubeEmbed(link.url))
              .map((link, i) => (
                <YouTubeEmbed key={i} url={link.url} width={"100%"} />
              ))}
          </div>
        );
      case LinkView.TWITTER:
        return (
          <div className={styles.embedGrid}>
            {project.links
              .filter((link) => LinkManager.validTwitterEmbed(link.url))
              .map((link, i) => (
                <TwitterEmbed key={i} url={link.url} width={"100%"} />
              ))}
          </div>
        );
      case LinkView.TIKTOK:
        return (
          <div className={styles.embedGrid}>
            {project.links
              .filter((link) => LinkManager.validTiktokEmbed(link.url))
              .map((link, i) => (
                <TikTokEmbed key={i} url={link.url} width={"100%"} />
              ))}
            {/* <TikTokEmbed
              url="https://www.tiktok.com/@arabubick/video/7242566715463208199"
              width="100%"
            /> */}
          </div>
        );
    }
  };
  return (
    <div className={styles.links}>
      <Tabs
        value={linkView}
        onChange={(e, val) => {
          setLinkView(val);
        }}
        variant="scrollable"
      >
        {Object.values(LinkView).map((view) => (
          <Tab key={view} label={view} value={view} />
        ))}
      </Tabs>
      {getView()}
    </div>
  );
};

export default Links;
