/**
 * Prefix used for the header title in the reports views.
 */
const prefix = "?header-title=";

/**
 * Object containing the header titles for different reports views.
 */
const REPORTS_VIEWS_HEADER_TITLE = {
  staticReports: prefix + "Static Reports",
  sessionLogs: prefix + "Session Logs",
  accountStudentReport: prefix + "Account Student Report",
  serviceReport: prefix + "Student Service Report",
};

export default REPORTS_VIEWS_HEADER_TITLE;
