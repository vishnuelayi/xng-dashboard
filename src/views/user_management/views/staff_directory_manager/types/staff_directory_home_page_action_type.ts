/**
 * Represents the available actions for the staff directory.
 */

import { OrderByDirection, StaffDirectoryProfile } from "../../../../../profile-sdk";

/**
 * Represents a staff directory action.
 */
type StaffDirectoryHomePageAction =
  | ACTION_SET_PROVIDER_SEARCH_FILTER
  | ACTION_SET_SHOW_INACTIVE_STAFF_FILTER
  | ACTION_SET_TABLE_COLUMN_SORT
  | ACTION_SET_PAGINATION_ROWS_PER_PAGE
  | ACTION_SET_PAGINATION_CURRENT_PAGE;
// | ACTION_SET_HOME_PAGE_STAFF_DIRECTORY_QUERY_API;

//#region ACTIONS

type ACTION_SET_PROVIDER_SEARCH_FILTER = {
  type: "set_provider_search_filter";
  payload: {
    searchedProvider: string;
  };
};

type ACTION_SET_SHOW_INACTIVE_STAFF_FILTER = {
  type: "set_show_inactive_staff_filter";
  payload: {
    showInactive: boolean;
  };
};

type ACTION_SET_TABLE_COLUMN_SORT = {
  type: "set_table_column_sort";
  payload: {
    sortValue: {
      column: keyof StaffDirectoryProfile;
      direction: OrderByDirection;
    };
  };
};

type ACTION_SET_PAGINATION_ROWS_PER_PAGE = {
  type: "set_pagination_rows_per_page";
  payload: {
    rowsPerPage: number;
  };
};

type ACTION_SET_PAGINATION_CURRENT_PAGE = {
  type: "set_pagination_current_page";
  payload: {
    currentPage: number;
  };
};

//#endregion

export default StaffDirectoryHomePageAction;
