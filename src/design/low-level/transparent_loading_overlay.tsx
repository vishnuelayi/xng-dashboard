import { Box, CircularProgress, SxProps, Typography } from "@mui/material";
import React from "react";

/**
 * This component will render a layout that can render a transparent save overlay based on the provided prop `isOpen`.
 */
export default function LoadingOverlayLayout(props: {
  isOpen: boolean;
  children: React.ReactNode;
  sx?: SxProps;
  text?: string;
}) {
  return (
    <Box
      sx={{
        position: "relative",
        overflow: "hidden",
        width: "100%",
        ...props.sx,
      }}
    >
      <Box
        sx={{
          position: "absolute",
          bottom: 0,
          right: "5rem",
          display: "flex",
          alignItems: "center",
          gap: "1rem",
          boxShadow: 1,
          border: "1px solid #0002",
          padding: "1rem",
          borderTopLeftRadius: "8px",
          borderTopRightRadius: "8px",
          borderBottom: "unset",
          transform: `translateY(${props.isOpen ? "0%" : "100%"})`,
          transition: "transform .1s ease-in-out",
          bgcolor: "#FFF",
          zIndex: 999,
        }}
      >
        <CircularProgress size="1rem" color="primary" />
        <Typography className="noselect" variant="body1">
          {props.text ?? "Saving"}...
        </Typography>
      </Box>

      <Box
        sx={{
          display: props.isOpen ? "block" : "none",
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          bgcolor: "#0001",
        }}
      />

      {props.children}
    </Box>
  );
}
