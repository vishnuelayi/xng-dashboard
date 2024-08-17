import XNGApiQueryParamObject from "../../../types/xng_api_query_param_object";
import { API_SERVICEPROVIDERS } from "../../api";
import useApiQueryData from "../use_api_query_data";

type Data = Awaited<ReturnType<typeof API_SERVICEPROVIDERS.v1ServiceProvidersIdGet>>;
type QueryParams = {
  providerId?: string;
  clientId?: string;
  state?: string;
};

const useApiQueryServiceProviderById = (paramObject:XNGApiQueryParamObject<QueryParams, Data>) => {
  const { providerId, clientId, state } = paramObject.queryParams;
  return useApiQueryData(
    {
      queryFn: async () =>
        await API_SERVICEPROVIDERS.v1ServiceProvidersIdGet(
          providerId || "",
          clientId || "",
          state || "",
        ),
      queryKey: ["v1ServiceProvidersIdGet", providerId, clientId, state],
      ...(paramObject.options ?? {})
    }
  );
};

export default useApiQueryServiceProviderById;
