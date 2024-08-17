import { Box, Stack, useTheme } from "@mui/material";
import { OverlayLayout } from "../low-level/overlay_layout";

function DataGridLoadingLayout(
  props: Readonly<{
    isLoading: boolean;
    loadingContent: React.ReactNode;
    sizeAnchor: string;
    children: React.ReactNode;
  }>,
) {
  const { palette } = useTheme();

  return (
    <OverlayLayout show={props.isLoading} overlayContent={props.loadingContent}>
      <Stack
        sx={{
          // DataGrids require absolute heights, so we'll use relative view-height.
          height: `calc(100vh - ${props.sizeAnchor})`,
          gap: "1rem",
        }}
      >
        {props.isLoading ? (
          <Box
            sx={{
              height: "inherit",
              width: "100%",
              bgcolor: palette.grey[100],
              borderRadius: ".25rem",
            }}
          />
        ) : (
          props.children
        )}
      </Stack>
    </OverlayLayout>
  );
}

export default DataGridLoadingLayout;
