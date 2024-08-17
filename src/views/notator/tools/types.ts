import { SessionResponse, StudentJournal } from "../../../session-sdk";

export interface AdaptedSession {
  isRecurring: () => boolean;
}

export type EditDraftFunctionType = (
  path: string,
  newValue: any,
  cb?: () => void,
) => SessionResponse;

// We want the student and session editing types to share the same structure, but differentiate between their aliases
// for intuitive code.
export type EditDraftStudentFunctionType = EditDraftFunctionType;

// This type will contain student journals who are *NOT* having their edits apply to future sessions
// This is an object with keys corresponding to student indexes in a StudentJournalList
export type ExemptedStudentsFromEditsForFutureSessionsType = {
  [key: string]: StudentJournal;
};
