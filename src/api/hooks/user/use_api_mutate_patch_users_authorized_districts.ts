import { API_USERS } from "../../api";
import { PatchAuthorizedDistrictsRequest } from "../../../profile-sdk";
import useApiMutateData from "../use_api_mutate_data";
import XNGApiMutateParamObject from "../../../types/xng_api_mutate_param_object";

type Data = Awaited<ReturnType<typeof API_USERS.v1UsersIdClientAssignmentsClientIdAuthorizedDistrictsPatch>>; // generic parameter T is used to define data the type of the useApiMutateData hook
type Body = PatchAuthorizedDistrictsRequest;  // generic parameter B is used to define body the type of the useApiMutateData hook
type QueryParams = {
  userId: string;
  clientId: string;
  state: string;
}

const useApiMutatePatchUsersAuthorizedDistricts = (paramObject: XNGApiMutateParamObject<QueryParams, Data, Body>) => {

  const { userId, clientId, state } = paramObject.queryParams;

  return useApiMutateData({
    mutationFn: async (body: Body) =>
      await API_USERS.v1UsersIdClientAssignmentsClientIdAuthorizedDistrictsPatch(
        userId,
        clientId,
        state,
        body,
      ),
    mutationKey: ["v1UsersIdClientAssignmentsClientIdAuthorizedDistrictsPatch"],
    ...(paramObject.options ?? {})
  });
};

export default useApiMutatePatchUsersAuthorizedDistricts;
