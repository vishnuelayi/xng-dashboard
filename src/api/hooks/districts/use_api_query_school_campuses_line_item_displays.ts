import useApiQueryData from "../use_api_query_data";
import { API_DISTRICTS } from "../../api";
import XNGApiQueryParamObject from "../../../types/xng_api_query_param_object";

type Data = Awaited<ReturnType<typeof API_DISTRICTS.v1DistrictsDistrictIdSchoolCampusesLineItemDisplaysGet>>;
type QueryParams = {
  districtId: string;
  stateInUs: string;
};

const useApiQuerySchoolCampusesLineItemDisplays = (paramObject:XNGApiQueryParamObject<QueryParams, Data>) => {
  const { districtId, stateInUs } = paramObject.queryParams;
  return useApiQueryData(
    {
      queryFn: async () =>
        await API_DISTRICTS.v1DistrictsDistrictIdSchoolCampusesLineItemDisplaysGet(
          districtId,
          stateInUs,
        ),
      queryKey: ["v1DistrictsDistrictIdSchoolCampusesLineItemDisplaysGet", districtId, stateInUs],
      ...(paramObject.options ?? {})
    }
  );
};

export default useApiQuerySchoolCampusesLineItemDisplays;
