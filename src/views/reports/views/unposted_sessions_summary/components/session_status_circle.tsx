import { Box, useTheme } from "@mui/material";
import { GridRenderCellParams, GridTreeNodeWithRender } from "@mui/x-data-grid";
import { placeholderForFutureLogErrorText } from "../../../../../temp/errorText";
import { useMemo } from "react";

export type SessionStatus = "unposted" | "submitted" | "posted";
function SessionStatusCircle(props: {
  params: GridRenderCellParams<any, any, any, GridTreeNodeWithRender>;
  status: SessionStatus;
}) {
  const { palette } = useTheme();
  const bgcolor = useMemo(() => {
    switch (props.status) {
      case "unposted":
        return palette.error.light;
      case "submitted":
        return palette.warning.light;
      case "posted":
        return palette.success.main;
      default:
        throw new Error(placeholderForFutureLogErrorText);
    }
  }, [palette]);

  return (
    <Box
      sx={{
        bgcolor,
        minWidth: "1.2rem",
        minHeight: "1.2rem",
        borderRadius: 999,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        color: palette.getContrastText(bgcolor),
        px: ".4rem"
      }}
    >
      {props.params.value}
    </Box>
  );
}

export default SessionStatusCircle;
