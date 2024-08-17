import React from "react";
import {
  GetSessionLogsReportPostRequest,
  SessionLogsSortableColumn,
  SessionLogsSortableColumnSortColumn,
  V1SessionReportsSessionLogsDownloadCSVPostRequest,
} from "@xng/reporting";
import useFeedbackModal from "../../../../../hooks/use_feedback_modal";
import { getUserTimeZone } from "../../../../../utils/timeZones";
import useApiMutateDownloadSessionLogsCsv from "../../../../../api/hooks/session_reports/use_api_mutate_download_session_logs_csv";
import useSessionLogsContext from "../context/use_session_logs_context";

/**
 * Custom hook for handling CSV download functionality in the service report view.
 *
 * @param feedback_modal - The feedback modal object returned from the useFeedbackModal hook.
 * @returns An object containing the necessary properties and methods for CSV download handling.
 */
const useServiceReportViewPropsDownloadCsv = (
  feedback_modal: ReturnType<typeof useFeedbackModal>,
) => {
  //#region feedback
  const { onFailedSave, onSuccessfulSave } = feedback_modal;
  //#endregion

  //#region context
  const mutate_session_logs_download_csv_api = useApiMutateDownloadSessionLogsCsv();
  //#endregion

  //#region refs
  /**
   * Ref to store the ID of the polling interval for downloading CSV.
   */
  const download_csv_polling_interval_id = React.useRef<NodeJS.Timer>();
  //#endregion

  //#region status
  const download_csv_loading =
    (mutate_session_logs_download_csv_api.status === "pending" ||
      !mutate_session_logs_download_csv_api.data?.type) &&
    !!download_csv_polling_interval_id.current;
  const download_csv_success =
    mutate_session_logs_download_csv_api.status === "success" &&
    !!mutate_session_logs_download_csv_api.data?.type;
  const download_csv_failure = mutate_session_logs_download_csv_api.status === "error";
  //#endregion

  //#region methods
  /**
   * Handles the polling for downloading a CSV file of session logs.
   *
   * @param session_logs_request_body_handler - The handler function for generating the request body for session logs.
   */
  function pollDownloadCSVHandler(
    session_logs_request_body_handler: ReturnType<
      typeof useSessionLogsContext
    >["session_logs_request_body_handler"],
  ) {
    if (download_csv_polling_interval_id.current) {
      clearInterval(download_csv_polling_interval_id.current);
      download_csv_polling_interval_id.current = undefined;
    }
    /* 
    send in a set of sort columns containing the int/enum values 3,4, 14 and 0 in that order. This is to sort by ServiceProviderName, ServiceDate, StartTime and studentLastName, respectively.
    */
    const sort_columns: SessionLogsSortableColumnSortColumn[] = [
      {
        column: SessionLogsSortableColumn.NUMBER_3,
        sortDirection: 0,
      },
      {
        column: SessionLogsSortableColumn.NUMBER_4,
        sortDirection: 0,
      },
      {
        column: SessionLogsSortableColumn.NUMBER_14,
        sortDirection: 0,
      },
      {
        column: SessionLogsSortableColumn.NUMBER_0,
        sortDirection: 0,
      },
    ];
    const reports_req_body: GetSessionLogsReportPostRequest = {
      ...(session_logs_request_body_handler?.().get_session_logs_request_body
        .getSessionLogsReportPostRequest || {}),
      pageParameters: undefined,
      sortColumns: new Set(sort_columns),
    };

    downLoadCSVHandler(reports_req_body);
    const interval_id = setInterval(() => downLoadCSVHandler(reports_req_body), 60000);
    download_csv_polling_interval_id.current = interval_id;
  }

  async function downLoadCSVHandler(reports_req_body: GetSessionLogsReportPostRequest) {
    const timzezone_id = getUserTimeZone();
    const req_body: V1SessionReportsSessionLogsDownloadCSVPostRequest = {
      getSessionLogsCsvPostRequest: {
        ...reports_req_body, //this is to ensure we are sending the same request body as the report
        reportRunDate: reports_req_body.dateRun,
        timeZoneId: timzezone_id,
      },
    };
    await mutate_session_logs_download_csv_api.mutateAsync(req_body);
  }
  //#endregion

  //#region side effects
  React.useEffect(() => {
    return () => {
      //cleanup

      if (download_csv_polling_interval_id.current) {
        clearInterval(download_csv_polling_interval_id.current);
        download_csv_polling_interval_id.current = undefined;
      }
    };
  }, []);

  // handle CSV download and feedback
  React.useEffect(() => {
    let timeout: NodeJS.Timeout | undefined = undefined;
    if (download_csv_success) {
      onSuccessfulSave(
        "Successfully downloading CSV File, Please open your download menu/histoty to view the 'StudentReport.csv' File download Progress",
      );

      //download csv file here
      timeout = setTimeout(() => {
        const data = mutate_session_logs_download_csv_api.data;
        if (data) {
          let url = window.URL.createObjectURL(data);
          let a = document.createElement("a");
          a.href = url;
          a.download = "StudentReport.csv";
          a.click();
        }
      }, 1000);
    } else if (download_csv_failure) {
      onFailedSave("Failed to load CSV File, something went wrong");
    }
    clearInterval(download_csv_polling_interval_id.current);
    download_csv_polling_interval_id.current = undefined;
    return () => {
      if (timeout) clearTimeout(timeout);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [download_csv_failure, download_csv_success]);
  //#endregion

  return {
    mutate_session_logs_download_csv_api,
    download_csv_polling_interval_id,
    download_csv_loading,
    download_csv_success,
    download_csv_failure,
    pollDownloadCSVHandler,
  };
};

export default useServiceReportViewPropsDownloadCsv;
