import { Route, Routes } from "react-router-dom";
import PageNotFound from "./views/404";
import { NavLayout } from "./layouts/NavLayout";
import { ROUTES_XLOGS } from "./constants/URLs";
import StudentManager from "./views/students/manager";
import StudentGroups from "./views/students/groups";
import XLogsCalendar from "./views/calendar/calendar";
import Notator from "./views/notator/notator";
import StudentResponsePage from "./views/students/profile";
import UserProfile from "./views/user/profile";
import ChangelogProvider from "./layouts/changelog_provider";
import AppWideModals from "./design/modal_templates/AppWideModals";
import { NotatorToolsProvider } from "./views/notator/tools";
import { CssBaseline } from "@mui/material";
import { AppInsightsContext } from "@microsoft/applicationinsights-react-js";
import withAppInsights, { reactPlugin } from "./AppInsights/appInsights.js";
import UnpostedSessionsLayout from "./views/unposted_sessions/unposted_sessions_layout";
import UnpostedSessionsView from "./views/unposted_sessions/views/unposted_sessions_view";
import UnpostedSesssionsNotatorView from "./views/unposted_sessions/views/unposted_sesssions_notator_view";
import UnpostedSessionsBatchPostProvider from "./views/unposted_sessions/batch-post/providers/unposted_sessions_batch_post_provider";
import UnpostedSessionsBatchPostView from "./views/unposted_sessions/batch-post/unposted_sessions_batch_post_view";
import UnpostedSessionsContextProvider from "./views/unposted_sessions/provider/unposted_sessions_context_provider";
import UserApproval from "./views/user_management/views/user_approvals/veiws/user_approval";
import UserApprovalsProvider from "./views/user_management/views/user_approvals/context/provider/userApprovalsProvider";
import StaffDirectoryManagerProvider from "./views/user_management/views/staff_directory_manager/context/provider/staff_directory_manager_provider";
import StaffDirectoryManagerLayout from "./views/user_management/views/staff_directory_manager/staff_directory_manager_layout";
import UserManagementLayout from "./views/user_management/user_management_layout";
import UserManagementProvider from "./views/user_management/context/provider/user_management_provider";
import StaffDirectoryManagerHomePage from "./views/user_management/views/staff_directory_manager/views/staff_directory_manager_home_page";
import StaffDirectoryManagerProfilePage from "./views/user_management/views/staff_directory_manager/views/staff_directory_manager_profile_page";
import CampusInformation from "./views/admin/views/campus_info/campus_info";
import MyDistrictProfile from "./views/admin/views/my_district_profile/my_district_profile";
import StaffDirectoryHomePageProvider from "./views/user_management/views/staff_directory_manager/context/provider/staff_directory_home_page_provider";
import BuildInfo from "./views/version";
import { StudentProfileContextProvider } from "./views/students/context/context";
import StaticReportsView from "./views/reports/views/static_reports/static_reports_view";
import ServiceReportView from "./views/reports/views/session_logs/service_report_view";
import SessionLogsView from "./views/reports/views/session_logs/session_logs_view";
import SessionLogsLayout from "./views/reports/views/session_logs/session_logs_layout";
import FortitudeView from "./fortitude/docs";
import { CalendarContextProvider } from "./views/calendar/context/context";
import StudentMerge from "./views/admin/views/student_merge/student_merge";
import ReportsOutlet from "./views/reports/reports_outlet";
import { AccountStudentReport } from "./views/reports/views/account_student_report/account_student_report";
import AdminProtectedRoute from "./AdminProtectedRoute";
import UnpostedSessionsReport from "./views/reports/views/unposted_sessions_summary/unposted_sessions_report";
import { ApiProvider } from "./views/admin/views/my_district_profile/context/apiContext";

function App() {
  // DOM hierarchy
  const path = window.location.pathname.split("/")[1];
  if (path === "") {
    window.location.assign("/xlogs/calendar");
  }

  return (
    <AppInsightsContext.Provider value={reactPlugin}>
      <CssBaseline>
        <ChangelogProvider disabled={true}>
          <NavLayout>
            <Routes>
              {/* XLOGS */}
              {/* <Route path={ROUTES_XLOGS.fortitude + "/*"} element={<FortitudeView />} />
              <Route
                path={ROUTES_XLOGS.calendar}
                element={
                  <CalendarContextProvider>
                    <XLogsCalendar />
                  </CalendarContextProvider>
                }
              />
              <Route
                path={ROUTES_XLOGS.notator + "/:sessionID"}
                element={
                  <NotatorToolsProvider>
                    <Notator />
                  </NotatorToolsProvider>
                }
              />
              <Route path={ROUTES_XLOGS._students.manager} element={<StudentManager />} />
              <Route path={ROUTES_XLOGS._students.groups} element={<StudentGroups />} />
              <Route path={ROUTES_XLOGS.reports.index} element={<ReportsOutlet />}>
                <Route element={<StaticReportsView />} index />
                <Route
                  path={ROUTES_XLOGS.reports.accountStudentReport}
                  element={<AccountStudentReport />}
                />
                <Route path={ROUTES_XLOGS.reports.sessionLogs} element={<SessionLogsLayout />}>
                  <Route index element={<SessionLogsView />} />
                  <Route
                    path={ROUTES_XLOGS.reports.service_report}
                    element={<ServiceReportView />}
                  />
                </Route>
                <Route
                  path={ROUTES_XLOGS.reports.unpostedSessionsReport}
                  element={<UnpostedSessionsReport />}
                />
              </Route>

              <Route
                path={ROUTES_XLOGS._students.profile}
                element={
                  <StudentProfileContextProvider>
                    <StudentResponsePage />
                  </StudentProfileContextProvider>
                }
              />
              <Route path={ROUTES_XLOGS.user} element={<UserProfile />} />
              <Route element={<AdminProtectedRoute />}>
                <Route
                  path={ROUTES_XLOGS._admin.index}
                  element={
                    <UserManagementProvider>
                      <UserManagementLayout />
                    </UserManagementProvider>
                  }
                >
                  <Route
                    index
                    path={ROUTES_XLOGS._admin.userApproval}
                    element={
                      <UserApprovalsProvider>
                        <UserApproval />
                      </UserApprovalsProvider>
                    }
                  />
                  <Route
                    path={ROUTES_XLOGS._admin.staffDirectoryManager}
                    element={
                      <StaffDirectoryManagerProvider>
                        <StaffDirectoryHomePageProvider>
                          <StaffDirectoryManagerLayout />
                        </StaffDirectoryHomePageProvider>
                      </StaffDirectoryManagerProvider>
                    }
                  >
                    <Route index element={<StaffDirectoryManagerHomePage />} />
                    <Route
                      path={ROUTES_XLOGS._admin.staffDirectoryManager + "/:provider_info_id"}
                      element={<StaffDirectoryManagerProfilePage />}
                    />
                  </Route>
                </Route>
              </Route> */}
              <Route element={<AdminProtectedRoute />}>
                <Route
                  path={ROUTES_XLOGS._admin.myDistrictProfile}
                  element={
                    <ApiProvider>
                      <MyDistrictProfile />
                    </ApiProvider>
                  }
                />
                <Route
                  path={ROUTES_XLOGS._admin.campusManagement}
                  element={<CampusInformation />}
                />
                <Route path={ROUTES_XLOGS._admin.studentMerge} element={<StudentMerge />} />
              </Route>
              {/* <Route
                path={ROUTES_XLOGS.unposted_sessions.home}
                element={
                  <UnpostedSessionsContextProvider>
                    <UnpostedSessionsLayout />
                  </UnpostedSessionsContextProvider>
                }
              >
                <Route index element={<UnpostedSessionsView />} />
                <Route
                  path={ROUTES_XLOGS.unposted_sessions.home + "notator/:sessionID"}
                  element={<UnpostedSesssionsNotatorView />}
                >
                  <Route
                    index
                    element={
                      <NotatorToolsProvider>
                        <Notator />
                      </NotatorToolsProvider>
                    }
                  />
                </Route>
              </Route>
              <Route
                path={ROUTES_XLOGS.unposted_sessions.batch_post}
                element={
                  <UnpostedSessionsBatchPostProvider>
                    <UnpostedSessionsBatchPostView />
                  </UnpostedSessionsBatchPostProvider>
                }
              />

              
              <Route path="/xlogs/version" element={<BuildInfo />} />
              
              <Route path="*" element={<PageNotFound />} /> */}
            </Routes>

            <AppWideModals />
          </NavLayout>
        </ChangelogProvider>
      </CssBaseline>
    </AppInsightsContext.Provider>
  );
}
const TrackedApp = withAppInsights(App);

export default TrackedApp;
