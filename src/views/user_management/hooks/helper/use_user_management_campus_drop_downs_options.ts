import React from "react";
import useUserManagementContext from "../context/use_user_management_context";
import useApiQueryCampusDropDownDisplays from "../../../../api/hooks/districts/use_api_query_campus_drop_down_displays";

const useUserManagementCampusDropDownsOptions = (state_in_us: string) => {
  const authorized_districts_filter_options =
    useUserManagementContext().store.userManagementData.authorizedDistrictsFilterData
      .authorizedDistrictsOptions;

  const selected_district_filter =
    useUserManagementContext().store.userManagementData.authorizedDistrictsFilterData
      .selectedDistricts;

  const campus_district_id = React.useMemo(() => {
    if (selected_district_filter.id === "all") {
      return authorized_districts_filter_options && authorized_districts_filter_options?.length > 1
        ? authorized_districts_filter_options?.[1].id
        : undefined; // if we have more than one district then we can use the second district id as the first is "all" which is not a valid district id
    } else {
      return selected_district_filter.id;
    }
  }, [authorized_districts_filter_options, selected_district_filter.id]);

  const { data: campusDropdownOptions, ...other } = useApiQueryCampusDropDownDisplays({
    queryParams: {
      districtId: campus_district_id,
      state: state_in_us,
    },
    options:{
      staleTime: 60 * 60 * 1000, // 1 hour
    }
  });

  return {
    campusDropdownOptions,
    ...other,
  };
};

export default useUserManagementCampusDropDownsOptions;
