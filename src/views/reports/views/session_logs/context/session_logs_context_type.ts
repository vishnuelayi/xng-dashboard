import { SessionLogsSummaryDataRow } from "@xng/reporting/dist/models";
import {
  V1SessionReportsSessionLogsGetReportPostRequest,
  V1SessionReportsSessionLogsGetSummaryPostRequest,
} from "@xng/reporting";
import ReportsContextType from "../../../context/reports_context_type";

/**
 * Represents the type definition for the Session Logs Context.
 * This type includes the necessary properties and methods for managing session logs in a reports context.
 */
type SessionLogsContextType = {
  get_session_logs_request_body?: V1SessionReportsSessionLogsGetReportPostRequest;
  get_session_logs_summary_request_body?: V1SessionReportsSessionLogsGetSummaryPostRequest;
  session_logs_summary_request_body_handler?: () => {
    get_session_logs_summary_request_body: V1SessionReportsSessionLogsGetSummaryPostRequest;
    set(request_body: V1SessionReportsSessionLogsGetSummaryPostRequest): void;
  };
  session_logs_request_body_handler?: () => {
    get_session_logs_request_body: V1SessionReportsSessionLogsGetReportPostRequest;
    set(request_body: V1SessionReportsSessionLogsGetReportPostRequest): void;
  };

  selected_students: SessionLogsSummaryDataRow[];
  setSelectedStudents(selected_students: SessionLogsSummaryDataRow[]): void;
} & ReportsContextType;

export default SessionLogsContextType;
