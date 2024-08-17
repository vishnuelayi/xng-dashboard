import StaffDirectoryHomePageAction from "../../types/staff_directory_home_page_action_type";
import StaffDirectoryHomePageStoreType from "../../types/staff_directory_home_page_store_type";
import produce from "immer";

const StaffDirectoryHomePageReducer = (
  state: StaffDirectoryHomePageStoreType,
  action: StaffDirectoryHomePageAction,
) => {
  return produce(state, (draftState) => {
    switch (action.type) {
      case "set_provider_search_filter":
        draftState.tableData.filter.searchedProvider = action.payload?.searchedProvider || "";
        break;
      case "set_show_inactive_staff_filter":
        draftState.tableData.filter.showInactiveStaff = action.payload?.showInactive || false;
        break;
      case "set_table_column_sort":
        draftState.tableData.sort.column = action.payload?.sortValue?.column;
        draftState.tableData.sort.direction = action.payload?.sortValue.direction;
        break;
      case "set_pagination_rows_per_page":
        draftState.tableData.pagination.rowsPerPage = action.payload?.rowsPerPage || 10;
        break;
      case "set_pagination_current_page":
        draftState.tableData.pagination.currentPage = action.payload?.currentPage || 0;
        break;
      default:
        return draftState;
    }
  });
};

export default StaffDirectoryHomePageReducer;
