import React, { useEffect, useState } from "react";
import { API_DISTRICTS } from "../api";
import { DistrictRef, SchoolCampusRef } from "../../profile-sdk";

export const useSchoolCampusesDropDownDisplays = (
  districtRef: DistrictRef | undefined,
  state: string,
) => {
  const [data, setData] = useState<SchoolCampusRef[] | undefined>();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState({} as Error);

  useEffect(() => {
    if (!districtRef || !state || !districtRef.id) return;

    const getCampuses = async () => {
      try {
        const campusesDropdown = await API_DISTRICTS.v1DistrictsIdSchoolCampusesDropdownDisplaysGet(
          districtRef?.id || "",
          state,
        );
        setData(campusesDropdown.schoolCampuses);
      } catch (err) {
        const caughtErr = err as Error;
        setError(caughtErr);
      }
      setIsLoading(false);
      // console.log("CAMPUSES", campusesDropdown);
    };

    getCampuses();
  }, [districtRef, state]);

  return { data, isLoading, error };
};
