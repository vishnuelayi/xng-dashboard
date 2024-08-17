import React from "react";
import UserManagementReducer from "../state/user_management_reducer";
import userManagementStateInit, {
  getInitialArgs_user_management,
} from "../state/user_management_state_init";
import { useXNGSelector } from "../../../../context/store";
import {
  selectLoggedInClientAssignment,
  selectUser,
} from "../../../../context/slices/userProfileSlice";
import UserManagementContext from "../user_management_context";
import { selectStateInUS } from "../../../../context/slices/stateInUsSlice";
import UserManagementConfirmationModalType from "../../types/user_management_confirmation_modal_type";

const UserManagementProvider = ({ children }: { children: React.ReactNode }) => {
  const clientAssignment = useXNGSelector(selectLoggedInClientAssignment);
  const user = useXNGSelector(selectUser);
  const stateInUs = useXNGSelector(selectStateInUS);

  const [state, dispatch] = React.useReducer(
    UserManagementReducer,
    getInitialArgs_user_management({
      clientAssignment,
      user,
      stateInUs,
    }),
    userManagementStateInit,
  );

  const [confirmationModal, setConfirmationModal] =
    React.useState<UserManagementConfirmationModalType>({
      isOpen: false,
      title: "",
      body: "",
      onConfirm: () => {},
      onCancel: () => {},
    });

  return (
    <UserManagementContext.Provider
      value={{
        store: state,
        dispatch,
        confirmation_modal: {
          state: confirmationModal,
          setState: setConfirmationModal,
        },
      }}
    >
      {children}
    </UserManagementContext.Provider>
  );
};

export default UserManagementProvider;
