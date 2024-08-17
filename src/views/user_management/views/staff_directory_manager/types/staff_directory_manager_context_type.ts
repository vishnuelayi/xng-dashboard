import StaffDirectoryManagerAction from "./staff_directory_manager_action_type";
import StaffDirectoryManagerStoreType from "./staff_directory_manager_store_type";

type StaffDirectoryManagerContextType = {
  store: StaffDirectoryManagerStoreType;
  dispatch: React.Dispatch<StaffDirectoryManagerAction>;
};

export default StaffDirectoryManagerContextType;
