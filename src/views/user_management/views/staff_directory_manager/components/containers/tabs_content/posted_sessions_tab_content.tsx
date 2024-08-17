import { Box, Typography } from "@mui/material";
import { Dayjs } from "dayjs";
import { useState } from "react";
import GridSectionLayout from "../../../../../../../design/high-level/common/grid_section_layout";
import QueryStatusModal, {
  QueryStatusModalContentProps,
} from "../../../../../../../design/modal_templates/query_status_modal";
import { getUserTimeZoneByState } from "../../../../../../../utils/timeZones";
import useApiMutatePollSessionCountDownloadCSV from "../../../hooks/api/use_api_mutate_poll_session_count_download_csv";
import useApiMutatePollSessionCountGetReport from "../../../hooks/api/use_api_mutate_poll_session_count_get_report";
import useApiMutateSessionCountQueueReport from "../../../hooks/api/use_api_mutate_session_count_que_report";
import { usePostedSessionsTableColumnDefinition } from "../../../hooks/table/use_posted_sessions_table_column_definition";
import PostedSessionsTabToolbar from "../../presentational/header/posted_sessions_tab_toolbar";
import PostedSessionsTabTable from "../../presentational/tables/posted_sessions_tab_table";
import {
  GC_TIME,
  PAGE_PARAMS_DEFAULT,
} from "../../../data/posted_sessions_tab_content_constant_props";
import downloadFile from "../../../../../../../utils/downloadFile";

type Props = {
  clientId: string;
  stateInUs: string;
  serviceProviderId: string;
};

const PostedSessionsTabContent = (props: Props) => {
  // Context Variables

  // Auxilliary Components states
  const [showQueryStatusModal, setShowQueryStatusModal] = useState(false); //modal to show the status of the session count que query and other related api query status feedback
  const [showCSVQueryStatusModal, setShowCSVQueryStatusModal] = useState(false); //modal to show the status of the session count que query and other related api query status feedback
  const [queryStatusContentMessage, setQueryStatusContentMessage] =
    useState<QueryStatusModalContentProps>({}); //message to show in the modal
  const columnDef = usePostedSessionsTableColumnDefinition();

  // Filter Start and End Date filters
  const [startDateFilter, setStartDateFilter] = useState<Dayjs | null>(null);
  const [endDateFilter, setEndDateFilter] = useState<Dayjs | null>(null);

  //API queries
  // Get Session Count Report
  const {
    mutate: mutateGetSessionCountReport,
    status: sessionCountGetReportStatus,
    data: sessionCountReportData,
  } = useApiMutatePollSessionCountGetReport({
    options: {
      gcTime: GC_TIME,
      onMutate: async () => {
        setQueryStatusContentMessage({
          successTitle: "Thank You!",
          successBody: "Report has been successfully generated",
          errorTitle: "Error!",
          errorBody: "There was an error generating the report. Please try again later",
          pendingTitle: "Generating Report, Please wait...",
        });
      },
    },
  });

  // Que Session Count Report
  const {
    mutate: mutateQueueReport,
    status: sessionCountQueueReportStatus,
    data: queueReportData,
  } = useApiMutateSessionCountQueueReport({
    options: {
      gcTime: GC_TIME,
      onMutate: async () => {
        setQueryStatusContentMessage({
          successTitle: "Thank You!",
          successBody: "Your request has been submitted successfully.",
          errorTitle: "Error!",
          errorBody: "There was an error submitting your request. Please try again later.",
          pendingTitle: "Queueing Session Count, Please wait...",
        });
        setShowQueryStatusModal(true);
      },
      onSuccess(data) {
        mutateGetSessionCountReport({
          getSessionCountReportPostRequest: {
            reportRunDate: data.reportRunDate,
            reportRunId: data.reportRunId,
            ...PAGE_PARAMS_DEFAULT,
          },
        });
      },
    },
  });

  // Download CSV
  const {
    mutate: mutateDownloadCSV,
    isPending: downloadCSVPending,
    status: downloadingCSVStatus,
  } = useApiMutatePollSessionCountDownloadCSV({
    options: {
      onSuccess(data) {
        downloadFile(data, "SessionCountCSV.csv");
        setShowCSVQueryStatusModal(true);
      },
      onError() {
        setShowCSVQueryStatusModal(true);
      },
    },
  });

  return (
    <Box mb={30}>
      <GridSectionLayout
        headerConfig={{
          title: "Posted Sessions",
        }}
        rows={[
          {
            fullwidth: true,
            cells: [
              <PostedSessionsTabToolbar
                filters={{
                  startDate: startDateFilter,
                  endDate: endDateFilter,
                  onSetStartDate: function (d: Dayjs): void {
                    setStartDateFilter(d);
                  },
                  onSetEndDate: function (d: Dayjs): void {
                    setEndDateFilter(d);
                  },
                }}
                useDownloadCSV={{
                  isDownloading: downloadCSVPending,
                  canDownload: !!queueReportData,
                  onDownloadCSV: async () => {
                    let timzoneID = getUserTimeZoneByState(props.stateInUs);
                    mutateDownloadCSV({
                      getSessionCountReportCsvPostRequest: {
                        reportRunDate: queueReportData?.reportRunDate,
                        reportRunId: queueReportData?.reportRunId,
                        // TODO: TECH DEBT: Currently, our system determines a user’s timezone based on their state and district location.
                        // However, we don’t have a solution or architecture in place to accurately determine this information, especially for users in Texas,
                        // which spans more than one timezone. As a workaround, we’re using the timezone of the user’s current location as a placeholder.
                        // In our current implementation, we assign the Eastern Timezone to users in New Hampshire.
                        // For users in Texas, we determine the timezone based on their specific location.
                        timeZoneId: timzoneID,
                      },
                    });
                  },
                }}
                onApplyFilters={() => {
                  mutateQueueReport({
                    queueSessionCountReportPostRequest: {
                      reportFilters: {
                        clientId: props.clientId,
                        serviceProviderId: props.serviceProviderId,
                        startDate: startDateFilter?.toDate(),
                        endDate: endDateFilter?.toDate(),
                      },
                      ...PAGE_PARAMS_DEFAULT,
                    },
                  });
                }}
              />,
            ],
          },
          {
            fullwidth: true,
            cells: [
              <>
                {!sessionCountReportData?.pageRecords ? (
                  <Typography fontWeight={700} fontSize={"1rem"}>
                    To see Posted Session data, please apply filters first.
                  </Typography>
                ) : (
                  <PostedSessionsTabTable
                    rows={sessionCountReportData?.pageRecords ?? []}
                    columnDef={columnDef}
                  />
                )}
              </>,
            ],
          },
        ]}
      />
      {/* AUXILIARY COMPONENTS */}
      <>
        <QueryStatusModal
          isOpen={showQueryStatusModal}
          status={
            sessionCountGetReportStatus !== "idle"
              ? sessionCountGetReportStatus
              : sessionCountQueueReportStatus
          }
          onSettledClose={() => setShowQueryStatusModal(false)}
          content={queryStatusContentMessage}
        />
        <QueryStatusModal
          isOpen={showCSVQueryStatusModal}
          status={downloadingCSVStatus}
          onSettledClose={() => setShowCSVQueryStatusModal(false)}
          content={{
            errorTitle: "Error!",
            errorBody: "There was an error downloading the CSV file. Please try again later.",
            successTitle: "Thank You!",
            successBody:
              "Successfully downloading CSV File, Please open your download menu/history to view the 'SessionCountCSV.csv' File download Progress",
          }}
        />
      </>
    </Box>
  );
};

export default PostedSessionsTabContent;
