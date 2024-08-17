import { useContext } from "react";
import UserApprovalContext from "../../context/user_approvals_context";

const useUserApprovalsContext = () => {
  return useContext(UserApprovalContext);
};

export default useUserApprovalsContext;
