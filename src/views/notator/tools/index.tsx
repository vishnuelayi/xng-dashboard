import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { AddStudentToSessionRequest, SessionResponse, StudentJournal } from "../../../session-sdk";
import { NotatorTab, NotatorTabSelection as NotatorViewportTabSelection } from "../types/types";
import { useXNGDispatch, useXNGSelector } from "../../../context/store";
import { selectStateInUS } from "../../../context/slices/stateInUsSlice";
import { API_SERVICEPROVIDERS, API_SESSIONS, API_STATESNAPSHOTS } from "../../../api/api";
import { placeholderForFutureLogErrorText } from "../../../temp/errorText";
import localStorageKeys from "../../../constants/localStorageKeys";
import dayjs from "dayjs";
import { DefaultCareProvisionsResponse, NotatorSection, StudentRef } from "../../../profile-sdk";
import { selectLoggedInClientAssignment } from "../../../context/slices/userProfileSlice";
import { selectClientID } from "../../../context/slices/loggedInClientSlice";
import { providerNotFoundErrorActions } from "../../../context/slices/providerNotFoundErrorSlice";
import useValidatedSession from "../validation/use_validated_session";
import { ValidatedSessionV2 } from "../validation/_types";
import useFetchNotatorSections from "../../../api/hooks/notator_sections";
import {
  AdaptedSession,
  EditDraftFunctionType,
  ExemptedStudentsFromEditsForFutureSessionsType,
} from "./types";
import { SaveSessionFunctionType, useRequestSaveSession } from "./use_request_save_session";
import { SessionStatus } from "../../../session-sdk";
import { useLocation, useNavigate } from "react-router";
import { ROUTES_XLOGS } from "../../../constants/URLs";
import { getUserTimeZone } from "../../../utils/timeZones";
import { produce } from "immer";

const CURRENT_SESSION_KEY = localStorageKeys.CURRENT_SESSION_KEY;

export interface NotatorTools {
  readOnly?: boolean;
  draftSession: SessionResponse;
  editDraft: EditDraftFunctionType;
  // Phase out setDraftSession, replace with a module that only provides a readonly draftSession and editDraft function
  setDraftSession: React.Dispatch<React.SetStateAction<SessionResponse>>;
  session: SessionResponse;
  setSession: React.Dispatch<React.SetStateAction<SessionResponse>>;
  softRefreshSwitch: boolean;
  setSoftRefreshSwitch: React.Dispatch<React.SetStateAction<boolean>>;
  setIsSaveSpinnerActive: React.Dispatch<React.SetStateAction<boolean>>;
  selectedStudentIndex: number;
  setSelectedStudentIndex: React.Dispatch<React.SetStateAction<number>>;
  applyEditsToFutureSessions: boolean;
  toggleApplyEditsToFutureSessions: (bool?: boolean) => void;
  handleToggleApplyEditsToFutureSessions: (
    studentJournalList: StudentJournal[],
    view: "allStudents" | "documentation",
    index?: number,
  ) => void;
  isSaveSpinnerActive: boolean;
  saveSession: SaveSessionFunctionType;
  isDirty: boolean;
  setIsDirty: React.Dispatch<React.SetStateAction<boolean>>;
  defaultCareProvisions: DefaultCareProvisionsResponse | undefined;
  viewportTabSelection: NotatorViewportTabSelection;
  onChangeTab: (newTab: NotatorTab) => void;
  notatorSections: NotatorSection[];
  validatedSession: ValidatedSessionV2 | null;
  adaptedDraftSession: AdaptedSession;
  studentCaseload: StudentRef[] | undefined;
  addStudentRefsToSession: (students: StudentRef[]) => Promise<void>;
  exemptedStudentsFromEditsForFutureSessions: ExemptedStudentsFromEditsForFutureSessionsType;
  setExemptedStudentsFromEditsForFutureSessions: React.Dispatch<
    React.SetStateAction<ExemptedStudentsFromEditsForFutureSessionsType>
  >;
}

// Ultimately want this to only require editedSession, editSession
const SessionContext = createContext<NotatorTools | undefined>(undefined);

/**
 * TODO: Separate the states into separate modules using custom hooks.
 */
export function NotatorToolsProvider(props: { children: React.ReactNode }) {
  const [draftSession, setDraftSession] = useState<SessionResponse>({} as SessionResponse);
  const [selectedStudentIndex, setSelectedStudentIndex] = useState<number>(0);
  const [session, setSession] = useState<SessionResponse>({} as SessionResponse);
  const [isSaveSpinnerActive, setIsSaveSpinnerActive] = useState<boolean>(false);
  // This will repopulate `session` and `draftSession`, essentially performing a soft refesh of the notator screen.
  const [softRefreshSwitch, setSoftRefreshSwitch] = useState<boolean>(false);
  const [isDirty, setIsDirty] = useState<boolean>(false);
  const [defaultCareProvisions, setDefaultCareProvisions] =
    useState<DefaultCareProvisionsResponse>();
  const [studentCaseload, setStudentCaseLoad] = useState<StudentRef[]>();
  // This is a temporary system, we will soon allow for the ability to toggle individual sections to save to the future.
  const [applyEditsToFutureSessions, setApplyEditsToFutureSessions] = useState<boolean>(false);
  // is this still necessary
  const [selectedTab, setSelectedTab] = useState<NotatorTab>(NotatorTab["Attendance"]);
  const [prevSelectedTab, setPrevSelectedTab] = useState<NotatorTab>(NotatorTab["Attendance"]);
  const [
    exemptedStudentsFromEditsForFutureSessions,
    setExemptedStudentsFromEditsForFutureSessions,
  ] = useState<ExemptedStudentsFromEditsForFutureSessionsType>({});

  const adaptedDraftSession: AdaptedSession = {
    isRecurring: () => Boolean(draftSession.seriesId),
  };

  const urlParams = new URLSearchParams(window.location.search);
  const requestedServiceProviderId = urlParams.get("serviceProviderId");
  const userClientAssignment = useXNGSelector(selectLoggedInClientAssignment);
  const requestedIsDecProvider =
    (userClientAssignment?.appointingServiceProviders?.findIndex(
      (sp) => sp.id === requestedServiceProviderId,
    ) ?? -1) >= 0;
  const requestedIsAssistant =
    (userClientAssignment?.supervisedServiceProviders?.findIndex(
      (sp) => sp.id === requestedServiceProviderId,
    ) ?? -1) >= 0;
  const requestedIsSelf =
    userClientAssignment?.serviceProviderProfile?.id === requestedServiceProviderId;
  const isEditable = (status: number) => {
    if (
      status === SessionStatus.NUMBER_0 ||
      status === SessionStatus.NUMBER_1 ||
      status === SessionStatus.NUMBER_3
    )
      return true;
    return false;
  };
  const readOnly = draftSession.status
    ? !isEditable(draftSession.status) || (!requestedIsSelf && !requestedIsDecProvider)
    : undefined;

  function actingProviderId(requestedServiceProviderId: string): string {
    if (requestedIsAssistant || requestedIsDecProvider || requestedIsSelf) {
      return requestedServiceProviderId;
    } else {
      throw new Error("Not authorized to view this session");
    }
  }
  const actingServiceProviderId = actingProviderId(requestedServiceProviderId!);

  async function fetchAndSetSession(
    sessionID: string | undefined,
    seriesId: string | null,
    date: Date | null,
  ) {
    const serviceProviderId = actingServiceProviderId;
    if (!serviceProviderId) throw new Error(placeholderForFutureLogErrorText);
    let convertedSeriesId = seriesId === "null" ? undefined : seriesId?.toString();
    let convertedDate = undefined;
    let convertedSessionId = sessionID === "null" ? undefined : sessionID;

    if (date !== null) {
      convertedDate = date;
    }
    const sessionResponse = await API_SESSIONS.v1SessionsGet(
      serviceProviderId,
      stateInUS,
      convertedSessionId,
      convertedSeriesId,
      convertedDate,
      getUserTimeZone(),
    );
    // In the future we should be able to handle a session with no students to start.
    // if (sessionResponse.studentJournalList![0].student?.id === undefined)
    //   throw new Error(placeholderForFutureLogErrorText);
    if (sessionResponse.service?.area?.id && sessionResponse.service?.type?.id) {
      await fetchAndSetDefaultCareProvisions(
        sessionResponse.service?.area?.id,
        sessionResponse.service?.type.id,
      );
    }
    async function fetchAndSetDefaultCareProvisions(serviceAreaId: string, serviceTypeId: string) {
      const sessionDate = dayjs(draftSession.meetingDetails?.startTime).toDate();
      const defaultCareProvisionsResponse =
        await API_STATESNAPSHOTS.v1StateSnapshotsByDateDefaultCareProvisionsGet(
          serviceTypeId,
          serviceAreaId,
          stateInUS,
          sessionDate,
        );
      setDefaultCareProvisions(defaultCareProvisionsResponse);
    }

    // if (sessionResponse.status === 4 || sessionResponse.status === 5) {
    //   setSessionStatusColor("#00000030");
    // } else {
    //   setSessionStatusColor(undefined);
    // }
    setSession(sessionResponse);
    let temp = Object.assign(sessionResponse, {});
    temp.studentJournalList?.forEach((student, i) => {
      if (
        temp.studentJournalList?.[i].studentAttendanceRecord?.arrivalTime === null &&
        student.studentAttendanceRecord &&
        student.studentAttendanceRecord.arrivalTime === null
      ) {
        student.studentAttendanceRecord!.arrivalTime = temp.meetingDetails?.startTime;
      }
      if (
        temp.studentJournalList?.[i].studentAttendanceRecord?.departureTime === null &&
        student.studentAttendanceRecord &&
        student.studentAttendanceRecord.departureTime === null
      ) {
        student.studentAttendanceRecord!.departureTime = temp.meetingDetails?.endTime;
      }
    });
    localStorage.setItem(CURRENT_SESSION_KEY, JSON.stringify(temp));
  }

  useEffect(() => {
    initializeNotator();
  }, [softRefreshSwitch]);

  const dispatch = useXNGDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  async function initializeNotator() {
    const pathname = window.location.pathname;
    const sessionID = pathname.substring(pathname.lastIndexOf("/") + 1);
    const searchParams = new URLSearchParams(window.location.search);
    const seriesId = searchParams.get("seriesId");
    const date = searchParams.get("date");
    const parsedDate = dayjs(date);

    await fetchAndSetSession(sessionID, seriesId, parsedDate.toDate());
    await fetchAndSetStudentCaseload();
    setIsSaveSpinnerActive(false); // in case this is fired due to change in refreshNotatorTrigger
  }

  const loggedInClientId = useXNGSelector(selectClientID);

  async function fetchAndSetStudentCaseload() {
    if (!userClientAssignment.serviceProviderProfile?.id || !loggedInClientId)
      throw new Error(placeholderForFutureLogErrorText);

    try {
      const serviceProviderProfile = await API_SERVICEPROVIDERS.v1ServiceProvidersIdGet(
        actingServiceProviderId!,
        loggedInClientId,
        stateInUS,
      );

      const res = serviceProviderProfile.studentCaseload;
      if (!res) throw new Error(placeholderForFutureLogErrorText);

      setStudentCaseLoad(res);
    } catch (err) {
      dispatch(
        providerNotFoundErrorActions.ACTION_ShowProviderNotFound({
          show: true,
          errorMsg: (err as Error).message,
        }),
      );
    }
  }

  const setEditedSessionCallback = useCallbackOnUpdate(draftSession);

  /**
   * Edits a draft session's deep properties while avoiding React lifecycle issues.
   *
   * This function is designed to modify nested properties within the session state object.
   * It creates a deep copy of the session to safely apply updates, thereby eliminating
   * the potential for lifecycle-related bugs that could arise from conventional state mutation.
   *
   * @param propertyPath Specifies the nested property to update. Uses dot notation to traverse the session object.
   * @param updatedValue The new value to set for the specified property.
   * @param cb Optional callback function. USE THIS IF YOU NEED TO SAVE THE SESSION AFTER EDITING (to avoid save issues)!
   *
   * @returns The updated session object, providing immediate access to the most
   * recent state andthus bypassing the asynchronous nature of state updates.
   */
  function editDraft(path: string, newValue: any, cb?: () => void): SessionResponse {
    if (cb) {
      setEditedSessionCallback(cb);
    }

    const pathArray = path.split(".");
    const deepCopy = JSON.parse(JSON.stringify(draftSession)) as SessionResponse;
    let currentObject: any = deepCopy;

    for (let i = 0; i < pathArray.length - 1; i++) {
      currentObject = currentObject[pathArray[i]];
    }
    currentObject[pathArray[pathArray.length - 1]] = newValue;

    setDraftSession(deepCopy);

    return deepCopy; /* Returns the most recent version of the session. Useful when immediate 
    access to the updated session is required, bypassing the asynchronous nature of state updates. */
  }

  function toggleApplyEditsToFutureSessions(bool?: boolean) {
    if (bool !== undefined) {
      setApplyEditsToFutureSessions(bool);
    } else {
      setApplyEditsToFutureSessions(!applyEditsToFutureSessions);
    }
  }

  // HACK
  /**
   * This intercepts data before it gets passed to API_SESSIONS.v1SessionsUpdateSessionToFutureSessionsPost
   * because that API call does not account for only some students in a session having their edits apply to future sessions.
   * This function will set exemptedStudentsFromEditsForFutureSessions to to student journals
   * that have not been edited (so the journals from notatorTools.session, not draftSesssion). This allows us to not touch session or draftSession directly
   * In the future, if individual notator sections (Activities, accommodations etc.,) are requested by users to be
   * able to apply edits per section per student for future sessions, we should think about refactoring this.
   */
  function handleToggleApplyEditsToFutureSessions(
    studentJournalList: StudentJournal[],
    view: "allStudents" | "documentation",
    index?: number,
  ) {
    if (view === "documentation") {
      if (applyEditsToFutureSessions) {
        setApplyEditsToFutureSessions(false);
        const newState: ExemptedStudentsFromEditsForFutureSessionsType = {};
        studentJournalList.forEach((journal, index) => {
          newState[index] = journal;
        });
        setExemptedStudentsFromEditsForFutureSessions(newState);
      } else {
        setApplyEditsToFutureSessions(true);
        setExemptedStudentsFromEditsForFutureSessions({});
      }
    } else {
      let newState: ExemptedStudentsFromEditsForFutureSessionsType = {};
      if (Object.keys(exemptedStudentsFromEditsForFutureSessions).includes(index!.toString())) {
        newState = Object.assign(newState, exemptedStudentsFromEditsForFutureSessions);
        delete newState[index!.toString()];
        setExemptedStudentsFromEditsForFutureSessions(newState);
      } else {
        newState = Object.assign(newState, exemptedStudentsFromEditsForFutureSessions, {
          [`${index}`]: studentJournalList[index!],
        });
        setExemptedStudentsFromEditsForFutureSessions(newState);
      }
      toggleApplyEditsToFutureSessions(
        Object.keys(newState).length !== studentJournalList.length ? true : false,
      );
    }
  }

  const stateInUS = useXNGSelector(selectStateInUS);

  const requestSaveSession = useRequestSaveSession({
    adaptedDraftSession,
    applyEditsToFutureSessions,
    exemptedStudentsFromEditsForFutureSessions,
    session,
    draftSession,
    stateInUS,
    onRequestStart: () => setIsSaveSpinnerActive(true),
    onRequestSettled: () => setIsSaveSpinnerActive(false),
  });

  /**
   * This is the only function that should ever be responsible for session saving.
   *
   * @param freshSession Requires developer to pass in the most recently available version of session to avoid
   * asynchronous lifecycle issues.
   * @returns The freshest version of SessionResponse in the instance of immediate subsequent actions.
   */
  async function saveSession(freshSession: SessionResponse): Promise<SessionResponse> {
    if (freshSession.studentJournalList) {
      freshSession = applyCareProvisionLedgerSchemaVersion(freshSession);
    }

    const sessionResponse = await requestSaveSession(freshSession);

    setIsDirty(false);
    localStorage.setItem(CURRENT_SESSION_KEY, JSON.stringify(sessionResponse));
    setSoftRefreshSwitch(!softRefreshSwitch);

    /**
      TODO: Ask Paul to clarify the necessity of versioning to use as the description of this JSDoc comment
     */
    function applyCareProvisionLedgerSchemaVersion(_freshSession: SessionResponse) {
      const VERSION_NUMBER = 2;

      const versionedSession = produce(
        _freshSession,
        (sesh) =>
          sesh.studentJournalList?.forEach((sj) => {
            if (sj.careProvisionLedger) {
              sj.careProvisionLedger.versionNumber = VERSION_NUMBER;
            }
          }),
      );

      return versionedSession;
    }
    return sessionResponse;
  }

  const viewportTabSelection = { current: selectedTab, previous: prevSelectedTab };
  function onChangeTab(newTab: NotatorTab) {
    setPrevSelectedTab(selectedTab);
    setSelectedTab(newTab);
  }

  // ---- Non-breaking console errors ----
  if (draftSession.studentJournalList?.length === 0) {
    console.warn("Students not initialized, Notator will not fully load");
  }

  const notatorSections = useFetchNotatorSections(session) ?? [];
  const validatedSession = useValidatedSession(draftSession, notatorSections);

  async function handleAddingStudentRefsToSession(students: StudentRef[]) {
    requestSaveSession(draftSession).then((newSession) => {
      // Refresh after saving
      navigate(
        {
          pathname: `${ROUTES_XLOGS.notator}/${newSession.id}`,
          search: location.search,
        },
        {
          replace: true,
        },
      );
    });

    const requestBody: AddStudentToSessionRequest = {
      id: session.id,
      clientId: loggedInClientId!,
      studentIds: students.map((student) => student.id!),
      serviceArea: session.service!.area,
      serviceProviderId: session.serviceProvider!.id,
      seriesId: session.seriesId,
      sessionDate: session.meetingDetails!.date,
      timezone: getUserTimeZone(),
    };

    await API_SESSIONS.v1SessionsAddStudentPatch(stateInUS, requestBody);

    setSoftRefreshSwitch(!softRefreshSwitch);
  }

  return (
    <SessionContext.Provider
      value={{
        readOnly,
        draftSession,
        editDraft,
        setDraftSession,
        session,
        setSession,
        softRefreshSwitch,
        selectedStudentIndex,
        setSelectedStudentIndex,
        applyEditsToFutureSessions,
        toggleApplyEditsToFutureSessions,
        handleToggleApplyEditsToFutureSessions,
        saveSession,
        isDirty,
        setIsDirty,
        isSaveSpinnerActive,
        studentCaseload,
        defaultCareProvisions,
        viewportTabSelection,
        onChangeTab,
        notatorSections,
        validatedSession,
        adaptedDraftSession,
        addStudentRefsToSession: handleAddingStudentRefsToSession,
        setSoftRefreshSwitch,
        setIsSaveSpinnerActive,
        exemptedStudentsFromEditsForFutureSessions,
        setExemptedStudentsFromEditsForFutureSessions,
      }}
    >
      {props.children}
    </SessionContext.Provider>
  );
}

export function useNotatorTools() {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error("useNotatorTools must be used within a NotatorToolsProvider");
  }
  return context;
}

function useCallbackOnUpdate(dependency: any) {
  const [cb, setCallback] = useState<() => void | undefined>();

  useEffect(() => {
    if (typeof cb === "function") {
      cb();
      setCallback(undefined);
    }
  }, [dependency]);

  return setCallback; // This just sets the state, should not invoke the callback
}
