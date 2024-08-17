import { Button, Tooltip, Typography } from "@mui/material";
import {
  GridToolbarColumnsButton,
  GridToolbarContainer,
  GridToolbarDensitySelector,
} from "@mui/x-data-grid";
import { DotDotDot } from "../../../../design/components-dev/dot_dot_dot";
import { RiDownloadCloudFill as DownloadIcon } from "react-icons/ri";

const BUTTON_VARIANT = "text";

function UnpostedSessionsReportToolbar(
  props: Readonly<{
    onDownload: () => void;
    shouldDisableDownloadAsCsv: boolean;
    isPolling: boolean;
  }>,
) {
  return (
    <GridToolbarContainer sx={{ mb: ".5rem" }}>
      <GridToolbarColumnsButton variant={BUTTON_VARIANT} />
      <GridToolbarDensitySelector variant={BUTTON_VARIANT} />

      <Tooltip
        disableInteractive
        title={
          props.shouldDisableDownloadAsCsv && props.isPolling ? (
            <Typography variant="body2">
              Hold tight! We're getting this ready for you
              <DotDotDot />
            </Typography>
          ) : (
            ""
          )
        }
        placement="top"
        arrow
      >
        <div>
          <Button
            variant={BUTTON_VARIANT}
            disabled={props.shouldDisableDownloadAsCsv}
            startIcon={<DownloadIcon />}
            onClick={props.onDownload}
            size="small"
          >
            Download CSV
          </Button>
        </div>
      </Tooltip>
    </GridToolbarContainer>
  );
}

export default UnpostedSessionsReportToolbar;
