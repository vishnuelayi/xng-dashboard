import useApiQueryStaffDirectory from "../../../../../api/hooks/service_provider/use_api_query_staff_directory";
import StaffDirectoryHomePageAction from "./staff_directory_home_page_action_type";
import StaffDirectoryHomePageStoreType from "./staff_directory_home_page_store_type";

type StaffDirectoryHomePageContextType = {
  store: StaffDirectoryHomePageStoreType;
  dispatch: React.Dispatch<StaffDirectoryHomePageAction>;
  apiQueryStaffDirectory: ReturnType<typeof useApiQueryStaffDirectory>;
};

export default StaffDirectoryHomePageContextType;
