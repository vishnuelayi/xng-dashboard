import { Modal, SxProps } from "@mui/material";
import { useState } from "react";
import Box from "../components-dev/BoxExtended";

interface IXNGModal {
  children: React.ReactNode;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  sx?: SxProps;
}

function XNGModal(props: IXNGModal) {
  const [open, setOpen] = useState(true);
  const handleClose = () => {
    setOpen(false);
    props.setShowModal(false);
  };
  const STYLES = props.sx ? props.sx : ({} as SxProps);

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      sx={{ ...STYLES, backgroundColor: "rgba(158,158,158,0.45)" }}
    >
      <Box>{props.children}</Box>
    </Modal>
  );
}

export default XNGModal;
