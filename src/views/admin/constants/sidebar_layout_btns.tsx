import { useXNGSelector } from '../../../context/store';
import { ROUTES_XLOGS } from "../../../constants/URLs";
import { ButtonSidebarItemProps } from "../../../design/types/sidebar_content";
import { MSBICONS } from "../../../fortitude";

function useSidebarLayoutBtns(): ButtonSidebarItemProps[] {
  const studentMergeActive = useXNGSelector((state) => state.featureFlags.flags['StudentMergeActive']);

  const buttons: ButtonSidebarItemProps[] = [
    {
      icon: <MSBICONS.AvatarWithCircleOutline />,
      label: "User Approvals",
      route: ROUTES_XLOGS._admin.userApproval,
    },
    {
      icon: <MSBICONS.TwoPeople />,
      label: "Staff Directory Manager",
      route: ROUTES_XLOGS._admin.staffDirectoryManager,
    },
    {
      icon: <MSBICONS.Tools />,
      label: "Campus Management",
      route: ROUTES_XLOGS._admin.campusManagement,
    },
  ];

  if (studentMergeActive) {
    buttons.push({
      icon: <MSBICONS.Merge />,
      label: "Student Merge",
      route: ROUTES_XLOGS._admin.studentMerge,
    });
  }

  return buttons;
}

export default useSidebarLayoutBtns;