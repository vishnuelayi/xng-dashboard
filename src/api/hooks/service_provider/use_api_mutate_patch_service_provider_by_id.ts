import { API_SERVICEPROVIDERS } from "../../api";
import { PatchServiceProviderRequest } from "../../../profile-sdk";
import useApiMutateData from "../use_api_mutate_data";
import XNGApiMutateParamObject from "../../../types/xng_api_mutate_param_object";

type Data = Awaited<ReturnType<typeof API_SERVICEPROVIDERS.v1ServiceProvidersIdPatch>>; // generic parameter T is used to define data the type of the useApiMutateData hook
type Body = PatchServiceProviderRequest;  // generic parameter B is used to define body the type of the useApiMutateData hook
type QueryParams = {
  id: string;
  clientId: string;
  state: string;
}

const useApiMutatePatchServiceProviderById = (paramObject: XNGApiMutateParamObject<QueryParams, Data, Body>) => {
  const { id, clientId,  state } = paramObject.queryParams;

  return useApiMutateData({
    mutationFn: async (body: Body) =>
      await API_SERVICEPROVIDERS.v1ServiceProvidersIdPatch(id, clientId, state, body),
    mutationKey: ["v1ServiceProvidersIdPatch", id, state],
    ...(paramObject.options ?? {})
  });
};

export default useApiMutatePatchServiceProviderById;
