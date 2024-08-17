import React from "react";
import userManagementContextType from "../types/user_management_context_type";

const UserManagementContext = React.createContext<userManagementContextType>(
  {} as userManagementContextType,
);

export default UserManagementContext;
