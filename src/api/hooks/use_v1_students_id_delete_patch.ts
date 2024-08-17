import { useXNGSelector } from "../../context/store";
import { API_STUDENTS } from "../api";
import { selectStateInUS } from "../../context/slices/stateInUsSlice";
import { selectClientID } from "../../context/slices/loggedInClientSlice";

export function useV1StudentsIdDeletePatch() {
  const stateInUs = useXNGSelector(selectStateInUS);
  const clientID = useXNGSelector(selectClientID);

  async function patch(id: string) {
    const _res = await API_STUDENTS.v1StudentsIdDeletePatch(id, clientID!, stateInUs);

    return _res;
  }

  return patch;
}
