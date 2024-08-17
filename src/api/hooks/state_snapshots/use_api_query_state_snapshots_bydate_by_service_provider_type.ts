import useApiQueryData from "../use_api_query_data";
import { API_STATESNAPSHOTS } from "../../api";
import XNGApiQueryParamObject from "../../../types/xng_api_query_param_object";

type Data = Awaited<ReturnType<typeof API_STATESNAPSHOTS.v1StateSnapshotsByDateServicesByServiceProviderTypeGet>>;
type QueryParams = {
  stateInUs: string;
};

const useApiQueryStateSnapshotsByDateByServiceProviderType = (paramObject: XNGApiQueryParamObject<QueryParams, Data>) => {
  const { stateInUs } = paramObject.queryParams;

  return useApiQueryData(
    {
      queryFn: async () =>
        await API_STATESNAPSHOTS.v1StateSnapshotsByDateServicesByServiceProviderTypeGet(stateInUs),
      queryKey: ["v1StateSnapshotsByDateServicesByServiceProviderTypeGet", stateInUs],
      ...(paramObject.options ?? {})
    }
  );
};

export default useApiQueryStateSnapshotsByDateByServiceProviderType;
