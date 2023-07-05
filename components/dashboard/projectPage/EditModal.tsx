import { Box, Modal } from "@mui/material";
import React, { ReactElement } from "react";

type Props = {
  modalOpen: boolean;
  setModalOpen: (open: boolean) => void;
  children: ReactElement;
};

const modalStyle = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  height: "80vh",
  width: "500px",
  bgcolor: "#ffffff",
  overflowY: "auto",
  display: "flex",
  boxSizing: "border-box",
  borderRadius: "0.5rem",
  padding: "2rem 3rem",
  flexDirection: "column",
  alignItems: "center",
  gap: "1.5rem",
};

const EditModal = ({ modalOpen, setModalOpen, children }: Props) => {
  return (
    <Modal
      open={modalOpen}
      onClose={() => {
        setModalOpen(false);
      }}
      disableAutoFocus
    >
      <Box sx={{ ...modalStyle }}>{children}</Box>
    </Modal>
  );
};

export default EditModal;
