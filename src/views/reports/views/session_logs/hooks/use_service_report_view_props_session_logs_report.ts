import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import useFeedbackModal from "../../../../../hooks/use_feedback_modal";
import { ROUTES_XLOGS } from "../../../../../constants/URLs";
import REPORTS_VIEWS_HEADER_TITLE from "../../../constants/reports_views_header_title";
import useApiMutateGetSessionLogs from "../../../../../api/hooks/session_reports/use_api_mutate_get_session_logs";
import useSessionLogsContext from "../context/use_session_logs_context";

/* 
    This hook contains all of the session logs report related props that are passed down to the service report view
*/
const useServiceReportViewPropsSessionLogsReport = (
  feedback_modal: ReturnType<typeof useFeedbackModal>,
) => {
  // react-router-dom
  const navigate = useNavigate();

  // feedback
  const { onFailedSave, onSuccessfulSave } = feedback_modal;

  // react-router-dom
  const getReportLocationStatus: "loading" | "loaded" | undefined = useLocation().state?.status;

  // context
  const session_logs_request_body_handler =
    useSessionLogsContext().session_logs_request_body_handler;

  // api hooks
  const mutate_get_session_logs_api = useApiMutateGetSessionLogs({
    options: {
      onSuccess: (data) => {
        if (getReportLocationStatus !== "loaded" && !data.pageRecords) return;
        onSuccessfulSave("Report Generated Successfully");
        navigate(ROUTES_XLOGS.reports.service_report + REPORTS_VIEWS_HEADER_TITLE.serviceReport, {
          state: { status: "loaded" },
          replace: true,
        });
      },
      onError: () => {
        // console.log("error report")
        // if (location_status_get_report !== "loaded") return;
        onFailedSave("Report Generation Failed");
        navigate(ROUTES_XLOGS.reports.service_report + REPORTS_VIEWS_HEADER_TITLE.serviceReport, {
          state: { status: "loaded" },
        });
      },
    },
  });

  // refs
  const reports_polling_interval_id = React.useRef<NodeJS.Timer>();

  // status
  const report_loading =
    mutate_get_session_logs_api.status === "pending" ||
    !mutate_get_session_logs_api.data?.pageRecords;
  const report_success =
    mutate_get_session_logs_api.status === "success" &&
    !!mutate_get_session_logs_api.data?.pageRecords;
  const report_failure = mutate_get_session_logs_api.status === "error";
  const report_feedback_loading = report_loading && getReportLocationStatus === "loading";

  // methods
  function pollSessionLogsReportHandler() {
    if (reports_polling_interval_id.current) {
      clearInterval(reports_polling_interval_id.current);
      reports_polling_interval_id.current = undefined;
    }
    getSessionLogsReportHandler();
    const interval_id = setInterval(getSessionLogsReportHandler, 60000);
    reports_polling_interval_id.current = interval_id;
  }

  async function getSessionLogsReportHandler() {
    await mutate_get_session_logs_api.mutateAsync(
      session_logs_request_body_handler?.().get_session_logs_request_body || {},
    );
  }
  React.useEffect(() => {
    return () => {
      //cleanup
      if (reports_polling_interval_id.current) {
        clearInterval(reports_polling_interval_id.current);
        reports_polling_interval_id.current = undefined;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // handle clear interval upon data retreival
  React.useEffect(() => {
    if (report_success && reports_polling_interval_id.current) {
      clearInterval(reports_polling_interval_id.current!);
      reports_polling_interval_id.current = undefined;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [report_success]);

  // React.useEffect(() => {
  //   // if(initial_report_generated) return;
  //   if (location_status_get_report === "loaded") return;
  //   if (report_success) {
  //     onSuccessfulSave("Report Generated Successfully");
  //   }
  //   if (report_failure) {
  //     onFailedSave("Report Generation Failed");
  //   }

  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [report_success, report_failure]);

  // // strictly for setting the status of the report generation, this helps handle our feedback triggers to avoid being displayed during operations like pagination and sorting
  // React.useEffect(() => {
  //   if (report_success || mutate_get_session_logs_api.status === XNGApiRequestStatus.FAILURE) {
  //     navigate(ROUTES_XLOGS.reports.service_report + REPORTS_VIEWS_HEADER_TITLE.serviceReport, {
  //       state: { status: "loaded" },
  //     });
  //   }

  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [mutate_get_session_logs_api.status]);

  return {
    location_status_get_report: getReportLocationStatus,
    report_loading,
    reports_polling_interval_id,
    report_success,
    report_failure,
    report_feedback_loading,
    mutate_get_session_logs_api,
    session_logs_request_body_handler,
    pollSessionLogsReportHandler,
  };
};

export default useServiceReportViewPropsSessionLogsReport;
