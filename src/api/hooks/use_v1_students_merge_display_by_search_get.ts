import { selectClientID } from "../../context/slices/loggedInClientSlice";
import { selectStateInUS } from "../../context/slices/stateInUsSlice";
import { useXNGSelector } from "../../context/store";
import { GetStudentMergeDisplaysResponse } from "../../profile-sdk";
import { API_STUDENTS } from "../api";

export function useV1StudentsMergeDisplayBySearchGet() {
  const clientID = useXNGSelector(selectClientID);
  const stateInUS = useXNGSelector(selectStateInUS);

  async function fetch(input: string): Promise<GetStudentMergeDisplaysResponse> {
    try {
      const searchResponse = await API_STUDENTS.v1StudentsMergeDisplayBySearchGet(
        clientID!,
        input,
        stateInUS,
      );

      return searchResponse;
    } catch (e) {
      throw e;
    }
  }

  return fetch;
}
