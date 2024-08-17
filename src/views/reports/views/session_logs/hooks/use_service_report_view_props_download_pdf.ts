import React from "react";
import {
  GetSessionLogsReportPostRequest,
  V1SessionReportsSessionLogsDownloadPDFPostRequest,
} from "@xng/reporting";
import useFeedbackModal from "../../../../../hooks/use_feedback_modal";
import { getUserTimeZone } from "../../../../../utils/timeZones";
import useApiMutateDownloadSessionLogsPdf from "../../../../../api/hooks/session_reports/use_api_mutate_download_session_logs_pdf";
import useSessionLogsContext from "../context/use_session_logs_context";

const useServiceReportViewPropsDownloadPdf = (
  feedback_modal: ReturnType<typeof useFeedbackModal>,
) => {
  // feedback
  const { onFailedSave, onSuccessfulSave } = feedback_modal;

  // context
  const mutate_session_logs_download_pdf_api = useApiMutateDownloadSessionLogsPdf();

  // refs
  const download_pdf_polling_interval_id = React.useRef<NodeJS.Timer>();

  // status
  const download_pdf_loading =
    (mutate_session_logs_download_pdf_api.status === "pending" ||
      !mutate_session_logs_download_pdf_api.data?.type) &&
    !!download_pdf_polling_interval_id.current;
  const download_pdf_success =
    mutate_session_logs_download_pdf_api.status === "success" &&
    !!mutate_session_logs_download_pdf_api.data?.type;
  const download_pdf_failure = mutate_session_logs_download_pdf_api.status === "error";

  // methods
  function pollDownloadPDFHandler(
    session_logs_request_body_handler: ReturnType<
      typeof useSessionLogsContext
    >["session_logs_request_body_handler"],
  ) {
    if (download_pdf_polling_interval_id.current) {
      clearInterval(download_pdf_polling_interval_id.current);
      download_pdf_polling_interval_id.current = undefined;
    }
    const reports_req_body: GetSessionLogsReportPostRequest = {
      ...(session_logs_request_body_handler?.().get_session_logs_request_body
        .getSessionLogsReportPostRequest || {}),
      pageParameters: undefined,
    };

    downLoadPDFHandler(reports_req_body);
    const interval_id = setInterval(() => downLoadPDFHandler(reports_req_body), 60000);
    download_pdf_polling_interval_id.current = interval_id;
  }

  async function downLoadPDFHandler(reports_req_body: GetSessionLogsReportPostRequest) {
    const timzezone_id = getUserTimeZone();
    const req_body: V1SessionReportsSessionLogsDownloadPDFPostRequest = {
      getSessionLogsPdfPostRequest: {
        ...reports_req_body, //this is to ensure we are sending the same request body as the report
        reportRunDate: reports_req_body.dateRun,
        timeZoneId: timzezone_id,
      },
    };
    await mutate_session_logs_download_pdf_api.mutateAsync(req_body);
  }

  //side effects

  React.useEffect(() => {
    return () => {
      //cleanup
      if (download_pdf_polling_interval_id.current) {
        clearInterval(download_pdf_polling_interval_id.current);
        download_pdf_polling_interval_id.current = undefined;
      }
    };
  }, []);

  // download pdf file Feedback and download
  React.useEffect(() => {
    let timeout: NodeJS.Timeout | undefined = undefined;
    if (download_pdf_success) {
      onSuccessfulSave(
        "Successfully downloading PDF File, Please open your download menu/history to view the 'StudentReport.pdf' File download Progress",
      );

      //download csv file here
      timeout = setTimeout(() => {
        const data = mutate_session_logs_download_pdf_api.data;
        if (data) {
          let url = window.URL.createObjectURL(data);
          let a = document.createElement("a");
          a.href = url;
          a.download = "StudentReport.pdf";
          a.click();
        }
      }, 1000);
    } else if (download_pdf_failure) {
      onFailedSave("Failed to load CSV File, something went wrong");
    }
    clearInterval(download_pdf_polling_interval_id.current);
    download_pdf_polling_interval_id.current = undefined;
    return () => {
      if (timeout) clearTimeout(timeout);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [download_pdf_success, download_pdf_failure]);
  return {
    mutate_session_logs_download_pdf_api,
    download_pdf_polling_interval_id,
    download_pdf_loading,
    download_pdf_success,
    download_pdf_failure,
    pollDownloadPDFHandler,
  };
};

export default useServiceReportViewPropsDownloadPdf;
