// import { GetSessionLogsSummaryReportPostRequest, SessionLogsSummarySortableColumnSortColumn, SessionStatus } from "@xng/reporting";
import { GetSessionLogsSummaryReportPostRequest, SessionLogsSummarySortableColumnSortColumn, SessionStatus } from "@xng/reporting";
import { API_SESSION_LOGS, API_DUPLICATE_STUDENT_REPORTS, REPORTING_HEADERS } from "../api/api";

export async function demoSessionLogsSummary() {
    // Reporting headers will need to be set in order to make the request to the reporting API.
    REPORTING_HEADERS.State = "TX";
    const request: GetSessionLogsSummaryReportPostRequest = {
      filterParameters: {
        clientId: "d06c2299-91b9-4904-8b23-9e7e86645720",
        startDate: new Date("2023-08-27"),
        endDate: new Date("2024-01-01"),
        sessionStatuses: new Set<SessionStatus>([4, 5]),
        serviceProviderIds: new Set([
          "happlegate@alpineisd.netTX588COOP",
          "lcrim@alpineisd.netTX588COOP"
        ])
      },
      sortColumns: new Set<SessionLogsSummarySortableColumnSortColumn>(
        [
          {
            columnName: 3,
            sortDirection: 0
          } as SessionLogsSummarySortableColumnSortColumn
        ]
      )
    }
    const report = await API_SESSION_LOGS.v1SessionReportsSessionLogsGetSummaryPost({
      getSessionLogsSummaryReportPostRequest: request
    });
    console.log("Session Logs Summary Report:", report);
  }

export async function demoLikelyDuplicateStudents() {
    REPORTING_HEADERS.State = "TX";
    
    const report = await API_DUPLICATE_STUDENT_REPORTS.v1StudentReportsDuplicateStudentReportsGet({
      clientId: "d06c2299-91b9-4904-8b23-9e7e86645720",
      maxRecords: 50,
    });
}