import { ROUTES_XLOGS } from "../../constants/URLs";
import { XNGICONS, XNGIconRenderer } from "../../design/icons";
import { ButtonSidebarItemProps } from "../../design/types/sidebar_content";

// todo: remove this and use the /design one instead.
export const DAYJS_FORMATTER_DONTUSE = "MM/DD/YYYY";

const LBL_STUDENT_MANAGER = "Student Manager";
const LBL_STUDENT_GROUPS = "Student Groups";
const LBL_STUDENT_PROFILE = "Student Profile Temp";

interface ISTUDENTS_SIDEBAR {
  labelManager: string;
  labelGroups: string;
  labelProfile: string;
  tabs: ButtonSidebarItemProps[];
}
export const STUDENTS_SIDEBAR: ISTUDENTS_SIDEBAR = {
  labelManager: LBL_STUDENT_MANAGER,
  labelGroups: LBL_STUDENT_GROUPS,
  labelProfile: LBL_STUDENT_PROFILE,

  tabs: [
    {
      icon: <XNGICONS.Inbox />,
      label: LBL_STUDENT_MANAGER,
      route: ROUTES_XLOGS._students.manager,
    },
    // {
    //   icon: <XNGIconRenderer i={<XNGICONS.People />} size="md" />,
    //   label: LBL_STUDENT_GROUPS,
    //   route: ROUTES_XLOGS._students.groups,
    // },
  ],
};
