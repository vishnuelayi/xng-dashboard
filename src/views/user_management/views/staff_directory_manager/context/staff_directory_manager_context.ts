import React from "react";
import StaffDirectoryManagerContextType from "../types/staff_directory_manager_context_type";

const StaffDirectoryManagerContext = React.createContext<StaffDirectoryManagerContextType>(
  {} as StaffDirectoryManagerContextType,
);

export default StaffDirectoryManagerContext;
