import { Button, TextField } from "@mui/material";
import styles from "./AddNameDescription.module.scss";
import { useState } from "react";

interface NameProps {
  onSubmit: (name: string, description: string) => void;
  last?: boolean;
}

const AddNameDescription = ({ onSubmit, last }: NameProps) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  return (
    <div className={styles.name}>
      <TextField
        fullWidth
        label="Name"
        placeholder="Name..."
        value={name}
        onChange={(e) => {
          setName(e.target.value);
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            onSubmit(name !== "" ? name : "Untitled Project", description);
          }
        }}
      />
      <TextField
        fullWidth
        label="What kind of project is this?"
        placeholder="Project description..."
        value={description}
        onChange={(e) => {
          setDescription(e.target.value);
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            onSubmit(name, description);
          }
        }}
      />
      {!last && (
        <Button
          variant="contained"
          onClick={() => {
            onSubmit(name, description);
          }}
        >
          Continue
        </Button>
      )}
    </div>
  );
};

export default AddNameDescription;
