import React from "react";
import UserApprovalsTabsEnum from "../../types/user_approvals_tabs_enum";
import UserApprovalsContextType from "../../types/user_approvals_context_type";

const useUserApprovalsTabsCtxProperty = () => {
  const [selectedtab, setSelectedtab] = React.useState(0);

  const onSetSelectedTab = (tab: UserApprovalsTabsEnum) => {
    setSelectedtab(tab);
  };

  const tabs: UserApprovalsContextType["approvalsTabIndex"] = {
    selectedTabIndex: selectedtab,
    setSelectedTabIndex: onSetSelectedTab,
  };

  return tabs;
};

export default useUserApprovalsTabsCtxProperty;
