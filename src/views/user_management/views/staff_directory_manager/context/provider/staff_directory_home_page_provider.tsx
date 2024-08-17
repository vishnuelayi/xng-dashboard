import React, { useReducer } from "react";
import useUserManagementContext from "../../../../hooks/context/use_user_management_context";
import useApiQueryStaffDirectory from "../../../../../../api/hooks/service_provider/use_api_query_staff_directory";
import RemapStaffDirectorySortableColumnTypeKeyToEnum from "../../utils/remap_staff_directory_sortable_column_type_key_to_enum";
import StaffDirectoryHomePageReducer from "../state/staff_directory_home_page_reducer";
import staffDirectoryHomePageStateInit from "../state/staff_directory_home_page_state_init";
import StaffDirectoryHomePageContext from "../staff_directory_home_page_context";

const StaffDirectoryHomePageProvider = ({ children }: { children: React.ReactNode }) => {
  const client_id = useUserManagementContext().store.userManagementData.client?.id;
  const state_in_us = useUserManagementContext().store.userManagementData.stateInUs;
  const selected_district =
    useUserManagementContext().store.userManagementData.authorizedDistrictsFilterData
      .selectedDistricts;

  const [state, dispatch] = useReducer(
    StaffDirectoryHomePageReducer,
    undefined,
    //getStaffDirectoryStateInitFnArgs(loggedInClient.client, stateInUs, userResponse), //used to get the initial argument for the staff directory init function
    staffDirectoryHomePageStateInit,
  );

  const apiQueryStaffDirectory = useApiQueryStaffDirectory({
    queryParams: {
      clientId: client_id,
      state: state_in_us,
      pageNumber: state.tableData.pagination.currentPage,
      pageSize: state.tableData.pagination.rowsPerPage,
      sortBy: RemapStaffDirectorySortableColumnTypeKeyToEnum(state.tableData.sort.column),
      sortDirection: state.tableData.sort.direction,
      showInactives: state.tableData.filter.showInactiveStaff,
      searchTerm: state.tableData.filter.searchedProvider,
      districtFilter: selected_district.name === "All" ? undefined : selected_district.id,
    },
  });

  // console.log("home page state", state);
  return (
    <StaffDirectoryHomePageContext.Provider
      value={{
        store: state,
        dispatch,
        apiQueryStaffDirectory,
      }}
    >
      {children}
    </StaffDirectoryHomePageContext.Provider>
  );
};

export default StaffDirectoryHomePageProvider;
