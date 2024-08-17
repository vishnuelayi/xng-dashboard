import { Outlet } from "react-router";
import useReportsContext from "../../context/use_reports_context";
import {
  SessionLogsSummaryDataRow,
  V1SessionReportsSessionLogsGetReportPostRequest,
  SessionLogsSortableColumn,
  SessionLogsSortableColumnSortColumn,
  V1SessionReportsSessionLogsGetSummaryPostRequest,
} from "@xng/reporting";
import { useState } from "react";
import SessionLogsContextType from "./context/session_logs_context_type";

const SessionLogsLayout = () => {
  //#region CONTEXT
  const reports_ctx = useReportsContext();
  //#endregion

  //#region STATE HOOKS
  const [selected_students, setSelectedStudents] = useState<SessionLogsSummaryDataRow[]>([]);
  const [get_session_logs_summary_request_body, set_get_session_logs_summary_request_body] =
    useState<V1SessionReportsSessionLogsGetSummaryPostRequest>({
      getSessionLogsSummaryReportPostRequest: {
        filterParameters: {},
      },
    });

  const [get_session_logs_request_body, set_get_session_logs_request_body] =
    useState<V1SessionReportsSessionLogsGetReportPostRequest>({
      getSessionLogsReportPostRequest: {
        dateRun: new Date(),
        reportRunId: "-1",
        pageParameters: {
          pageNumber: 1,
          pageSize: 10,
        },
        sortColumns: new Set<SessionLogsSortableColumnSortColumn>([
          {
            column: SessionLogsSortableColumn.NUMBER_0,
            sortDirection: 0,
          },
        ]),
      },
    });
  //#endregion

  //#region METHODS
  const session_logs_summary_request_body_handler = () => {
    return {
      get_session_logs_summary_request_body,
      set(request_body: V1SessionReportsSessionLogsGetSummaryPostRequest) {
        set_get_session_logs_summary_request_body(request_body);
      },
    };
  };

  const setSelectedStudentsHandler = (selected_students: SessionLogsSummaryDataRow[]) => {
    setSelectedStudents(selected_students);
  };
  const session_logs_request_body_handler = () => {
    return {
      get_session_logs_request_body,
      set(request_body: V1SessionReportsSessionLogsGetReportPostRequest) {
        set_get_session_logs_request_body(request_body);
      },
    };
    // set_get_session_logs_request_body(request_body);
  };
  //#endregion

  const sessionLogsContext: SessionLogsContextType = {
    get_session_logs_request_body,
    get_session_logs_summary_request_body,
    session_logs_request_body_handler,
    session_logs_summary_request_body_handler,
    selected_students,
    setSelectedStudents: setSelectedStudentsHandler,
    ...reports_ctx,
  };
  return <Outlet context={sessionLogsContext} />;
};

export default SessionLogsLayout;
