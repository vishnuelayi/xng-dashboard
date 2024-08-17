import { useXNGSelector } from "../../../../context/store";
import { useMemo } from "react";
import { ROUTES_XLOGS } from "../../../../constants/URLs";
import { BiPieChartAlt } from "react-icons/bi";
import { XNGICONS } from "../../../../design";
import REPORTS_VIEWS_HEADER_TITLE from "../../constants/reports_views_header_title";
import { XLogsRoleStrings } from "../../../../context/types/xlogsrole";
import { MSBICONS } from "../../../../fortitude";
import { StaticReportsButton } from "./static_report_button";
import { useNavigate } from "react-router";
import { hasCommonItem } from "../../../../utils/has_common_item";
import useUserRoles from "../../../../hooks/use_user_roles";

/**
 * This type represents each button on the static report screen and determines aesthetic,
 * navigation behavior, and role-based visibility.
 */
type ReportButton = {
  label: string;
  icon: JSX.Element;
  navTo: string;
  /**
   * NOTE: Leaving this blank will be interpreted as all roles.
   */
  allowedRoles: XLogsRoleStrings[];
};

function useStaticReportsButtons() {
  const userRoles = useUserRoles();
  const navigate = useNavigate();

  const isAccountStudentReportActive = useXNGSelector(
    (state) => state.featureFlags.flags["AccountStudentReportActive"],
  );
  const isUnpostedSessionsReportActive = useXNGSelector(
    (state) => state.featureFlags.flags["UnpostedSessionsReportActive"],
  );

  const buttonData: ReportButton[] = useMemo(
    () =>
      [
        isAccountStudentReportActive && {
          label: "Account Student Report",
          icon: <BiPieChartAlt />,
          navTo: ROUTES_XLOGS.reports.accountStudentReport,
          allowedRoles: ["Delegated Admin", "Executive Admin"],
        },
        {
          label: "Session Logs",
          // TODO: Make this use an MSBICONS icon
          icon: <XNGICONS.DocumentList />,
          // TODO: Make this use a single route reference
          navTo: `${ROUTES_XLOGS.reports.sessionLogs}${REPORTS_VIEWS_HEADER_TITLE.sessionLogs}`,
          allowedRoles: [],
        },
        isUnpostedSessionsReportActive && {
          label: "Unposted Sessions Report",
          icon: <MSBICONS.Copy />,
          navTo: ROUTES_XLOGS.reports.unpostedSessionsReport,
          allowedRoles: ["Approver", "Delegated Admin", "Executive Admin"],
        },
      ].filter(Boolean) as ReportButton[],
    [isAccountStudentReportActive, isUnpostedSessionsReportActive],
  );

  const buttonElements = useMemo(() => {
    return buttonData
      .map((btn, i) => {
        if (hasCommonItem(btn.allowedRoles, userRoles) || btn.allowedRoles.length === 0) {
          return (
            <StaticReportsButton
              key={i}
              label={btn.label}
              startIcon={btn.icon}
              onClick={() => navigate(btn.navTo)}
            />
          );
        } else {
          return false;
        }
      })
      .filter(Boolean) as React.ReactNode[];
  }, [buttonData]);

  return buttonElements;
}

export default useStaticReportsButtons;
