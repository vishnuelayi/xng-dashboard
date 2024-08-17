import { useReducer } from "react";
import StaffDirectoryManagerContext from "../staff_directory_manager_context";
import StaffDirectoryManagerReducer from "../state/staff_directory_manager_reducer";
import React from "react";
import staffDirectoryManagerStateInit from "../state/staff_directory_manager_state_init";

/**
 * Provides the context and state management for the staff directory.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {React.ReactNode} props.children - The child components.
 * @returns {JSX.Element} The rendered StaffDirectoryProvider component.
 */
const StaffDirectoryManagerProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = useReducer(
    StaffDirectoryManagerReducer,
    undefined,
    //getStaffDirectoryStateInitFnArgs(loggedInClient.client, stateInUs, userResponse), //used to get the initial argument for the staff directory init function
    staffDirectoryManagerStateInit,
  );

  // console.log("staff directory state", state);
  return (
    <StaffDirectoryManagerContext.Provider
      value={{
        store: state,
        dispatch,
      }}
    >
      {children}
    </StaffDirectoryManagerContext.Provider>
  );
};

export default StaffDirectoryManagerProvider;
