import { ClientAssignment, DistrictRef, UserResponse } from "../../../../profile-sdk";
import UserManagementStoreType from "../../types/user_management_store_type";

type UserManagementStateInitialArgsReturnType = {
  client: ClientAssignment["client"];
  authorizedDistrictsOptions: DistrictRef[] | undefined;
  user: UserResponse | null;
  stateInUs: string;
};

type UserManagementStateInitialArgsParamObj = {
  clientAssignment: ClientAssignment;
  user: UserResponse | null;
  stateInUs: string;
};

export const allDistrictsOption: DistrictRef = {
  id: "all",
  name: "All",
};

/**
 * Retrieves the initial arguments for the staff directory state.
 *
 * @param {DistrictRef[] | undefined} authorizedDistricts - The authorized districts.
 * @returns {StaffDirectoryStateInitialArgs} The initial arguments for the staff directory state.
 */
export const getInitialArgs_user_management = (
  props: UserManagementStateInitialArgsParamObj,
): UserManagementStateInitialArgsReturnType => {
  const { clientAssignment, user, stateInUs } = props;

  const authorizedDistrictOptions: DistrictRef[] = [
    allDistrictsOption,
    ...(clientAssignment.authorizedDistricts || []),
  ];
  return {
    client: clientAssignment?.client,
    authorizedDistrictsOptions: authorizedDistrictOptions,
    user: user,
    stateInUs,
  };
};

const userManagementStateInit = (
  initArgs: UserManagementStateInitialArgsReturnType,
): UserManagementStoreType => {
  return {
    userManagementData: {
      client: initArgs.client,
      user: initArgs.user,
      authorizedDistrictsFilterData: {
        authorizedDistrictsOptions: initArgs.authorizedDistrictsOptions,
        selectedDistricts: allDistrictsOption,
      },
      stateInUs: initArgs.stateInUs,
    },
    staffDirectoryData: {
      modals: {
        createProvider: {
          isOpen: false,
        },
        exportStaffDirectory: {
          isOpen: false,
        },
      },
    },
  };
};

export default userManagementStateInit;
