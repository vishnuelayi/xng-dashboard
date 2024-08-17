import { styled } from "@mui/material/styles";
import Box, { type BoxProps } from "@mui/material/Box";

interface XNGLabelTextContainerProps extends BoxProps {
  flexItems?: boolean;
}

export default styled(Box, {
  shouldForwardProp: (prop) => prop !== "flexItems",
})<XNGLabelTextContainerProps>(({ flexItems = true }) => ({
  display: "inline-flex",
  alignItems: "center",
  gap: "10px",
  maxWidth: "600px",
  ...(flexItems && {
    "& > *": {
      flex: 1,
    },
  }),
}));
