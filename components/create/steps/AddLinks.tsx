import styles from "./AddLinks.module.scss";
import { Link } from "@/models/models";
import { Button, TextField } from "@mui/material";
import { useState } from "react";
import LinkCard from "./LinkCard";
import { ListManager } from "@/util/ListManager";
import { LinkManager } from "@/util/LinkManager";

export interface LinkCreateProps {
  onSubmit: () => void;
  onBack: () => void;
  onAdd: (newLink: string, title: string) => void;
  onRemove: (id: string) => void;
}

export interface LinkEditProps {
  onSubmit: (newLinks: Link[]) => void;
}

interface LinkProps {
  links: Link[];
  createProps?: LinkCreateProps;
  editProps?: LinkEditProps;
}

const AddLinks = ({ links, createProps, editProps }: LinkProps) => {
  const [newLink, setNewLink] = useState("");
  const [newLinkTitle, setNewLinkTitle] = useState("");
  const [newLinks, setNewLinks] = useState<Link[]>([]);

  const addLink = () => {
    if (newLink === "") {
      // handle with toast
      console.log("Link cannot be empty!");
      return;
    }
    if (createProps) {
      createProps.onAdd(newLink, newLinkTitle);
      setNewLink("");
      setNewLinkTitle("");
    } else {
      setNewLinks((prev) => [
        ...prev,
        {
          _id: ListManager.getNewId(prev),
          url: newLink,
          title: newLinkTitle,
          type: LinkManager.extractLinkType(newLink),
        },
      ]);
      setNewLink("");
      setNewLinkTitle("");
    }
  };

  const removeLink = (id: string) => {
    if (createProps) {
      createProps.onRemove(id);
    } else {
      setNewLinks((prev) => prev.filter((link) => link._id !== id));
    }
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
      {createProps ? (
        <div className={styles.addedLinks}>
          {links.map((link) => (
            <LinkCard key={link._id} link={link} removeLink={removeLink} />
          ))}
        </div>
      ) : (
        <div className={styles.addedLinks}>
          {newLinks.map((link) => (
            <LinkCard key={link._id} link={link} removeLink={removeLink} />
          ))}
        </div>
      )}
      {/* Bottom buttons */}
      {createProps && (
        <div className={styles.btnContainer}>
          <Button variant="text" onClick={createProps.onBack}>
            previous
          </Button>
          <Button
            variant={links.length === 0 ? "text" : "contained"}
            onClick={() => {
              createProps.onSubmit();
            }}
          >
            {links.length === 0 ? "skip" : "continue"}
          </Button>
        </div>
      )}
      {editProps && (
        <Button
          variant="contained"
          onClick={() => {
            editProps.onSubmit(newLinks);
          }}
        >
          submit
        </Button>
      )}
    </div>
  );
};

export default AddLinks;
