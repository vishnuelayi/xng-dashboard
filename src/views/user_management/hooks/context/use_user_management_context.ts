import React from "react";
import UserManagementContext from "../../context/user_management_context";

const useUserManagementContext = () => {
  return React.useContext(UserManagementContext);
};

export default useUserManagementContext;
