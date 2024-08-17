import { useEffect, useState } from "react";
import { SessionResponse, StudentJournal } from "../../../session-sdk";
import { NotatorTabStatuses, ValidatedSessionV2, ValidatedStudent } from "./_types";
import { validateStudentTabs } from "./validate_tabs";
import { validateStudent } from "./validate_student";
import useTabRequirementStatuses from "./use_tab_requirement_statuses";
import { NotatorSection } from "../../../profile-sdk";

export default function useValidatedSession(
  editedSession: SessionResponse,
  notatorSections: NotatorSection[] | null,
): ValidatedSessionV2 | null {
  const tabRequirementStatuses = useTabRequirementStatuses(notatorSections);

  const [validatedSession, setValidatedSession] = useState<ValidatedSessionV2 | null>(null);

  function validateSession() {
    if (!(editedSession && editedSession.studentJournalList)) return;

    const res: ValidatedSessionV2 = editedSession.studentJournalList.map((studentJournal, i) => {
      return getValidatedStudent({
        i,
        studentJournal,
        tabRequirementStatuses,
      });
    });

    setValidatedSession(res);
  }

  // ------ LISTENERS ------
  useEffect(() => {
    validateSession();
  }, [editedSession, tabRequirementStatuses]);

  return validatedSession;
}

function getValidatedStudent(props: {
  studentJournal: StudentJournal;
  tabRequirementStatuses: NotatorTabStatuses;
  i: number;
}): ValidatedStudent {
  const { studentJournal, tabRequirementStatuses, i } = props;

  const validatedTabs = validateStudentTabs(studentJournal);

  const studentIsAbsent = !studentJournal.studentAttendanceRecord!.present!;

  // We'll short-circuit if the student is absent, otherwise, run validation logic as normal.
  const studentIsValid = studentIsAbsent || validateStudent(validatedTabs, tabRequirementStatuses);

  return { studentIndex: i, valid: studentIsValid, validatedTabs: validatedTabs };
}
