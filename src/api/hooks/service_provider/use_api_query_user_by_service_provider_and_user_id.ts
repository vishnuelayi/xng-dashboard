import useApiQueryData from "../use_api_query_data";
import { API_USERS } from "../../api";
import XNGApiQueryParamObject from "../../../types/xng_api_query_param_object";

type Data = Awaited<ReturnType<typeof API_USERS.v1UsersByServiceProviderGet>>;
type QueryParams = {
  serviceProviderId?: string;
  clientId?: string;
  state?: string;
};

const useApiQueryUserByServiceProviderAndUserId = (paramObject: XNGApiQueryParamObject<QueryParams, Data>) => {
  const { serviceProviderId, clientId, state } = paramObject.queryParams;
  return useApiQueryData(
    {
      queryFn: async () =>
        await API_USERS.v1UsersByServiceProviderGet(
          serviceProviderId || "",
          clientId || "",
          state || "",
        ),
      queryKey: ["v1UsersByServiceProviderGet", serviceProviderId, clientId, state],
      ...(paramObject.options ?? {})
    }
  );
};

export default useApiQueryUserByServiceProviderAndUserId;
