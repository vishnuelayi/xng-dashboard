import { Dialog, Typography, Button } from "@mui/material";
import Box from "../components-dev/BoxExtended";
import { getSizing } from "../sizing";
import XNGClose from "../low-level/button_close";
import { useState } from "react";

export type ConfirmModalBaseProps = {
  open: boolean;
  onConfirm: () => void;
  onClose: () => void;
  injectContent?: ConfirmModalContent;

  /**
   * DEPRECATED! This is being phased out. All content-related props should extend contract of prop `injectContent`.
   */
  yesColor?: "primary" | "error";
};

export type ConfirmModalContent = {
  titleText?: string;
  body?: React.ReactNode;
  noText?: string;
  yesText?: string;
  yesColor?: "primary" | "error";
};

export type ConfirmModalProps = ConfirmModalBaseProps & ConfirmModalContent;

const BALANCE_REM = "1.5rem";

export default function ConfirmModal(props: ConfirmModalProps) {
  const yesColor = props.yesColor ?? props.injectContent?.yesColor ?? "primary";

  return (
    <Dialog maxWidth="sm" fullWidth open={props.open} onClose={() => props.onClose()}>
      <Box sx={{ p: BALANCE_REM, display: "flex", flexDirection: "column", gap: BALANCE_REM }}>
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
          <XNGClose onClick={() => props.onClose()} />
          <Typography variant="h5" className="noselect" sx={{ textAlign: "center", width: "100%" }}>
            {props.injectContent?.titleText ?? "Are you sure?"}
          </Typography>
        </Box>

        {props.injectContent?.body}

        <Box
          sx={{
            display: "flex",
            gap: BALANCE_REM,
          }}
        >
          <Button onClick={() => props.onClose()} fullWidth variant="outlined" color="inherit">
            {props.injectContent?.noText ?? "Nevermind"}
          </Button>
          <Button color={yesColor} fullWidth onClick={() => props.onConfirm()}>
            {props.injectContent?.yesText ?? "Confirm"}
          </Button>
        </Box>
      </Box>
    </Dialog>
  );
}

/**
 * Simple hook to quickly create and consume confirm modals.
 * 
 * @example
 * const [handleConfirmDelete, confirmDeleteModalEl] = useConfirmModal({
    content: {
      body: "Are you sure you want to delete?",
      yesText: "Delete",
      yesColor: "error",
    },
    onConfirm: () => delete(),
  });
 */
export function useConfirmModal(props: {
  content: ConfirmModalContent;
  onConfirm: () => void;
}): [handleConfirm: () => void, confirmModalEl: JSX.Element] {
  const { content, onConfirm } = props;

  const [open, setOpen] = useState<boolean>(false);

  function confirm() {
    setOpen(true);
  }

  const confirmModal = (
    <ConfirmModal
      open={open}
      onConfirm={() => {
        onConfirm();
        setOpen(false);
      }}
      onClose={() => setOpen(false)}
      injectContent={content}
    />
  );

  return [confirm, confirmModal];
}
