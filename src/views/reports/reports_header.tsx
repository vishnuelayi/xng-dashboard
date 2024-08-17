import { Box, Typography, useTheme } from "@mui/material";
import MSBBack from "../../fortitude/components/button_back";
import { useNavigate } from "react-router";
import { ROUTES_XLOGS } from "../../constants/URLs";
import usePath from "../../hooks/use_path";
import { REPORTS_BALANCE_REM } from "./constants/reports_gap_rem";
import React from "react";

export type ReportsHeaderProps = Readonly<{
  headerTitle: string;
  content?: React.ReactNode;
}>;

function ReportsHeader(props: ReportsHeaderProps) {
  const path = usePath();
  const isShowingBack = Boolean(path[3]);

  const { bgcolor, contrastColor } = useHeaderPalette();

  const minWidth = props.content ? "50%" : "100%";

  return (
    <Box
      sx={{
        px: REPORTS_BALANCE_REM + "rem",
        py: "2.5rem",
        bgcolor,
        minHeight: "10rem",
        maxHeight: "10rem",
      }}
    >
      <BackButton isVisible={isShowingBack} />

      <Box sx={{ display: "flex", gap: "1rem" }}>
        <Typography
          variant="h4"
          color={contrastColor}
          sx={{
            fontSize: "2rem",
            minWidth,
            whiteSpace: "nowrap",
            overflowX: "auto",
          }}
        >
          {props.headerTitle || "Error"}
        </Typography>

        <Box
          sx={{
            minWidth,
          }}
        >
          {props.content}
        </Box>
      </Box>
    </Box>
  );
}

function BackButton(props: Readonly<{ isVisible: boolean }>) {
  const navigate = useNavigate();
  const { contrastColor } = useHeaderPalette();

  return (
    <Box
      sx={{
        visibility: props.isVisible ? "visible" : "hidden",
        position: "relative",
      }}
    >
      <Box height={"2.5rem"} />

      <Box
        sx={{
          position: "absolute",
          top: `-1.5rem`,
          left: `-${REPORTS_BALANCE_REM - 1}rem`, // This will make sure this component remains in place even when our balance changes
        }}
      >
        <MSBBack
          onClick={() => {
            navigate(`${ROUTES_XLOGS.reports.index}`);
          }}
          color={contrastColor}
        />
      </Box>
    </Box>
  );
}

function useHeaderPalette() {
  const { palette } = useTheme();

  const bgcolor = palette.primary[3]!;
  const contrastColor = palette.getContrastText(bgcolor);

  return { bgcolor, contrastColor };
}

export default ReportsHeader;
