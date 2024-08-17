import React from "react";
import StaffDirectoryHomePageContext from "../../context/staff_directory_home_page_context";

const useStaffDirectoryHomePageContext = () => {
  return React.useContext(StaffDirectoryHomePageContext);
};

export default useStaffDirectoryHomePageContext;
