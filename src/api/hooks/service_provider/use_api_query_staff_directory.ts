import { API_SERVICEPROVIDERS } from "../../api";
import { OrderByDirection, StaffDirectorySortableColumnType } from "../../../profile-sdk";
import useApiQueryData from "../use_api_query_data";
import XNGApiQueryParamObject from "../../../types/xng_api_query_param_object";

type Data = Awaited<ReturnType<typeof API_SERVICEPROVIDERS.v1ServiceProvidersClientIdGetStaffDirectoryGet>>;
type QueryParams = {
  clientId: string | undefined;
  state: string;
  pageNumber: number;
  pageSize: number;
  sortBy: StaffDirectorySortableColumnType;
  sortDirection?: OrderByDirection | undefined;
  showInactives?: boolean | undefined;
  searchTerm?: string | undefined;
  districtFilter?: string | undefined;
};

const useApiQueryStaffDirectory = (paramObject:XNGApiQueryParamObject<QueryParams, Data>) => {
  const {
    clientId,
    state,
    pageNumber,
    pageSize,
    sortBy,
    sortDirection,
    showInactives,
    searchTerm,
    districtFilter,
  } = paramObject.queryParams;
  return useApiQueryData(
    {
      queryFn: async () =>
        await API_SERVICEPROVIDERS.v1ServiceProvidersClientIdGetStaffDirectoryGet(
          clientId || "",
          state,
          pageNumber,
          pageSize,
          sortBy,
          sortDirection,
          showInactives,
          searchTerm,
          districtFilter,
        ),
      queryKey: [
        "v1ServiceProvidersClientIdGetStaffDirectoryGet",
        clientId,
        districtFilter,
        pageNumber,
        pageSize,
        searchTerm,
        showInactives,
        sortBy,
        sortDirection,
        state,
      ],
      ...(paramObject.options ?? {})
    }
  );
};

export default useApiQueryStaffDirectory;
