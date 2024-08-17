import useApiQueryData from "../use_api_query_data";
import { API_DISTRICTS } from "../../api";
import XNGApiQueryParamObject from "../../../types/xng_api_query_param_object";

type Data = Awaited<ReturnType<typeof API_DISTRICTS.v1DistrictsIdSchoolCampusesDropdownDisplaysGet>>;
type QueryParams = {
  districtId?: string;
  state?: string;
};

const useApiQueryCampusDropDownDisplays = (paramObject:XNGApiQueryParamObject<QueryParams, Data>) => {
  const { districtId, state } = paramObject.queryParams;
  return useApiQueryData(
    {
      queryFn: async () =>
        await API_DISTRICTS.v1DistrictsIdSchoolCampusesDropdownDisplaysGet(
          districtId || "",
          state || "",
        ),
      queryKey: ["v1DistrictsIdSchoolCampusesDropdownDisplaysGet", districtId, state],
      staleTime: 60 * 60 * 3 * 1000, // 3 hours
      ...(paramObject.options ?? {})
    }
  );
};

export default useApiQueryCampusDropDownDisplays;
