import useApiQueryData from "../use_api_query_data";
import { API_STATESNAPSHOTS } from "../../api";
import XNGApiQueryParamObject from "../../../types/xng_api_query_param_object";

type Data = Awaited<ReturnType<typeof API_STATESNAPSHOTS.v1StateSnapshotsByDateServiceProviderTypesGet>>;
type QueryParams = {
  state: string;
  date?: Date;
};

const useApiQueryGetServiceProviderTypesByDate = (paramObject:XNGApiQueryParamObject<QueryParams,Data>) => {
  const { state, date } = paramObject.queryParams;
  return useApiQueryData(
    {
      queryFn: async () => await API_STATESNAPSHOTS.v1StateSnapshotsByDateServiceProviderTypesGet(state, date),
      queryKey: ["v1StateSnapshotsByDateServiceProviderTypesGet", state, date],
      ...(paramObject.options ?? {})
    }
  );
};

export default useApiQueryGetServiceProviderTypesByDate;
