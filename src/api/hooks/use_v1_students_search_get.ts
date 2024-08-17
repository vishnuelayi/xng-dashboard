import { selectClientID } from "../../context/slices/loggedInClientSlice";
import { selectStateInUS } from "../../context/slices/stateInUsSlice";
import { useXNGSelector } from "../../context/store";
import { GetCaseloadStudentsResponse } from "../../profile-sdk";
import { placeholderForFutureLogErrorText } from "../../temp/errorText";
import { API_STUDENTS } from "../api";

export function useV1StudentsSearchGet() {
  const stateInUS = useXNGSelector(selectStateInUS);
  const clientID = useXNGSelector(selectClientID);

  async function fetch(input: string): Promise<GetCaseloadStudentsResponse> {
    if (!clientID) throw new Error(placeholderForFutureLogErrorText);

    const searchResponse = await API_STUDENTS.v1StudentsSearchGet(clientID, input, stateInUS);

    return searchResponse;
  }

  return fetch;
}
