import ReportsLayout from "../../reports_layout";
import DataGridLoadingLayout from "../../../../design/high-level/data_grid_loading_layout";
import { Box, Checkbox, FormControlLabel, Stack, Typography, useTheme } from "@mui/material";
import useBreakpointHelper from "../../../../design/hooks/use_breakpoint_helper";
import { DataGrid, DataGridProps } from "@mui/x-data-grid";
import { useState } from "react";
import { useXNGSelector } from "../../../../context/store";
import { selectStateInUS } from "../../../../context/slices/stateInUsSlice";
import { PageParameters } from "@xng/reporting";
import { useAccountStudentReportTable } from "./hooks/use_account_student_report_table";
import { useCSVPollRequestByState } from "./hooks/use_csv_poll_request_by_state";
import { useReportRunDateAndID } from "./hooks/use_report_run_date_and_id";
import useEffectSkipMount from "../../../../hooks/use_effect_after_mount";
import QueryStatusModal from "../../../../design/modal_templates/query_status_modal";
import ExportToCSVButton from "../../components/export_to_csv";
import { LoadingResponseMessageTemplate } from "../../../../design/templates/loading_response_message_template";

export const ACCOUNT_STUDENT_REPORT_STATEINUS_FALLTHROUGH =
  "Fallthrough in switch statement! Has a new state been introduced to the Account Student Report feature?";

export function AccountStudentReport() {
  const bph = useBreakpointHelper();
  const isCollapsed = bph.isGreaterThanEqualTo("md");
  const stateInUS = useXNGSelector(selectStateInUS);

  const [includeInactive, setIncludeInactive] = useState<boolean>(false);

  const [pageParameters, setPageParameters] = useState<PageParameters>({
    pageNumber: 1,
    pageSize: 100,
  });

  const [isCSVDownloading, setIsCSVDownloading] = useState<boolean>(false);

  const reportRunDateAndID = useReportRunDateAndID({ includeInactive });
  const poll = useCSVPollRequestByState({ reportRunDateAndID });
  const [isCSVModalOpen, setIsCSVModalOpen] = useState<boolean>(false);
  const date = new Date().toLocaleDateString().split("/").join("_");

  const { table, totalRecords } = useAccountStudentReportTable({
    includeInactive,
    pageParameters,
    reportRunDateAndID,
  });

  const { dataGridPaginationProps } = useReportingPagination({
    totalRecords,
    onPageParametersChange: (v) => setPageParameters(v),
  });

  useEffectSkipMount(() => {
    if (!isCSVDownloading) return;

    poll.start();
    setIsCSVModalOpen(true);
  }, [isCSVDownloading]);

  useEffectSkipMount(() => {
    if (poll.mutation.isError) {
      setIsCSVDownloading(false);
      setIsCSVModalOpen(true);
      return;
    }

    if (!poll.result) return;
    setIsCSVModalOpen(true);

    let url = window.URL.createObjectURL(poll.result);
    let a = document.createElement("a");
    a.href = url;
    a.download = `AccountStudentReport_${date}.csv`;
    a.click();

    setIsCSVDownloading(false);
  }, [poll.result, poll.mutation.isError]);

  function handleModalClose() {
    if (poll.mutation.isError) {
      setIsCSVDownloading(false);
    }
    setIsCSVModalOpen(false);
  }

  function handleExportToCsvClick() {
    setIsCSVDownloading(true);
    switch (stateInUS) {
      case "TX":
        return;
      case "NH":
        return;
      default:
        throw new Error(ACCOUNT_STUDENT_REPORT_STATEINUS_FALLTHROUGH);
    }
  }

  const { palette } = useTheme();

  const successBody = poll.result
    ? `Successfully downloading CSV File, Please open your download menu/history to view the 'AccountStudentReport_${date}.csv' File download Progress`
    : "Your request to generate a CSV report is being processed";

  const errorBody = "An Error occurred while trying to export your report to CSV format.";

  return (
    <>
      <ReportsLayout
        title="Account Student Report"
        content={
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              width: "100%",
              "*": { color: palette.getContrastText(palette.primary.main) },
            }}
          >
            <FormControlLabel
              control={<Checkbox onChange={(v) => setIncludeInactive(Boolean(v.target.value))} />}
              label="Include inactive students?"
            />
          </Box>
        }
      >
        <Stack>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              minHeight: "2rem",
              alignItems: "center",
              my: "1rem",
            }}
          >
            <Typography variant="body1">
              {isCollapsed ? "View, print and export the latest account student report." : ""}
            </Typography>

            <ExportToCSVButton
              onClick={handleExportToCsvClick}
              buttonProps={{
                disabled:
                  isCSVDownloading ||
                  poll.mutation.status === "pending" ||
                  poll.mutation.data?.raw.status === 202,
              }}
            />
          </Box>

          <DataGridLoadingLayout
            isLoading={table.rows.length < 1}
            loadingContent={<LoadingResponseMessageTemplate />}
            sizeAnchor="19rem"
          >
            <DataGrid
              columns={table.columns}
              rows={table.rows}
              getRowId={(r) => r.xLogsId}
              {...dataGridPaginationProps}
            />
          </DataGridLoadingLayout>
        </Stack>
      </ReportsLayout>

      <QueryStatusModal
        isOpen={isCSVModalOpen}
        status={poll.mutation.status}
        onSettledClose={handleModalClose}
        content={{ successBody, errorBody }}
      />
    </>
  );
}

interface ReportingPagination {
  dataGridPaginationProps: Partial<DataGridProps>;
}
/**
 * This is housed here temporarily. This will be moved to the /reports/hooks destination once ready.
 *
 * UPDATE: This wasn't the best way to handle pagination. Updated version now exists in `/reports/hooks`.
 */
function useReportingPagination(props: {
  totalRecords: number;
  onPageParametersChange: (v: PageParameters) => void;
}): ReportingPagination {
  return {
    dataGridPaginationProps: {
      onPaginationModelChange: (model) =>
        props.onPageParametersChange({ pageNumber: model.page + 1, pageSize: model.pageSize }),
      pagination: true,
      paginationMode: "server",
      rowCount: props.totalRecords,
    },
  };
}
