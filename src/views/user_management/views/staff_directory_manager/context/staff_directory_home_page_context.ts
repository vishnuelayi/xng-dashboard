import React from "react";
import StaffDirectoryHomePageContextType from "../types/staff_directory_home_page_context_type";

const StaffDirectoryHomePageContext = React.createContext<StaffDirectoryHomePageContextType>(
  {} as StaffDirectoryHomePageContextType,
);

export default StaffDirectoryHomePageContext;
