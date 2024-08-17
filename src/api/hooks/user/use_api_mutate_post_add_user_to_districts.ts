import useApiMutateData from "../use_api_mutate_data";
import { API_USERS } from "../../api";
import { AddDistrictsToUserRequest } from "../../../profile-sdk";
import XNGApiMutateParamObject from "../../../types/xng_api_mutate_param_object";

type Data = Awaited<ReturnType<typeof API_USERS.v1UsersAddUserDistrictsPost>>; // generic parameter T is used to define data the type of the useApiMutateData hook
type Body = AddDistrictsToUserRequest;  // generic parameter B is used to define body the type of the useApiMutateData hook
type QueryParams = {
  state: string;
}

const useApiMutatePostAddUserToDistricts = (paramObject: XNGApiMutateParamObject<QueryParams, Data, Body>) => {
  const { state } = paramObject.queryParams;

  return useApiMutateData({
    mutationFn: (body: Body) =>
      API_USERS.v1UsersAddUserDistrictsPost(body, state),
    mutationKey: ["v1UsersAddUserDistrictsPost"],
    ...(paramObject?.options ?? {})
  });
};

export default useApiMutatePostAddUserToDistricts;
