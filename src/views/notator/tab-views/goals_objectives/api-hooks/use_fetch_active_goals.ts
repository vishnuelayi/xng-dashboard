import { useEffect, useState } from "react";
import { GoalDisplay } from "../../../../../profile-sdk";
import dayjs from "dayjs";
import { API_STUDENTS } from "../../../../../api/api";
import { useXNGSelector } from "../../../../../context/store";
import { selectClientID } from "../../../../../context/slices/loggedInClientSlice";
import { selectStateInUS } from "../../../../../context/slices/stateInUsSlice";
import { useNotatorTools } from "../../../tools";
import useNotatorStudentTools from "../../../hooks/use_edit_session_student";

/**
 * This module has a known issue, see issue 1.1 in goals/objectives documentation in Confluence
 */
export function useFetchActiveGoals(props?: { indexOverride?: number }): GoalDisplay[] | null {
  const notatorTools = useNotatorTools();
  const studentTools = useNotatorStudentTools({
    notatorTools,
    indexOverride: props?.indexOverride,
  });

  const loggedInClientId = useXNGSelector(selectClientID);
  const usaState = useXNGSelector(selectStateInUS);

  const [allActiveGoalOptions, setAllActiveGoalOptions] = useState<GoalDisplay[] | null>(null);

  useEffect(() => {
    async function fetchAndSetStudentGoalList() {
      const studentId = studentTools.draftStudent.student!.id!;
      let sessionDate = dayjs(notatorTools.draftSession.meetingDetails!.date!).toDate();
      const response = await API_STUDENTS.v1StudentsIdActiveGoalsGet(
        studentId,
        loggedInClientId!,
        usaState,
        sessionDate,
      );
      setAllActiveGoalOptions(response.goals?.filter((goal) => goal.status !== "Inactive")!);
    }

    fetchAndSetStudentGoalList();
  }, [notatorTools.selectedStudentIndex]);

  return allActiveGoalOptions;
}
