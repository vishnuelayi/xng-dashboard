import UserManagementAction from "./user_management_action";
import UserManagementConfirmationModalType from "./user_management_confirmation_modal_type";
import UserManagementStoreType from "./user_management_store_type";

type userManagementContextType = {
  store: UserManagementStoreType;
  dispatch: React.Dispatch<UserManagementAction>;
  confirmation_modal: {
    state: UserManagementConfirmationModalType;
    setState: React.Dispatch<React.SetStateAction<UserManagementConfirmationModalType>>;
  };
};

export default userManagementContextType;
