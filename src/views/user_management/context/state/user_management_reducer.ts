import produce from "immer";
import UserManagementAction from "../../types/user_management_action";
import UserManagementStoreType from "../../types/user_management_store_type";
import { allDistrictsOption } from "./user_management_state_init";

const UserManagementReducer = (
  state: UserManagementStoreType,
  action: UserManagementAction,
): UserManagementStoreType => {
  return produce(state, (draftState) => {
    switch (action.type) {
      case "set_selected_districts_filter":
        draftState.userManagementData.authorizedDistrictsFilterData.selectedDistricts =
          action.payload?.selectedDistrict || allDistrictsOption;
        break;
      case "set_open_modal_staff_directory_create_provider":
        draftState.staffDirectoryData.modals.createProvider.isOpen =
          action.payload?.isOpen || false;
        break;
      case "set_open_modal_staff_directory_export_staff_directory":
        draftState.staffDirectoryData.modals.exportStaffDirectory.isOpen =
          action.payload?.isOpen || false;
        break;
    }
    return draftState;
  });
};

export default UserManagementReducer;
