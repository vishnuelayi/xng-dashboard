import XNGApiQueryParamObject from "../../../types/xng_api_query_param_object";
import { API_SERVICEPROVIDERS } from "../../api";
import useApiQueryData from "../use_api_query_data";

type Data = Awaited<ReturnType<typeof API_SERVICEPROVIDERS.v1ServiceProvidersServiceProviderIdGetServiceProviderCaseloadGet>>;
type QueryParams = {
  serviceProviderId: string;
  state: string;
  clientId?: string;
};

const useApiQueryServiceProviderCaseload = (paramObject:XNGApiQueryParamObject<QueryParams, Data>) => {
  const { serviceProviderId, state, clientId } = paramObject.queryParams;

  return useApiQueryData(
    {
      queryFn: async () =>
        await API_SERVICEPROVIDERS.v1ServiceProvidersServiceProviderIdGetServiceProviderCaseloadGet(
          serviceProviderId,
          state,
          clientId,
        ),
      queryKey: ["v1ServiceProvidersServiceProviderIdGetServiceProviderCaseloadGet", serviceProviderId, state, clientId],
      ...(paramObject.options ?? {})
    }
  );
};

export default useApiQueryServiceProviderCaseload;
