import React from "react";
import GridSectionLayout from "../../../../design/high-level/common/grid_section_layout";
import { Box, Button, Skeleton, Typography } from "@mui/material";
import XNGSmartTable from "../../../../design/high-level/common/xng_smart_table";
import { useNavigate } from "react-router";
import { ROUTES_XLOGS } from "../../../../constants/URLs";
import FullPageLoadingScreen from "../../../../design/high-level/common/full_page_loading_screen";
import useFeedbackModal from "../../../../hooks/use_feedback_modal";
import { SessionLogsSortableColumn, SessionLogsSortableColumnSortColumn } from "@xng/reporting";
import produce from "immer";
import {
  GetSessionLogsSortableColumnEnumFromString,
  GetSessionLogsSortableColumnStringFromEnum,
} from "../../utils/xlogs_session_logs_sortable_columns_mapper";
import dayjs from "dayjs";
import REPORTS_VIEWS_HEADER_TITLE from "../../constants/reports_views_header_title";
import { MSBICONS } from "../../../../fortitude";
import { getUserTimeZone } from "../../../../utils/timeZones";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import ReportsLayout from "../../reports_layout";
import useServiceReportViewPropsSessionLogsReport from "./hooks/use_service_report_view_props_session_logs_report";
import useServiceReportViewPropsDownloadCsv from "./hooks/use_service_report_view_props_download_csv";
import useServiceReportViewPropsDownloadPdf from "./hooks/use_service_report_view_props_download_pdf";
dayjs.extend(utc);
dayjs.extend(timezone);

const ServiceReportView = () => {
  //#region REACT ROUTER DOM
  const navigate = useNavigate();
  //#endregion

  //#region FEEDBACK HOOKS
  const feedback_modal = useFeedbackModal();
  //#endregion

  //#region CUSTOM HOOKS
  // Custom hooks for handling session logs report data and polling
  const {
    mutate_get_session_logs_api,
    report_feedback_loading,
    report_loading,
    pollSessionLogsReportHandler,
    session_logs_request_body_handler,
  } = useServiceReportViewPropsSessionLogsReport(feedback_modal);

  // Custom hooks for handling CSV download and polling
  const { download_csv_loading, pollDownloadCSVHandler } =
    useServiceReportViewPropsDownloadCsv(feedback_modal);

  // Custom hooks for handling PDF download and polling
  const { download_pdf_loading, pollDownloadPDFHandler } =
    useServiceReportViewPropsDownloadPdf(feedback_modal);
  //#endregion

  //#region METHODS
  function backToSessionLogsHandler() {
    navigate(ROUTES_XLOGS.reports.sessionLogs + REPORTS_VIEWS_HEADER_TITLE.sessionLogs);
  }
  //#endregion

  //#region SIDE EFFECTS
  // On Mount
  React.useEffect(() => {
    // poll for report every 60 seconds
    if (
      session_logs_request_body_handler?.().get_session_logs_request_body
        .getSessionLogsReportPostRequest?.reportRunId === "-1"
    ) {
      navigate(ROUTES_XLOGS.reports.sessionLogs + REPORTS_VIEWS_HEADER_TITLE.sessionLogs);
    } else {
      pollSessionLogsReportHandler();
    }
  }, []);

  //#endregion

  //#region UTILS
  const renderObservationsActivitiesAccommodationsModifications = (cell: string) => {
    const split_string = cell.split(/,(?![^()]*\))/);

    return split_string.map((item, index) => {
      return (
        <Typography key={index} fontSize={"10.5px"}>
          {item}
        </Typography>
      );
    });
  };

  const getTimeZoneTime = (time: string | null | undefined) => {
    const timZoneId = getUserTimeZone();
    let utcTime = time;
    let format = "h:mm A";
    return dayjs.utc(utcTime, format).tz(timZoneId).format(format);
  };
  //#endregion

  return (
    <ReportsLayout title="Service Report" gutterTop>
      <GridSectionLayout
        headerConfig={{
          title: "Report",
          title_sx: {
            fontWeight: 700,
          },
          headerContent: (
            <Box
              sx={{
                display: "flex",
                gap: 2,
                alignItems: "center",
                justifyContent: {
                  xs: "center",
                  md: "space-between",
                },
                flexDirection: {
                  xs: "column",
                  md: "row",
                },
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  gap: 3,
                  justifyContent: "center",
                  flexGrow: 1,
                  flexDirection: {
                    xs: "column",
                    sm: "row",
                  },
                }}
              >
                {!report_feedback_loading ? (
                  <Typography>
                    Sessions Total:{" "}
                    <strong>{mutate_get_session_logs_api.data?.totalRecords}</strong>{" "}
                  </Typography>
                ) : (
                  <Skeleton variant="text" width={100} height={25} />
                )}

                {!report_feedback_loading ? (
                  <Typography>
                    Schedule Duration Hrs:{" "}
                    <strong>
                      {mutate_get_session_logs_api.data?.totalScheduledDurationHours?.toFixed(2)}
                    </strong>
                  </Typography>
                ) : (
                  <Skeleton variant="text" width={150} height={25} />
                )}

                {!report_feedback_loading ? (
                  <Typography>
                    Time Away:{" "}
                    <strong>
                      {mutate_get_session_logs_api.data?.totalTimeAwayHours?.toFixed(2)}
                    </strong>
                  </Typography>
                ) : (
                  <Skeleton variant="text" width={100} height={25} />
                )}

                {!report_feedback_loading ? (
                  <Typography>
                    Net Duration:{" "}
                    <strong>
                      {mutate_get_session_logs_api.data?.totalNetDurationHours?.toFixed(2)}
                    </strong>
                  </Typography>
                ) : (
                  <Skeleton variant="text" width={100} height={25} />
                )}
              </Box>
              <Box display={"flex"} flexDirection={"row"} gap={2} whiteSpace={"nowrap"}>
                <Button
                  disabled={download_pdf_loading}
                  variant="outlined"
                  startIcon={
                    download_pdf_loading ? <MSBICONS.LoadingAnimation /> : <MSBICONS.Print />
                  }
                  onClick={() => pollDownloadPDFHandler(session_logs_request_body_handler)}
                >
                  {download_pdf_loading ? "Loading PDF File..." : "Print PDF"}
                </Button>
                <Button
                  disabled={download_csv_loading}
                  variant="outlined"
                  startIcon={
                    download_csv_loading ? <MSBICONS.LoadingAnimation /> : <MSBICONS.CSV />
                  }
                  onClick={() => pollDownloadCSVHandler(session_logs_request_body_handler)}
                >
                  {download_csv_loading ? "Loading CSV File..." : "Export to CSV"}
                </Button>
              </Box>
            </Box>
          ),
        }}
        rows={[
          {
            fullwidth: true,
            cells: [
              <XNGSmartTable
                key={0}
                columnsConfig={{
                  columns: [
                    {
                      key: "studentLastName",
                      headerName: "Last Name",
                    },
                    {
                      key: "studentFirstName",
                      headerName: "First Name",
                    },
                    {
                      key: "studentId",
                      headerName: "Student ID",
                      width: 150,
                      noWrap: true,
                      useTooltip: {},
                    },
                    {
                      key: "serviceProviderName",
                      headerName: "Service Provider",
                    },
                    {
                      key: "serviceDate",
                      headerName: "Service Date",
                    },
                    {
                      key: "sessionStatus",
                      headerName: "Session Status",
                    },
                    {
                      key: "service",
                      headerName: "Service Type",
                      minWidth: 150,
                    },
                    {
                      key: "groupSize",
                      headerName: "Group Size",
                    },
                    {
                      key: "sessionNarrative",
                      headerName: "Narrative",
                    },
                    {
                      key: "studentNarrative",
                      headerName: "Student Narrative",
                    },
                    {
                      key: "scheduledDuration",
                      headerName: "Scheduled Duration",
                    },
                    {
                      key: "timeAway",
                      headerName: "Time Away",
                    },
                    {
                      key: "netDuration",
                      headerName: "Duration",
                    },
                    {
                      key: "startTime",
                      headerName: "Start Time",
                      useOverride: {
                        overrideCell(row) {
                          return getTimeZoneTime(row?.startTime);
                        },
                      },
                    },
                    {
                      key: "endTime",
                      headerName: "End Time",
                      useOverride: {
                        overrideCell(row) {
                          return getTimeZoneTime(row?.endTime);
                        },
                      },
                    },
                    {
                      key: "location",
                      headerName: "Location",
                    },
                    {
                      key: "districtOfLiability",
                      headerName: "District of Liability",
                    },
                    {
                      key: "school",
                      headerName: "School",
                      minWidth: 250,
                    },
                    {
                      key: "present",
                      headerName: "Present",
                    },
                    {
                      key: "makeup",
                      headerName: "Makeup",
                    },
                    {
                      key: "submittedDate",
                      headerName: "Submitted Date",
                      convertToExpectedType(value) {
                        return dayjs(value.submittedDate).unix();
                      },
                    },
                    {
                      key: "postedDate",
                      headerName: "Posted Date",
                      convertToExpectedType(value) {
                        return dayjs(value.postedDate).unix();
                      },
                    },
                    {
                      key: "studentObservations",
                      headerName: "Student Observations",
                      disableSort: true,
                      width: 100,
                      noWrap: true,
                      useTooltip: {
                        overrideTitle: (cell) =>
                          renderObservationsActivitiesAccommodationsModifications(cell as string),
                      },
                    },
                    {
                      key: "observations",
                      disableSort: true,
                      headerName: "Observations",
                      minWidth: "200px",
                      useOverride: {
                        overrideCell(row) {
                          return row.observations && row.observations.length > 0
                            ? "View Observations"
                            : undefined;
                        },
                        useNestedTable(row) {
                          const cell_data = row?.observations;

                          return {
                            title: `${row?.studentFirstName} ${row?.studentLastName}'s Observations`,
                            expandOnCellClick: true,
                            columns: [
                              {
                                key: "refNumber",
                                headerName: "Ref Number",
                              },
                              {
                                key: "description",
                                headerName: "Description",
                              },
                              {
                                key: "observation",
                                headerName: "Observation",
                                // minWidth: 200,
                              },
                              {
                                key: "narrative",
                                headerName: "Narrative",
                              },
                            ],
                            rows: cell_data,
                          };
                        },
                      },
                    },
                    {
                      key: "activities",
                      headerName: "Activities",
                      disableSort: true,
                      width: 100,
                      noWrap: true,
                      useTooltip: {
                        overrideTitle: (cell) =>
                          renderObservationsActivitiesAccommodationsModifications(cell as string),
                      },
                    },
                    {
                      key: "accommodations",
                      headerName: "Accommodations",
                      disableSort: true,
                      width: 100,
                      noWrap: true,
                      useTooltip: {
                        overrideTitle: (cell) =>
                          renderObservationsActivitiesAccommodationsModifications(cell as string),
                      },
                    },
                    {
                      key: "modifications",
                      headerName: "Modifications",
                      disableSort: true,
                      width: 100,
                      noWrap: true,
                      useTooltip: {
                        overrideTitle: (cell) =>
                          renderObservationsActivitiesAccommodationsModifications(cell as string),
                      },
                    },
                  ],
                }}
                rowsConfig={{
                  rowHoverColor: "contrasts.1",
                  rows: mutate_get_session_logs_api.data?.pageRecords ?? undefined,
                }}
                usePagination={{
                  useControl: {
                    currentPage: mutate_get_session_logs_api.data?.pageNumber ?? 1,
                    itemsPerPage: mutate_get_session_logs_api.data?.pageSize ?? 10,
                    totalItems: mutate_get_session_logs_api.data?.totalRecords ?? 0,
                    totalPages: mutate_get_session_logs_api.data?.totalPages ?? 1, //Math.ceil((mutate_get_session_logs_api.data?.totalRecords || 0)/(mutate_get_session_logs_api.data?.pageSize || 1)) || 1,
                    onSetCurrentPage(pageNumber) {
                      const new_request_body = produce(
                        session_logs_request_body_handler?.().get_session_logs_request_body ?? {},
                        (draft: any) => {
                          draft.getSessionLogsReportPostRequest!.pageParameters!.pageNumber =
                            pageNumber;
                        },
                      );
                      session_logs_request_body_handler?.().set(new_request_body);
                      mutate_get_session_logs_api.mutate(new_request_body as any);
                    },
                    onSetItemsPerPage(itemsPerPage) {
                      const new_request_body = produce(
                        session_logs_request_body_handler?.().get_session_logs_request_body ?? {},
                        (draft: any) => {
                          draft.getSessionLogsReportPostRequest!.pageParameters!.pageSize =
                            itemsPerPage;
                        },
                      );
                      session_logs_request_body_handler?.().set(new_request_body);
                      mutate_get_session_logs_api.mutate(new_request_body as any);
                    },
                  },
                }}
                useSort={{
                  useControlled: {
                    keyValue:
                      (session_logs_request_body_handler &&
                        GetSessionLogsSortableColumnStringFromEnum(
                          session_logs_request_body_handler()
                            .get_session_logs_request_body?.getSessionLogsReportPostRequest?.sortColumns?.values()
                            .next().value.column,
                        )) ??
                      GetSessionLogsSortableColumnStringFromEnum(
                        SessionLogsSortableColumn.NUMBER_0,
                      ),
                    onChange(columnKey, direction) {
                      const new_request_body = produce(
                        session_logs_request_body_handler?.().get_session_logs_request_body || {},
                        (draft: any) => {
                          draft.getSessionLogsReportPostRequest!.sortColumns =
                            new Set<SessionLogsSortableColumnSortColumn>([
                              {
                                column: GetSessionLogsSortableColumnEnumFromString(columnKey),
                                sortDirection: direction === "asc" ? 0 : 1,
                              },
                            ]);
                        },
                      );
                      session_logs_request_body_handler?.().set(new_request_body);
                      mutate_get_session_logs_api.mutate(new_request_body as any);
                    },
                  },
                }}
                useTableLoading={{
                  isloading: report_loading,
                  disableInteractivity: true,
                  showSkeleton: false,
                }}
              />,
            ],
          },
          {
            fullwidth: true,
            rowSx: {
              marginTop: "1rem",
              marginBottom: "3rem",
            },
            useCellStyling: {
              sx: {
                display: "flex",
                justifyContent: "flex-end",
              },
            },
            cells: [
              <Button
                key={0}
                disabled={report_loading}
                sx={{
                  padding: "1.5rem 2rem",
                }}
                onClick={backToSessionLogsHandler}
              >
                Back to Session Logs
              </Button>,
            ],
          },
        ]}
      />
      {report_feedback_loading && (
        <FullPageLoadingScreen text={"Please wait, Generating Report"} pulse />
      )}
    </ReportsLayout>
  );
};

export default ServiceReportView;
