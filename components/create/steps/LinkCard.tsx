import styles from "./LinkCard.module.scss";
import { Link } from "@/models/models";
import { LinkType } from "@/util/enums";
import { IconButton, useTheme } from "@mui/material";
import { BiPencil, BiX } from "react-icons/bi";
import {
  BsInstagram,
  BsLink45Deg,
  BsPinterest,
  BsTiktok,
  BsTwitter,
  BsYoutube,
} from "react-icons/bs";
import { RxFigmaLogo } from "react-icons/rx";
import { FaArtstation } from "react-icons/fa";

interface LinkCardProps {
  link: Link;
  removeLink?: (id: string) => void;
  editLink?: (id: string) => void;
  clickable?: boolean;
}

const LinkCard = ({ link, removeLink, editLink, clickable }: LinkCardProps) => {
  const theme = useTheme();

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
      case LinkType.TIKTOK:
        return <BsTiktok size={iconSize} className={styles.icon} />;
      case LinkType.ARTSTATION:
        return <FaArtstation size={iconSize} className={styles.icon} />;
      case LinkType.FIGMA:
        return <RxFigmaLogo size={iconSize} className={styles.icon} />;
      default:
        return <BsLink45Deg size={iconSize} className={styles.icon} />;
    }
  };

  const clickableLink = () => (
    <a
      href={link.url}
      className={styles.linkCard}
      style={{ borderColor: theme.palette.grey300.main }}
      target="_blank"
    >
      {getLinkIcon()}
      <div className={styles.link}>
        <h3 className={styles.linkTitle}>
          {link.title ? link.title : "Untitled Link"}
        </h3>
        <div className={styles.linkUrl}> {link.url}</div>
      </div>
      {/* {editLink && (
        <IconButton
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            editLink?.(link._id);
          }}
          onPointerDown={(e) => {
            e.stopPropagation();
          }}
        >
          <BiPencil />
        </IconButton>
      )} */}
      {removeLink && (
        <IconButton
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            removeLink?.(link._id);
          }}
          onPointerDown={(e) => {
            e.stopPropagation();
          }}
        >
          <BiX />
        </IconButton>
      )}
    </a>
  );

  const preview = () => (
    <div
      className={styles.linkCard}
      style={{ borderColor: theme.palette.grey300.main }}
    >
      {getLinkIcon()}
      <div className={styles.link}>
        <h3 className={styles.linkTitle}>
          {link.title ? link.title : "Untitled Link"}
        </h3>
        <div className={styles.linkUrl}> {link.url}</div>
      </div>
      {removeLink && (
        <IconButton
          onClick={() => {
            removeLink?.(link._id);
          }}
        >
          <BiX />
        </IconButton>
      )}
    </div>
  );

  return clickable ? clickableLink() : preview();
};

export default LinkCard;
