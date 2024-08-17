import { PageParameters } from "@xng/reporting";
import { useXNGSelector } from "../../../../../context/store";
import { ReportRunDateAndID } from "../report_run_date_and_id";
import { selectStateInUS } from "../../../../../context/slices/stateInUsSlice";
import { useReportingPollRequest } from "../../../hooks/use_polling_mechanism";
import { API_ACCOUNT_STUDENTS } from "../../../../../api/api";
import { useEffect, useMemo } from "react";
import { ACCOUNT_STUDENT_REPORT_STATEINUS_FALLTHROUGH } from "../account_student_report";

export function usePollRequestByState(props: {
  reportRunDateAndID: ReportRunDateAndID | null;
  pageParameters: PageParameters;
}) {
  const { reportRunDateAndID, pageParameters } = props;
  const stateInUS = useXNGSelector(selectStateInUS);

  const params = {
    getAccountStudentReportPostRequest: {
      pageParameters,
      reportRunDate: reportRunDateAndID?.date,
      reportRunId: reportRunDateAndID?.id,
    },
  };

  const txPoll = useReportingPollRequest({
    mutationFn: () =>
      API_ACCOUNT_STUDENTS.v1StudentReportsAccountStudentsGetReportTexasUIPostRaw(params),
    mutationKey: ["v1StudentReportsAccountStudentsGetReportTexasUIPostRaw"],
  });

  const nhPoll = useReportingPollRequest({
    mutationFn: () =>
      API_ACCOUNT_STUDENTS.v1StudentReportsAccountStudentsGetReportNewHampshireUIPostRaw(params),
    mutationKey: ["v1StudentReportsAccountStudentsGetReportNewHampshireUIPostRaw"],
  });

  const pollRequest = useMemo(() => {
    switch (stateInUS) {
      case "TX":
        return txPoll;
      case "NH":
        return nhPoll;
      default:
        throw new Error(ACCOUNT_STUDENT_REPORT_STATEINUS_FALLTHROUGH);
    }
  }, [params]);

  return pollRequest;
}
