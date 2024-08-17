import { API_SERVICEPROVIDERS } from "../../api";
import { CreateServiceProviderRequest } from "../../../profile-sdk";
import useApiMutateData from "../use_api_mutate_data";
import XNGApiMutateParamObject from "../../../types/xng_api_mutate_param_object";

type Data = Awaited<ReturnType<typeof API_SERVICEPROVIDERS.v1ServiceProvidersPost>>; // generic parameter T is used to define data the type of the useApiMutateData hook
type Body = CreateServiceProviderRequest;  // generic parameter B is used to define body the type of the useApiMutateData hook
type QueryParams = {
  state: string;
  creatingUserId: string;
}

const useApiMutatePostServiceProviderByUserId = (paramObject: XNGApiMutateParamObject<QueryParams, Data, Body>) => {

  const { state, creatingUserId } = paramObject.queryParams;

  return useApiMutateData({
    mutationFn: async (body: Body) =>
      await API_SERVICEPROVIDERS.v1ServiceProvidersPost(state, body, creatingUserId),
    mutationKey: ["v1ServiceProvidersPost", creatingUserId],
    ...(paramObject.options ?? {})
  });
};

export default useApiMutatePostServiceProviderByUserId;
