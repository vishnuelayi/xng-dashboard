import StaffDirectoryManagerAction from "../../types/staff_directory_manager_action_type";
import StaffDirectoryManagerStoreType from "../../types/staff_directory_manager_store_type";
import produce from "immer";

const StaffDirectoryManagerReducer = (
  state: StaffDirectoryManagerStoreType,
  action: StaffDirectoryManagerAction,
) => {
  return produce(state, (draftState) => {
    switch (action.type) {
      default:
        return draftState;
    }
  });
};

export default StaffDirectoryManagerReducer;
