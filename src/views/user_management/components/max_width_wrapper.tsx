import { Box } from "@mui/material";
import React from "react";

export const MaxWidthWrapper = ({ children }: { children: React.ReactNode }) => {
  return <Box sx={{ maxWidth: "1920px" }}>{children}</Box>;
};
