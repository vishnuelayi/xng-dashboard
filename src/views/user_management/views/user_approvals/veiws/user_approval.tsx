import UserManagementTabs from "../../../components/user_management_tabs";
import UserApprovalsSection from "../containers/sections/user_approvals_section";
import UserDenialsSection from "../containers/sections/user_denials_section";
import FilterAndActionButtonsSection from "../containers/wrappers/filter_&_actionbuttons_section";
import UserHistoryCardsGrid from "../containers/wrappers/user_history_cards_grid";
import useUserApprovalsContext from "../hooks/context/useUserApprovalsContext";

const UserApproval = () => {
  const { selectedTabIndex, setSelectedTabIndex } = useUserApprovalsContext().approvalsTabIndex;
  return (
    <UserManagementTabs
      tabs={[
        { label: "User Approvals", content: <UserApprovalsSection /> },
        { label: "User Denials", content: <UserDenialsSection /> },
        { label: "Approval/Denial History", content: <UserHistoryCardsGrid /> },
      ]}
      selectedTabIndex={selectedTabIndex}
      setSelectedTabIndex={(value) => setSelectedTabIndex(value)}
      componentBetweenTabsAndContent={<FilterAndActionButtonsSection />}
    />
  );
};

export default UserApproval;
