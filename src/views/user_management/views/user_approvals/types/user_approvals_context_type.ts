import {
  UserManagementCardsResponse,
  RespondToManyRequestsForDistrictAccessRequest,
} from "../../../../../profile-sdk";
import UserApprovalsTabsEnum from "./user_approvals_tabs_enum";
import UsersCardsFilterType from "./user_cards_filter_type";
import UsersHistoryCardsFilterType from "./users_history_cards_filter_type";

type UserApprovalsContextType = {
  approvalsTabIndex: {
    selectedTabIndex: UserApprovalsTabsEnum;
    setSelectedTabIndex: (tab: UserApprovalsTabsEnum) => void;
  };
  userManagementApiData: {
    data: UserManagementCardsResponse | undefined;
    error: string | undefined;
    loading: boolean;
  };
  userApprovalsFilterData: {
    users: {
      denials: UsersCardsFilterType;
      approvals: UsersCardsFilterType;
      history: UsersHistoryCardsFilterType;
    };
  };
  userApprovalsActions: {
    onApproveUsers: (body: RespondToManyRequestsForDistrictAccessRequest) => void;
    onDenyUsers: (body: RespondToManyRequestsForDistrictAccessRequest) => void;
    actionLoading: boolean;
  };
};

export default UserApprovalsContextType;
