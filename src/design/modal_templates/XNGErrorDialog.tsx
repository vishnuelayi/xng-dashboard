import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogProps,
  DialogTitle,
  Typography,
} from "@mui/material";
import { XNGICONS, XNGIconRenderer } from "../icons";
import XNGClose from "../low-level/button_close";

type Props = {
  title?: string;
  open: DialogProps["open"];
  onClose: DialogProps["onClose"];
  // dialogProps: DialogProps;
  children: React.ReactNode;
  useClose?: {
    closeButton?: boolean;
    closeButtonLabel?: string;
    closeButtonColor?: "primary" | "error" | "info" | "secondary" | "success" | "warning";
  };
};
/** CUSTOM REUSABLE DIALOG COMPONENT
 * PROPS ->
 * DialogProps: for the dialog component in MUI, completely cusomizable based on design needs while also maintaining coherence with our current design
 * chilren: Takes in React node for custom children
 * closeButton: optional parameter to enable the close button
 *
 */
const XNGErrorDialog = (props: Props) => {
  return (
    <Dialog open={props.open} onClose={props.onClose} PaperProps={{ sx: { paddingBlock: "1rem" } }}>
      <Box
        sx={{
          position: "absolute",
          top: "1rem",
          right: "1rem",
        }}
      >
        <XNGClose
          onClick={(e) => {
            if (props.onClose) props?.onClose(e!, "backdropClick");
          }}
        />
      </Box>
      <DialogTitle
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          minWidth: { sm: "300px" },
        }}
      >
        <XNGIconRenderer i={<XNGICONS.Alert />} size="lg" />
        <Typography variant="h5" mt={"5px"}>
          {props?.title || "Attention"}
        </Typography>
      </DialogTitle>

      <DialogContent>{props.children}</DialogContent>
      <DialogActions sx={{ display: "flex", justifyContent: "center" }}>
        {props.useClose && (
          <Button
            variant="contained"
            color={props.useClose.closeButtonColor || "primary"}
            onClick={(e) => {
              if (props.onClose) {
                props?.onClose(e, "backdropClick");
              }
            }}
          >
            {props.useClose.closeButtonLabel || "Close"}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default XNGErrorDialog;
