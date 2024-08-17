import { ClientAssignment, DistrictRef, UserResponse } from "../../../profile-sdk";

type UserManagementStoreType = {
  userManagementData: {
    client: ClientAssignment["client"];
    stateInUs: string;
    user: UserResponse | null;
    authorizedDistrictsFilterData: {
      authorizedDistrictsOptions: DistrictRef[] | undefined;
      selectedDistricts: DistrictRef;
    };
  };
  staffDirectoryData: {
    modals: {
      createProvider: {
        isOpen: boolean;
      };
      exportStaffDirectory: {
        isOpen: boolean;
      };
    };
  };
};

export default UserManagementStoreType;
