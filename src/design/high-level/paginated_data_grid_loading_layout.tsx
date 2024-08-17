import { Stack, useTheme } from "@mui/material";
import { OverlayLayout } from "../low-level/overlay_layout";

/**
 * Unlike the DataGridLoadingLayout, this variant will allow the DataGrid header and footer to remain interactive.
 */
function PaginatedDataGridLoadingLayout(
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
          ".MuiDataGrid-overlay": { bgcolor: palette.grey[100] },
        }}
      >
        {props.children}
      </Stack>
    </OverlayLayout>
  );
}

export default PaginatedDataGridLoadingLayout;
