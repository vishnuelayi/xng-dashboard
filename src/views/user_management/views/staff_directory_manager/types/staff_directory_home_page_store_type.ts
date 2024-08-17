import { OrderByDirection, StaffDirectoryProfile } from "../../../../../profile-sdk";

type StaffDirectoryHomePageStoreType = {
  tableData: {
    filter: {
      searchedProvider: string;
      showInactiveStaff: boolean;
    };
    sort: {
      column: keyof StaffDirectoryProfile;
      direction: OrderByDirection;
    };
    pagination: {
      currentPage: number;
      rowsPerPage: number;
    };
  };
};

export default StaffDirectoryHomePageStoreType;
