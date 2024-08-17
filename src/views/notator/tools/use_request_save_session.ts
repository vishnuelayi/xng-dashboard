import { API_SESSIONS } from "../../../api/api";
import {
  SessionResponse,
  UpdateSessionToFutureSessionsInSeriesRequest,
} from "../../../session-sdk";
import { placeholderForFutureLogErrorText } from "../../../temp/errorText";
import { getUserTimeZone } from "../../../utils/timeZones";
import { AdaptedSession, ExemptedStudentsFromEditsForFutureSessionsType } from "./types";
import { produce } from "immer";

/**
 * @returns The session, particularly for the session ID. This is used for virtualized sessions
 * that have not physically occurred yet, as virtualized sessions *do not* have an ID by default
 * for data optimization purposes.
 */
export type SaveSessionFunctionType = (draftSession: SessionResponse) => Promise<SessionResponse>;

type UseRequestSaveSessionProps = {
  adaptedDraftSession: AdaptedSession;
  applyEditsToFutureSessions: boolean;
  exemptedStudentsFromEditsForFutureSessions: ExemptedStudentsFromEditsForFutureSessionsType;
  draftSession: SessionResponse;
  session: SessionResponse;
  stateInUS: string;
  onRequestStart: () => void;
  onRequestSettled: () => void;
};

/**
 * Provides the save function for the notator. It will execute one of two requests based
 * on if the "apply all edits to future" switch is toggled or not.
 *
 * TERMINOLOGY:
 * `session` = The readonly session that represents the last saved session
 * `draftSession` = The mutable session objects that represents the user's latest possibly unsaved changes
 */
export function useRequestSaveSession(props: UseRequestSaveSessionProps): SaveSessionFunctionType {
  const { stateInUS } = props;

  async function requestSaveSession(draftSession: SessionResponse): Promise<SessionResponse> {
    let response: SessionResponse | null = null;

    validateSessionId(draftSession);

    props.onRequestStart();

    // TECH DEBT: Have only of these two calls call. Currently we call `v1SessionsPut`
    // unconditionally only to get a session ID. This is heavy-handed. We could have the
    // `v1SessionsUpdateSessionToFutureSessionsPost` return a usable ID once creating a real
    // instance of a virtualized session.
    const res = await API_SESSIONS.v1SessionsPut(stateInUS, draftSession);
    response = res!;

    if (props.applyEditsToFutureSessions) {
      await saveAllStudentEditsToFuture(props, res);
    }

    props.onRequestSettled();
    return response;
  }

  return requestSaveSession;
}

/**
 * TODO: Explore this more. I've moved the previous logic over to this function that
 * *appears* to exempt certain students from saving to the future, but after some
 * experience testing, it's implied that the notator's UX is designed to save all
 * student data to the future.
 *
 * Therefore it's possilbe that some of this logic towards 'exemptions' aren't
 * actually impacting the save logic and can be removed.
 */
async function saveAllStudentEditsToFuture(
  props: UseRequestSaveSessionProps,
  res: SessionResponse,
) {
  const { draftSession, session, stateInUS } = props;

  let updatedBody: UpdateSessionToFutureSessionsInSeriesRequest;

  if (props.exemptedStudentsFromEditsForFutureSessions) {
    const updatedStudentJournals = getUpdatedStudentJournals(
      res,
      props.exemptedStudentsFromEditsForFutureSessions,
    );
    updatedBody = {
      currentSession: produce({ ...res }, (body) => {
        body.studentJournalList = updatedStudentJournals;
      }),
      timeZone: getUserTimeZone(),
    };
  } else {
    updatedBody = {
      currentSession: JSON.parse(JSON.stringify(session)),
      timeZone: getUserTimeZone(),
    };
    updateGoalInventories(updatedBody.currentSession!, draftSession);
  }

  // Apply edits to all future sessions in the series
  await API_SESSIONS.v1SessionsUpdateSessionToFutureSessionsPost(updatedBody, stateInUS);
}

/**
 * Function to check if the session has a valid ID
 *
 * Steven 5/7/24: The context for why this was added was never documented. We should
 * document this here once we know or remove it if unnecessary.
 */
function validateSessionId(session: SessionResponse) {
  if (session.id === undefined) {
    throw new Error(placeholderForFutureLogErrorText);
  }
}

/**
 * Function to handle student journal exemptions
 */
function getUpdatedStudentJournals(
  savedSession: SessionResponse,
  exemptedStudents: ExemptedStudentsFromEditsForFutureSessionsType,
) {
  const exemptedIndices = Object.keys(exemptedStudents);
  return savedSession.studentJournalList?.map((journal, index) =>
    exemptedIndices.includes(index.toString()) ? exemptedStudents[index.toString()] : journal,
  );
}

/**
 * Function to update the goal inventories for all student journals
 */
function updateGoalInventories(originalSession: SessionResponse, updatedSession: SessionResponse) {
  originalSession.studentJournalList!.forEach((journal) => {
    const matchingJournal = updatedSession.studentJournalList!.find(
      (s) => s.student?.id === journal.student?.id,
    );
    if (matchingJournal) {
      journal.goalInventory = matchingJournal.goalInventory;
    }
  });
}
