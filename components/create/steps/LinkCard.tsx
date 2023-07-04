import styles from "./LinkCard.module.scss";
import { Link } from "@/models/models";
import { LinkType } from "@/util/enums";
import { IconButton } from "@mui/material";
import { BiX } from "react-icons/bi";
import {
  BsInstagram,
  BsLink,
  BsLink45Deg,
  BsPinterest,
  BsTwitter,
  BsYoutube,
} from "react-icons/bs";

interface LinkCardProps {
  link: Link;
  removeLink: (id: string) => void;
}

const LinkCard = ({ link, removeLink }: LinkCardProps) => {
  const getLinkIcon = () => {
    const iconSize = 28;
    switch (link.type) {
      case LinkType.PINTEREST:
        return <BsPinterest size={iconSize} className={styles.icon} />;
      case LinkType.INSTAGRAM:
        return <BsInstagram size={iconSize} className={styles.icon} />;
      case LinkType.YOUTUBE:
        return <BsYoutube size={iconSize} className={styles.icon} />;
      case LinkType.TWITTER:
        return <BsTwitter size={iconSize} className={styles.icon} />;
      default:
        return <BsLink45Deg size={iconSize} className={styles.icon} />;
    }
  };
  return (
    <div className={styles.linkCard}>
      {getLinkIcon()}
      <div className={styles.link}>
        <h3 className={styles.linkTitle}>
          {link.title ? link.title : "Untitled Link"}
        </h3>
        <div className={styles.linkUrl}> {link.url}</div>
      </div>
      <IconButton
        onClick={() => {
          removeLink(link._id);
        }}
      >
        <BiX />
      </IconButton>
    </div>
  );
};

export default LinkCard;
