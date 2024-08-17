import React from "react";
import { RespondToManyRequestsForDistrictAccessRequest } from "../../../../../../profile-sdk";
import UserApprovalsContextType from "../../types/user_approvals_context_type";
import { API_USERS } from "../../../../../../api/api";

const UseUserApprovalsActionsCtxProperty = (
  state: string,
  onApproveAction?: (() => void)[],
  onDenyAction?: (() => void)[],
) => {
  const [actionLoading, setActionLoading] = React.useState<boolean>(false);

  const approveUsersHandler = async (body: RespondToManyRequestsForDistrictAccessRequest) => {
    // console.log("approveUsersHandler", body);
    setActionLoading(true);
    await API_USERS.v1UsersRequestAccessToDistrictRespondManyPost(state, body);

    onApproveAction?.forEach((callback) => callback());
    setActionLoading(false);
  };

  const denyUsersHandler = async (body: RespondToManyRequestsForDistrictAccessRequest) => {
    // console.log("denyUsersHandler", body);
    // setActionLoading(true);
    await API_USERS.v1UsersRequestAccessToDistrictRespondManyPost(state, body);
    // setTimeout(() => {
    //   onDenyAction?.forEach(callback => callback());
    //   setActionLoading(false);
    // }, 2000); // Wait for 2 seconds
    onDenyAction?.forEach((callback) => callback());
    setActionLoading(false);
  };

  const userApprovalsActions: UserApprovalsContextType["userApprovalsActions"] = {
    onApproveUsers: approveUsersHandler,
    onDenyUsers: denyUsersHandler,
    actionLoading,
  };

  return userApprovalsActions;
};

export default UseUserApprovalsActionsCtxProperty;
