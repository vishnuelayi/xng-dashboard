import React from "react";
import StaffDirectoryManagerContext from "../../context/staff_directory_manager_context";

const useStaffDirectoryManagerContext = () => {
  return React.useContext(StaffDirectoryManagerContext);
};

export default useStaffDirectoryManagerContext;
