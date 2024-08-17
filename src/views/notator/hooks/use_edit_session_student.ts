import { SessionResponse, StudentJournal } from "../../../session-sdk";
import { NotatorTools } from "../tools";
import { EditDraftStudentFunctionType } from "../tools/types";

export interface NotatorStudentTools {
  draftStudent: StudentJournal;
  editDraftStudent: EditDraftStudentFunctionType;
}

export default function useNotatorStudentTools(props: {
  notatorTools: NotatorTools;
  indexOverride?: number;
}): NotatorStudentTools {
  function editDraftStudent(path: string, newValue: any, cb?: () => void): SessionResponse {
    const freshSession = props.notatorTools.editDraft(
      `studentJournalList.${
        props.indexOverride || props.notatorTools.selectedStudentIndex
      }.${path}`,
      newValue,
      cb,
    );

    return freshSession;
  }
  const draftStudent =
    props.notatorTools.draftSession.studentJournalList![
      props.indexOverride || props.notatorTools.selectedStudentIndex
    ];
  if (draftStudent === undefined) throw new Error();

  return { draftStudent, editDraftStudent };
}
