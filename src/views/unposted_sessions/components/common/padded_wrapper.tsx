import { Box, BoxProps } from "@mui/material";
import React from "react";

type Props = {
  children: React.ReactNode;
  fullwidth?: boolean;
  fullHeight?: boolean;
  sx?: BoxProps["sx"];
};
const PaddedWrapper = (props: Props) => {
  const { sx, fullHeight, fullwidth, children } = props;
  return (
    <Box
      px={5}
      position={"relative"}
      sx={{
        width: fullwidth ? "100%" : "auto",
        height: fullHeight ? "100%" : "auto",
        ...sx,
      }}
    >
      {children}
    </Box>
  );
};

export default PaddedWrapper;
