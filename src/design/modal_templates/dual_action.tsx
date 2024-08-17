import Box from "../components-dev/BoxExtended";
import { Dialog, Typography, Button, SxProps } from "@mui/material";
import { getSizing } from "../sizing";
import XNGClose from "../low-level/button_close";

export interface SingleActionModalContent {
  icon?: React.ReactNode;
  header?: string;
  body?: React.ReactNode;
  noText?: string;
  yesText?: string;
  onYesButtonClick?: () => void;
  onNoButtonClick?: () => void;
  buttonStyles?: {
    yesButton: SxProps;
    noButton: SxProps;
  };
}

type DualActionModalProps = {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  onReject: () => void;
  injectContent?: SingleActionModalContent;
};
export function DualActionModal(props: DualActionModalProps) {
  return (
    <Dialog open={props.open} onClose={() => props.onClose()} maxWidth="sm">
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          flexDirection: "column",
          p: getSizing(5),
          gap: getSizing(2),
          maxWidth: "360px",
          textAlign: "center",
        }}
      >
        <Box
          sx={{
            position: "absolute",
            top: "1rem",
            right: "1rem",
          }}
        >
          <XNGClose onClick={() => props.onClose()} />
        </Box>
        {props.injectContent?.icon || null}
        <Typography variant="h5" className="noselect">
          {props.injectContent?.header ?? "Are you sure?"}
        </Typography>
        {props.injectContent?.body}
        <Box
          mt={getSizing(2)}
          sx={{
            display: "flex",
            gap: getSizing(2),
            justifyContent: "space-between",
          }}
        >
          <Button
            sx={
              props.injectContent?.buttonStyles
                ? { ...props.injectContent.buttonStyles.noButton }
                : { mt: getSizing(1) }
            }
            onClick={() => {
              if (props.injectContent?.onNoButtonClick) props.injectContent?.onNoButtonClick();
              props.onReject();
            }}
          >
            {props.injectContent?.noText ?? "No"}
          </Button>
          <Button
            sx={
              props.injectContent?.buttonStyles
                ? { ...props.injectContent.buttonStyles.yesButton }
                : { mt: getSizing(1) }
            }
            onClick={() => {
              if (props.injectContent?.onYesButtonClick) props.injectContent?.onYesButtonClick();
              props.onConfirm();
            }}
          >
            {props.injectContent?.yesText ?? "Yes"}
          </Button>
        </Box>
      </Box>
    </Dialog>
  );
}
