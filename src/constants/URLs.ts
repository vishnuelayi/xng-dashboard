export const ROOTNAME_XLOGS = "xlogs";

const TAB_STUDENTS = "students";
const TAB_ADMIN = "admin";
const TAB_REPORTS = "reports";

export const ROUTES_XLOGS = {
  fortitude: `/${ROOTNAME_XLOGS}/fortitude`,
  notator: `/${ROOTNAME_XLOGS}/notator`,
  summary: `/${ROOTNAME_XLOGS}/summary`,
  calendar: `/${ROOTNAME_XLOGS}/calendar`,
  students: `/${ROOTNAME_XLOGS}/${TAB_STUDENTS}`,
  _students: {
    manager: `/${ROOTNAME_XLOGS}/${TAB_STUDENTS}/manager`,
    groups: `/${ROOTNAME_XLOGS}/${TAB_STUDENTS}/groups`,
    profile: `/${ROOTNAME_XLOGS}/${TAB_STUDENTS}/manager/:studentID`,
  },
  reports: {
    index: `/${ROOTNAME_XLOGS}/${TAB_REPORTS}`,
    sessionLogs: `/${ROOTNAME_XLOGS}/${TAB_REPORTS}/session-logs`,
    service_report: `/${ROOTNAME_XLOGS}/${TAB_REPORTS}/session-logs/service-report`,
    accountStudentReport: `/${ROOTNAME_XLOGS}/${TAB_REPORTS}/account-student-report`,
    unpostedSessionsReport: `/${ROOTNAME_XLOGS}/${TAB_REPORTS}/unposted-sessions-report`,
  },
  analytics: `/${ROOTNAME_XLOGS}/analytics`,
  admin: `/${ROOTNAME_XLOGS}/${TAB_ADMIN}`,
  user: `/${ROOTNAME_XLOGS}/my-profile`,
  _admin: {
    index: `/${ROOTNAME_XLOGS}/${TAB_ADMIN}`,
    userApproval: `/${ROOTNAME_XLOGS}/${TAB_ADMIN}/user-approval`,
    staffDirectoryManager: `/${ROOTNAME_XLOGS}/${TAB_ADMIN}/staff-directory-manager`,
    campusManagement: `/${ROOTNAME_XLOGS}/${TAB_ADMIN}/campus-management`,
    studentMerge: `/${ROOTNAME_XLOGS}/${TAB_ADMIN}/student-merge`,
    myDistrictProfile: `/${ROOTNAME_XLOGS}/${TAB_ADMIN}/my-district-profile`,
  },
  unposted_sessions: {
    home: `/${ROOTNAME_XLOGS}/unposted-sessions`,
    notator: `/${ROOTNAME_XLOGS}/unposted-sessions/notator`,
    batch_post: `/${ROOTNAME_XLOGS}/unposted-sessions/batch-post`,
  },
};
