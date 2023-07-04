import styles from "./AddTags.module.scss";
import { Button, IconButton, TextField, useTheme } from "@mui/material";
import { useState } from "react";
import { Tag } from "@/models/models";
import { ListManager } from "@/util/ListManager";
import { BiX } from "react-icons/bi";
import { Oval } from "react-loader-spinner";

interface TagsProps {
  tags: Tag[];
  onBack: () => void;
  onAdd: (tag: string) => void;
  onRemove: (id: string) => void;
  onSubmit: () => void;
  loading: boolean;
}

const AddTags = ({
  onBack,
  onAdd,
  onRemove,
  onSubmit,
  tags,
  loading,
}: TagsProps) => {
  const [newTag, setNewTag] = useState("");
  const theme = useTheme();

  return (
    <div className={styles.tags}>
      <div className={styles.addTag}>
        <TextField
          fullWidth
          required
          label="Tag"
          placeholder="Tag..."
          value={newTag}
          onChange={(e) => {
            setNewTag(e.target.value);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              onAdd(newTag);
              setNewTag("");
            }
          }}
        />
        <Button
          variant="contained"
          onClick={() => {
            onAdd(newTag);
            setNewTag("");
          }}
        >
          add
        </Button>
      </div>
      {tags.length !== 0 && (
        <div className={styles.addedTags}>
          {tags.map((tag) => (
            <Tag
              key={tag._id}
              tag={tag}
              removeTag={() => {
                onRemove(tag._id);
              }}
            />
          ))}
        </div>
      )}
      <div className={styles.btnContainer}>
        <Button variant="text" onClick={onBack}>
          previous
        </Button>
        <Button
          variant={"contained"}
          onClick={() => {
            onSubmit();
          }}
        >
          create project
          {loading && (
            <Oval
              height={20}
              width={20}
              color="#ffffff"
              visible={true}
              ariaLabel="oval-loading"
              secondaryColor={theme.palette.grey200.main}
              strokeWidth={3}
              strokeWidthSecondary={3}
            />
          )}
        </Button>
      </div>
    </div>
  );
};

interface TagProps {
  tag: Tag;
  removeTag: (id: string) => void;
}
const Tag = ({ tag, removeTag }: TagProps) => {
  const theme = useTheme();
  return (
    <div
      className={styles.tag}
      style={{
        backgroundColor: theme.palette.grey200.main,
        color: theme.palette.grey500.main,
      }}
    >
      {tag.tag}
      <IconButton
        size={"small"}
        onClick={() => {
          removeTag(tag._id);
        }}
      >
        <BiX />
      </IconButton>
    </div>
  );
};

export default AddTags;
