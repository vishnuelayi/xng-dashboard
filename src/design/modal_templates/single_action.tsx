import Box from "../components-dev/BoxExtended";
import { Dialog, Typography, Button } from "@mui/material";
import { getSizing } from "../sizing";
import { XNGICONS, XNGIconRenderer } from "../icons";
import usePalette from "../../hooks/usePalette";
import XNGClose from "../low-level/button_close";

export interface SingleActionModalContent {
  icon?: React.ReactNode;
  header?: string;
  body?: React.ReactNode;
  buttonText?: string;
  onButtonClick?: () => void;
}

type SingleActionModalProps = {
  open: boolean;
  onClose: () => void;
  useTemplate?: "coming soon"; // || "future new template variant"
  injectContent?: SingleActionModalContent;
};
export function SingleActionModal(props: SingleActionModalProps) {
  const content = useContent(props);

  return (
    <Dialog open={props.open} onClose={() => props.onClose()} sx={{
      zIndex: 3000,
    }}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          flexDirection: "column",
          p: getSizing(5),
          gap: getSizing(2),
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
        {content.icon}
        <Typography variant="h5" className="noselect">
          {content.header}
        </Typography>
        {content.body}
        <Button
          sx={{ mt: getSizing(1) }}
          onClick={() => {
            if (props.injectContent?.onButtonClick) props.injectContent?.onButtonClick();
            props.onClose();
          }}
        >
          {content.buttonText}
        </Button>
      </Box>
    </Dialog>
  );
}

function useContent(props: SingleActionModalProps) {
  const palette = usePalette();

  function getBaseContent() {
    if (props.useTemplate === "coming soon") {
      return {
        icon: <XNGIconRenderer color={palette.contrasts[1]} size="3rem" i={<XNGICONS.Tools />} />,
        header: "Coming soon!",
        body: (
          <Typography variant="body1">
            This feature is still under construction, and will be available soon.
          </Typography>
        ),
        buttonText: "Take me back",
      };
    }

    return {
      header: "Single Action Modal",
      body: null,
      buttonText: "Okay",
    };
  }

  const baseContent = getBaseContent();

  const overriddenContent: SingleActionModalContent = {
    icon: props.injectContent?.icon ?? baseContent.icon,
    header: props.injectContent?.header ?? baseContent.header,
    body: props.injectContent?.body ?? baseContent.body,
    buttonText: props.injectContent?.buttonText ?? baseContent?.buttonText,
  };

  return overriddenContent;
}
