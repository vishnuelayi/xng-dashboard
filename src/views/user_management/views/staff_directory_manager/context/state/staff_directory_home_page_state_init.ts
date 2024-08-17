import { OrderByDirection } from "../../../../../../profile-sdk";
import StaffDirectoryHomePageStoreType from "../../types/staff_directory_home_page_store_type";

/**
 * Initializes the state for the staff directory.
 *
 * @returns {StaffDirectoryHomePageStoreType} The initialized staff directory state.
 */
const staffDirectoryHomePageStateInit =
  () // args: ReturnType<typeof getStaffDirectoryStateInitFnArgs>,
  : StaffDirectoryHomePageStoreType => {
    return {
      tableData: {
        filter: {
          searchedProvider: "",
          showInactiveStaff: false,
        },
        sort: {
          column: "firstName",
          direction: OrderByDirection.NUMBER_0,
        },
        pagination: {
          currentPage: 1,
          rowsPerPage: 10,
        },
      },
    };
  };

export default staffDirectoryHomePageStateInit;
