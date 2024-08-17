import { API_ACCOUNT_STUDENTS } from "../../../../../api/api";
import { useXNGSelector } from "../../../../../context/store";
import { ReportRunDateAndID } from "../report_run_date_and_id";
import { selectStateInUS } from "../../../../../context/slices/stateInUsSlice";
import { useReportingPollRequest } from "../../../hooks/use_polling_mechanism";
import { useEffect, useMemo } from "react";
import { ACCOUNT_STUDENT_REPORT_STATEINUS_FALLTHROUGH } from "../account_student_report";
import { getUserTimeZone } from "../../../../../utils/timeZones";

export function useCSVPollRequestByState(props: { reportRunDateAndID: ReportRunDateAndID | null }) {
  const { reportRunDateAndID } = props;
  const stateInUS = useXNGSelector(selectStateInUS);
  const timeZone = getUserTimeZone();

  // Makes sure the timeZoneId matches with the stateInUS if a user is logged in to an account from out of state
  const adjustedTimeZoneId =
    stateInUS === "TX"
      ? timeZone !== "America/Chicago"
        ? "America/Chicago"
        : timeZone
      : timeZone !== "America/New_York"
      ? "America/New_York"
      : timeZone;

  const params = {
    getAccountStudentReportCsvPostRequest: {
      reportRunId: reportRunDateAndID?.id,
      reportRunDate: reportRunDateAndID?.date,
      timeZoneId: adjustedTimeZoneId,
    },
  };

  const CSVPoll = useReportingPollRequest({
    mutationFn: () =>
      API_ACCOUNT_STUDENTS.v1StudentReportsAccountStudentsDownloadCSVPostRaw(params),
    mutationKey: ["v1StudentReportsAccountStudentsDownloadCSVPostRaw"],
  });

  const CSVPollRequest = useMemo(() => {
    switch (stateInUS) {
      case "TX":
        return CSVPoll;
      case "NH":
        return CSVPoll;
      default:
        throw new Error(ACCOUNT_STUDENT_REPORT_STATEINUS_FALLTHROUGH);
    }
  }, [params]);

  return CSVPollRequest;
}
