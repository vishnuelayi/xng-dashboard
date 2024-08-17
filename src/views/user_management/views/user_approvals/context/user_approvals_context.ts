import { createContext } from "react";
import UserApprovalsContextType from "../types/user_approvals_context_type";

const UserApprovalContext = createContext<UserApprovalsContextType>({} as UserApprovalsContextType);

export default UserApprovalContext;
