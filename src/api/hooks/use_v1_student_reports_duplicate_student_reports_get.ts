import { useXNGSelector } from "../../context/store";
import { selectClientID } from "../../context/slices/loggedInClientSlice";
import { API_DUPLICATE_STUDENT_REPORTS } from "../api";

export function useV1StudentReportsDuplicateStudentReportsGet() {
  const clientId = useXNGSelector(selectClientID);

  async function fetch(maxRecords: number) {
    const _res = await API_DUPLICATE_STUDENT_REPORTS.v1StudentReportsDuplicateStudentReportsGet({
      clientId,
      maxRecords,
    });

    return _res;
  }

  return fetch;
}
