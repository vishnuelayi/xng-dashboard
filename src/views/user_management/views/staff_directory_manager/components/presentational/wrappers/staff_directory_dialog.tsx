import { Dialog } from "@mui/material";
import React, { CSSProperties } from "react";
import XNGClose from "../../../../../../../design/low-level/button_close";

type Props = {
  isOpen: boolean;
  onClose: ((event: {}, reason: "backdropClick" | "escapeKeyDown") => void) | undefined;
  maxWidth?: CSSProperties["minWidth"];
  minWidth?: CSSProperties["minWidth"];
  width?: CSSProperties["width"];
  children: React.ReactNode;
  useCloseButton?: boolean;
};

const StaffDirectoryDialog = (props: Props) => {
  return (
    <Dialog
      open={props.isOpen}
      onClose={props.onClose}
      sx={{
        zIndex: 600,
      }}
      PaperProps={{
        sx: {
          maxWidth: props.maxWidth ?? "458px",
          minWidth: props.minWidth,
          width: props.width,
          p: 3,
        },
      }}
    >
      {props.useCloseButton && (
        <XNGClose
          sx={{
            position: "absolute",
            right: "16px",
            top: "16px",
          }}
          onClick={(e) => {
            if (props.onClose) props?.onClose(e, "backdropClick");
          }}
        />
      )}
      {props.children}
    </Dialog>
  );
};

export default StaffDirectoryDialog;
