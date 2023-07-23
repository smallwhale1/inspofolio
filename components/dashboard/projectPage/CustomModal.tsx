import { ReactElement } from "react";
import { Box, Modal } from "@mui/material";
import { Source_Sans_3 } from "next/font/google";

type Props = {
  modalOpen: boolean;
  setModalOpen: (open: boolean) => void;
  children: ReactElement;
  fitSize?: boolean;
};

const font = Source_Sans_3({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

// Project editing modal
const CustomModal = ({ modalOpen, setModalOpen, fitSize, children }: Props) => {
  const modalStyle = {
    position: "absolute" as "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    height: "80vh",
    width: "500px",
    bgcolor: "#ffffff",
    overflowY: "auto",
    boxSizing: "border-box",
    borderRadius: "0.5rem",
    padding: "2rem",
  };

  const fitSizeModalStyle = {
    position: "absolute" as "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    bgcolor: "#ffffff",
    overflowY: "auto",
    boxSizing: "border-box",
    borderRadius: "0.5rem",
    padding: "2rem",
  };

  return (
    <Modal
      open={modalOpen}
      onClose={() => {
        setModalOpen(false);
      }}
      disableAutoFocus
    >
      <Box sx={fitSize ? { ...fitSizeModalStyle } : { ...modalStyle }}>
        <div
          className={`${font.className}`}
          style={{
            // display: "flex",
            // flexDirection: "column",
            // gap: "1.5rem",
            height: "100%",
          }}
        >
          {children}
        </div>
      </Box>
    </Modal>
  );
};

export default CustomModal;
