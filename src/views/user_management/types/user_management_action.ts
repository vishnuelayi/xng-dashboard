import { DistrictRef } from "../../../profile-sdk";

type UserManagementAction =
  | ACTION_SET_SELECT_DISTRICTS_FILTER
  | ACTION_SET_OPEN_MODAL_STAFF_DIRECTORY_CREATE_PROVIDER
  | ACTION_SET_OPEN_MODAL_STAFF_DIRECTORY_EXPORT_STAFF_DIRECTORY;

//#region ACTIONS
type ACTION_SET_SELECT_DISTRICTS_FILTER = {
  type: "set_selected_districts_filter";
  payload: {
    selectedDistrict: DistrictRef;
  };
};

type ACTION_SET_OPEN_MODAL_STAFF_DIRECTORY_CREATE_PROVIDER = {
  type: "set_open_modal_staff_directory_create_provider";
  payload: {
    isOpen: boolean;
  };
};

type ACTION_SET_OPEN_MODAL_STAFF_DIRECTORY_EXPORT_STAFF_DIRECTORY = {
  type: "set_open_modal_staff_directory_export_staff_directory";
  payload: {
    isOpen: boolean;
  };
};

//#endregion

export default UserManagementAction;
