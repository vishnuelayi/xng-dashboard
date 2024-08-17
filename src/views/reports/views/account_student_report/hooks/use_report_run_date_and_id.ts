import { API_ACCOUNT_STUDENTS } from "../../../../../api/api";
import { useXNGSelector } from "../../../../../context/store";
import { selectClientID } from "../../../../../context/slices/loggedInClientSlice";
import { useEffect, useState } from "react";
import { ReportRunDateAndID } from "../report_run_date_and_id";
import { placeholderForFutureLogErrorText } from "../../../../../temp/errorText";

export function useReportRunDateAndID(props: { includeInactive: boolean }) {
  const clientId = useXNGSelector(selectClientID);
  const [reportRunDateAndID, setReportRunDateAndID] = useState<ReportRunDateAndID | null>(null);
  const { includeInactive } = props;

  useEffect(() => {
    fetchAndSetReportRunDateAndID();

    async function fetchAndSetReportRunDateAndID() {
      const { reportRunDate, reportRunId } =
        await API_ACCOUNT_STUDENTS.v1StudentReportsAccountStudentsQueueReportPost({
          queueAccountStudentReportPostRequest: {
            filterParameters: {
              searchText: null,
              includeInactive,
              clientId,
            },
          },
        });

      if (!(reportRunDate && reportRunId)) throw new Error(placeholderForFutureLogErrorText);

      setReportRunDateAndID({ date: reportRunDate, id: reportRunId });
    }
  }, []);

  return reportRunDateAndID;
}
