import XNGApiQueryParamObject from "../../../types/xng_api_query_param_object";
import { API_SERVICEPROVIDERS } from "../../api";
import useApiQueryData from "../use_api_query_data";

type Data = Awaited<ReturnType<typeof API_SERVICEPROVIDERS.v1ServiceProvidersGet>>;
type QueryParams = {
  clientId?: string;
  state: string;
};

const useApiQueryServiceProviders = (paramObject:XNGApiQueryParamObject<QueryParams, Data>) => {
  const { clientId, state } = paramObject.queryParams;
  return useApiQueryData(
    {
      queryFn: async () => await API_SERVICEPROVIDERS.v1ServiceProvidersGet(clientId!, state),
      queryKey: ["v1ServiceProvidersGet", clientId, state],
      ...(paramObject.options ?? {})
    }
  );
};

export default useApiQueryServiceProviders;
