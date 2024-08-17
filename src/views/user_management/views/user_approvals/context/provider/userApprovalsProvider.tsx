import { selectStateInUS } from "../../../../../../context/slices/stateInUsSlice";
import { selectLoggedInClientAssignment } from "../../../../../../context/slices/userProfileSlice";
import { useXNGSelector } from "../../../../../../context/store";
import UserApprovalContext from "../user_approvals_context";
import useUserManagementCardsApi from "../../hooks/api/useUserManagementCardsApi";
import UseUserApprovalsActionsCtxProperty from "../../hooks/context-properties/UseUserApprovalsActionsCtxProperty";
import useUserApprovalsFilterCtxProperty from "../../hooks/context-properties/filter/useUserApprovalsFilterCtxProperty";
import useUserApprovalsTabsCtxProperty from "../../hooks/context-properties/useUserApprovalsTabsCtxProperty";

type Props = {
  children: React.ReactNode;
};

const UserApprovalsProvider = (props: Props) => {
  const state = useXNGSelector(selectStateInUS);
  const loggedInClient = useXNGSelector(selectLoggedInClientAssignment);

  // Hooks representing each property of the user approvals context
  const userManagementApiData = useUserManagementCardsApi(loggedInClient.client?.id, state);
  const approvalsTabIndex = useUserApprovalsTabsCtxProperty();
  const userApprovalsFilterData = useUserApprovalsFilterCtxProperty(
    loggedInClient.authorizedDistricts,
  );
  const userApprovalsActions = UseUserApprovalsActionsCtxProperty(
    state,
    [userManagementApiData.refetchData],
    [userManagementApiData.refetchData],
  );

  // console.log("userManagementData", userManagementApiData);
  // console.log("FilterData", userApprovalsFilterData);

  return (
    <UserApprovalContext.Provider
      value={{
        approvalsTabIndex,
        userManagementApiData,
        userApprovalsFilterData,
        userApprovalsActions,
      }}
    >
      {props.children}
    </UserApprovalContext.Provider>
  );
};

export default UserApprovalsProvider;
