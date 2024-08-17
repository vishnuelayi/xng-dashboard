import { Stack, Button, Box } from "@mui/material";

import { MSBDateRangeSelect, MSBICONS } from "../../../../../../../fortitude";
import { Dayjs } from "dayjs";

export type StaffDirectoryPostedSessionsTabToolbarProps = {
  filters?: {
    startDate?: Dayjs | null;
    endDate?: Dayjs | null;
    onSetStartDate?: (d: Dayjs) => void;
    onSetEndDate?: (d: Dayjs) => void;
  };
  useDownloadCSV?: {
    onDownloadCSV?: () => void;
    isDownloading: boolean;
    canDownload: boolean;
  };
  onApplyFilters?: () => void;
};

const PostedSessionsTabToolbar = (props: StaffDirectoryPostedSessionsTabToolbarProps) => {
  return (
    <Stack
      aria-label="posted-sessions-tab-toolbar"
      gap={1}
      mb={3}
      sx={{
        flexDirection: {
          xs: "column",
          sm: "row",
        },
        justifyContent: {
          xs: "center",
          sm: "space-between",
        },
        alignItems: {
          xs: "center",
          sm: "flex-start",
        },
      }}
    >
      <Box
        sx={{
          display: "flex",
          gap: 1,
          flex: 1,
          flexDirection: {
            xs: "column",
            md: "row",
          },
          alignItems: {
            xs: "center",
            sm: "flex-start",
            md: "center",
          },
        }}
      >
        <Box maxWidth={400}>
          <MSBDateRangeSelect
            size="small"
            startDatePickerProps={{
              label: "Start Date",
              value: props?.filters?.startDate,
              onChange: (v) => v && props.filters?.onSetStartDate?.(v),
            }}
            endDatePickerProps={{
              label: "End Date",
              value: props?.filters?.endDate,
              onChange: (v) => v && props.filters?.onSetEndDate?.(v),
            }}
          />
        </Box>
        <Button
          sx={{ whiteSpace: "nowrap", borderRadius: 0 }}
          onClick={props.onApplyFilters}
          disabled={
            !props?.filters?.startDate ||
            !props?.filters?.endDate ||
            props.useDownloadCSV?.isDownloading
          }
        >
          Apply Filters
        </Button>
      </Box>
      <Box
        sx={{
          display: "flex",
          gap: 1,
        }}
      >
        <Button
          startIcon={
            props.useDownloadCSV?.isDownloading ? <MSBICONS.LoadingAnimation /> : <MSBICONS.Excel />
          }
          variant="outlined"
          sx={{ whiteSpace: "nowrap" }}
          onClick={props.useDownloadCSV?.onDownloadCSV}
          disabled={!props.useDownloadCSV?.canDownload}
        >
          {props.useDownloadCSV?.isDownloading ? "Downloading..." : "Export Excel"}
        </Button>
      </Box>
    </Stack>
  );
};

export default PostedSessionsTabToolbar;
