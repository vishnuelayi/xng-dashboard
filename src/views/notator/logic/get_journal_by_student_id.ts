import { SessionResponse, StudentJournal } from "../../../session-sdk";
import { placeholderForFutureLogErrorText } from "../../../temp/errorText";

export function getJournalByStudentID(session: SessionResponse, studentID: string): StudentJournal {
  const journal = session.studentJournalList?.find((journal) => {
    return journal.student?.id === studentID;
  });

  if (!journal) throw new Error(placeholderForFutureLogErrorText);
  else return journal;
}
