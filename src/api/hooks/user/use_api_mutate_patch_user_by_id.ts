import { API_USERS } from "../../api";
import { PatchUserRequest } from "../../../profile-sdk";
import useApiMutateData from "../use_api_mutate_data";
import XNGApiMutateParamObject from "../../../types/xng_api_mutate_param_object";

type Data = Awaited<ReturnType<typeof API_USERS.v1UsersIdPatch>>; // generic parameter T is used to define data the type of the useApiMutateData hook
type Body = PatchUserRequest | undefined; // generic parameter B is used to define body the type of the useApiMutateData hook
type QueryParams = {
  id: string;
  state: string;
};

const useApiMutatePatchUserById = (
  paramObject: XNGApiMutateParamObject<QueryParams, Data, Body>,
) => {
  const { id, state } = paramObject.queryParams;
  return useApiMutateData({
    mutationFn: async (body: Body) => API_USERS.v1UsersIdPatch(id, state, body),
    mutationKey: ["v1UsersIdPatch", id],
    ...(paramObject?.options ?? {}),
  });
};

export default useApiMutatePatchUserById;
