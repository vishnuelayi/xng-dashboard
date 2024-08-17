import { useEffect, useState } from "react";
import { API_DISTRICTS } from "../../../../../api/api";
import { selectStateInUS } from "../../../../../context/slices/stateInUsSlice";
import { useXNGSelector } from "../../../../../context/store";
import { DistrictRef, GetSchoolCampusLineItemsResponse } from "../../../../../profile-sdk";
import { CampusInformationFetchedTable } from "../types/types";

/**
 * API hook in charge of fetching the tabular data, and refetching if any dependencies change.
 * The only current dependency is the user's selected `district`.
 */
export function useFetchTable(props: {
  dependencies: { district: DistrictRef | null };
}): CampusInformationFetchedTable {
  const { dependencies } = props;

  const stateInUS = useXNGSelector(selectStateInUS);

  async function refetch() {
    if (!dependencies.district) return;

    const res: GetSchoolCampusLineItemsResponse =
      await API_DISTRICTS.v1DistrictsDistrictIdSchoolCampusesLineItemDisplaysGet(
        dependencies.district.id!,
        stateInUS,
      );

    setCampusDropdownsRes(res);
  }

  const [campusLineItemsRes, setCampusDropdownsRes] =
    useState<GetSchoolCampusLineItemsResponse | null>(null);

  useEffect(() => {
    refetch();
  }, [dependencies.district]);

  return { campusLineItemsRes, refetch };
}
