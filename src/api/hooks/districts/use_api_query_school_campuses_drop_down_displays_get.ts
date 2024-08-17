import useApiQueryData from "../use_api_query_data";
import { API_DISTRICTS } from "../../api";
import XNGApiQueryParamObject from "../../../types/xng_api_query_param_object";


type Data = Awaited<ReturnType<typeof API_DISTRICTS.v1DistrictsSchoolCampusesDropdownDisplaysGet>>;
type QueryParams = {
  districtIds?: string;
  state?: string;
};


const useApiQuerySchoolCampusesDropdownDisplaysGet = (paramObject:XNGApiQueryParamObject<QueryParams, Data>) => {
  const { districtIds, state } = paramObject.queryParams;
  return useApiQueryData(
    {
      queryFn: async () =>
        await API_DISTRICTS.v1DistrictsSchoolCampusesDropdownDisplaysGet(
          districtIds || "",
          state || "",
        ),
      queryKey: ["v1DistrictsSchoolCampusesDropdownDisplaysGet", districtIds, state],
      staleTime: 60 * 60 * 1000,
      ...(paramObject.options ?? {})
    }
  );
};

export default useApiQuerySchoolCampusesDropdownDisplaysGet;
