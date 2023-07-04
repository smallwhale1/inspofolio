import styles from "./AddLinks.module.scss";
import { Link } from "@/models/models";
import { Button, TextField, TextareaAutosize } from "@mui/material";
import { useState } from "react";
import LinkCard from "./LinkCard";

interface LinkProps {
  links: Link[];
  onBack: () => void;
  onSubmit: () => void;
  onAdd: (newLink: string, title: string) => void;
  onRemove: (id: string) => void;
}

const AddLinks = ({ links, onBack, onSubmit, onAdd, onRemove }: LinkProps) => {
  const [newLink, setNewLink] = useState("");
  const [newLinkTitle, setNewLinkTitle] = useState("");

  const addLink = () => {
    if (newLink === "") {
      // handle with toast
      console.log("Link cannot be empty!");
      return;
    }
    onAdd(newLink, newLinkTitle);

    setNewLink("");
    setNewLinkTitle("");
  };

  const removeLink = (id: string) => {
    onRemove(id);
  };

  return (
    <div className={styles.links}>
      <div className={styles.addLink}>
        <TextField
          fullWidth
          required
          label="Link URL"
          placeholder="Link URL..."
          value={newLink}
          onChange={(e) => {
            setNewLink(e.target.value);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              addLink();
            }
          }}
        />
        <Button variant="contained" onClick={addLink}>
          add
        </Button>
      </div>
      <TextField
        fullWidth
        label="Link title (recommended)"
        placeholder="Link title..."
        value={newLinkTitle}
        onChange={(e) => {
          setNewLinkTitle(e.target.value);
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            addLink();
          }
        }}
      />
      {links.length !== 0 && (
        <div className={styles.addedLinks}>
          {links.map((link) => (
            <LinkCard key={link._id} link={link} removeLink={removeLink} />
          ))}
        </div>
      )}
      <div className={styles.btnContainer}>
        <Button variant="text" onClick={onBack}>
          previous
        </Button>
        <Button
          variant={links.length === 0 ? "text" : "contained"}
          onClick={onSubmit}
        >
          {links.length === 0 ? "skip" : "continue"}
        </Button>
      </div>
    </div>
  );
};

export default AddLinks;
