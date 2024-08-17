import { useXNGSelector } from "../../context/store";
import { API_STUDENTS } from "../api";
import { selectStateInUS } from "../../context/slices/stateInUsSlice";
import { selectClientID } from "../../context/slices/loggedInClientSlice";

export function useV1StudentsMergeStudentsPatch() {
  const stateInUs = useXNGSelector(selectStateInUS);
  const clientID = useXNGSelector(selectClientID);

  async function patch(primaryProfileId: string, profileIdsToMerge: string[]) {
    const _res = await API_STUDENTS.v1StudentsMergeStudentsPatch(stateInUs, {
      clientId: clientID,
      primaryProfileId,
      profileIdsToMerge,
    });

    return _res;
  }

  return patch;
}
