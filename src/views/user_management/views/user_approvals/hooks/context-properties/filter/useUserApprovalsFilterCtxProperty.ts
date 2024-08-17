import { DistrictRef } from "../../../../../../../profile-sdk";
import UserApprovalsContextType from "../../../types/user_approvals_context_type";
import useUserFilter from "./properties/useUserFilter";
import useUserHistoryFilter from "./properties/useUserHistoryFilter";

const useUserApprovalsFilterCtxProperty = (authorizedDistricts: DistrictRef[] | undefined) => {
  // USERS FILTER
  const userDenialsFilter = useUserFilter();
  const userApprovalsFilter = useUserFilter();
  const userHistoryFilter = useUserHistoryFilter();

  const userApprovalsFilterData: UserApprovalsContextType["userApprovalsFilterData"] = {
    users: {
      denials: userDenialsFilter,
      approvals: userApprovalsFilter,
      history: userHistoryFilter,
    },
  };

  return userApprovalsFilterData;
};

export default useUserApprovalsFilterCtxProperty;
