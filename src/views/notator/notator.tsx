import SessionMetadataEditor from "./components/session_metadata";
import Box from "../../design/components-dev/BoxExtended";
import XNGBack from "../../design/low-level/button_back";
import UserFeedback from "./components/user_feedback";
import XNGSpinner from "../../design/low-level/spinner";
import usePalette from "../../hooks/usePalette";
import ProgressTabs from "./components/progress_tabs";
import { FormLabel } from "@mui/material";
import XNGButton from "../../design/low-level/button";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import VerticalTabs from "../../design/low-level/tabs_vertical";
import getCanPostSessionBasedOnTime from "../../utils/getCanPostSessionBasedOnTime";
import useNotatorLifecycleHooks from "./hooks/lifecycle";
import ElectronicSignatureConstants from "../../constants/ElectronicSignatureConstants";
import BlockNavigationModal from "../../design/modal_templates/block_navigation_modal/block_navigation_modal";
import localStorageKeys from "../../constants/localStorageKeys";
import { useState } from "react";
import { useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { getSizing } from "../../design/sizing";
import { RoleBasedActions } from "./components/role_based_actions";
import { placeholderForFutureLogErrorText } from "../../temp/errorText";
import { XNGIconRenderer, XNGICONS } from "../../design/icons";
import { API_SESSIONS } from "../../api/api";
import { useXNGDispatch, useXNGSelector } from "../../context/store";
import { selectStateInUS } from "../../context/slices/stateInUsSlice";
import { selectLoggedInClientAssignment, selectUser } from "../../context/slices/userProfileSlice";
import {
  selectClientID,
  selectServiceProviderProfile,
} from "../../context/slices/loggedInClientSlice";
import { FutureTabs, NotatorTab } from "./types/types";
import { Typography, CircularProgress, Link } from "@mui/material";
import { StudentRef } from "../../profile-sdk";
import { XNGMenu, XNGMenuAnchorBox } from "../../design/components-dev/xng_menu";
import { XNGStandardTab } from "../../design/types/xngStandardTab";
import { ACTION_SetAttendanceState } from "../../context/slices/studentDocumentationSlice";
import { useNotatorTools } from "./tools";
import { EditSessionSeriesModal } from "../scheduler/edit_session_series_modal";
import { ProviderPresentModal } from "./modals/provider_present";
import { DeleteSessionModal } from "../modals/delete_session";
import XNGRadioGroup from "../../design/low-level/radio_group";
import {
  PatchSessionStatusRequest,
  SessionStatus,
  AddStudentToSessionRequest,
  PatchSessionApprovalRequest,
  SessionResponse,
} from "../../session-sdk";
import {
  selectDataEntryProvider,
  selectActingServiceProvider,
} from "../../context/slices/dataEntryProvider";
import {
  convertNotatorValidationSummaryV2toV1,
  NotatorValidationSummaryV1,
} from "./temp/validation_v1";
import { ValidatedSessionV2 } from "./validation/_types";
import NotatorTabViewport from "./layouts/tab_viewport";
import { SessionNotesModal } from "./modals/session_notes";
import { PostErrorModal } from "./modals/post_error_modal";
import StudentJournalList from "./components/student_journal_list";
import { unpostedSessionsActions } from "../../context/slices/unpostedSessionsSlice";
import { ROUTES_XLOGS } from "../../constants/URLs";
import AllStudentsLayout from "./layouts/all_students_layout/all_students_layout";
import useBreakpointHelper from "../../design/hooks/use_breakpoint_helper";
import { getUserTimeZone } from "../../utils/timeZones";
import { useBypassUnsavedChanges } from "./hooks/use_on_before_bypass";
import { SessionEllipsisMenu } from "../../components/session_ellipsis_menu";

const CURRENT_SESSION_KEY = localStorageKeys.CURRENT_SESSION_KEY;
dayjs.extend(utc);

function Notator() {
  // ---- HOOKS ----
  const palette = usePalette();
  const navigate = useNavigate();
  const { sessionID } = useParams();

  // ---- STATES ----
  const [showProviderModal, setShowProviderModal] = useState<boolean>(false);
  const [showPostErrorModal, setShowPostErrorModal] = useState<boolean>(false);
  const [showSessionNotes, setShowSessionNotes] = useState<boolean>(false);
  const [applyFutureOld, setApplyFutureOld] = useState<Array<FutureTabs[]>>([
    [{ section: 1, include: false }],
  ]);
  const [ellipsisMenuOpen, setEllipsisMenuOpen] = useState<boolean>(false);
  const [ellipsisAnchorEl, setEllipsisAnchorEl] = useState<HTMLElement | null>(null);
  const [isDeleteSessionModalOpen, setIsDeleteSessionModalOpen] = useState<boolean>(false);
  const [isEditSessionSeriesModalOpen, setIsEditSessionSeriesModalOpen] = useState<boolean>(false);
  const { bypass, bypassUnsavedChanges } = useBypassUnsavedChanges({
    onBeforeBypass: () => setIsDirty(false),
  });

  const [isMobileScreen, setIsMobileScreen] = useState<boolean>(true);

  // Ultimately, we may consider only declaring the constant `notatorTools` as opposed to destructuring the properties.
  // The reason that we both declare the constant and then destructure its properties is because most of the notator was
  // written to reference these properties before they were relocated into the useNotatorTools hook; so it's purely for
  // compatibility and so as not to alter too much code for our V1 notator refactor.
  const notatorTools = useNotatorTools();
  const {
    draftSession,
    editDraft,
    setDraftSession,
    session,
    setSession,
    selectedStudentIndex,
    setSelectedStudentIndex,
    isDirty,
    setIsDirty,
    saveSession: _saveSession,
    isSaveSpinnerActive,
    studentCaseload,
    defaultCareProvisions,
    viewportTabSelection,
    onChangeTab,
    notatorSections,
    validatedSession,
    softRefreshSwitch,
    setSoftRefreshSwitch,
    setIsSaveSpinnerActive,
    toggleApplyEditsToFutureSessions,
    setExemptedStudentsFromEditsForFutureSessions,
  } = notatorTools;

  const saveSession = async (freshSession: SessionResponse) => {
    const res = await _saveSession(freshSession);

    if (freshSession.seriesId && sessionID === "null") {
      bypassUnsavedChanges();

      navigate(
        {
          pathname: `${ROUTES_XLOGS.notator}/${res.id!}`,
          search: location.search,
        },
        {
          replace: true,
        },
      );
    }

    return res;
  };

  /**
   The current design of the notator heavily relies on `validation`, an object that uses an outdated schema.
   Our goal is to transition exclusively to `ValidatedSessionV2`. As an interim solution, we're mapping the
   new schema to the old one. This enables the existing code to function as we incrementally phase out the
   old schema in future updates. We as front-end developers should aim to complete this transition in our
   future changes to the notator code, with even one reference at a time where possible being sufficient and
   not overwhelming for PR review.
 */
  const validation: NotatorValidationSummaryV1 = convertNotatorValidationSummaryV2toV1(
    validatedSession ?? ({} as ValidatedSessionV2),
  );

  // ---- LIFECYCLE HOOKS ----
  useNotatorLifecycleHooks({
    dependencies: { session },
    actions: { setEditedSession: setDraftSession },
  });

  // ---- SELECTORS ----
  const stateInUS = useXNGSelector(selectStateInUS);
  const user = useXNGSelector(selectUser);
  const loggedInClientId = useXNGSelector(selectClientID);
  const userClientAssignment = useXNGSelector(selectLoggedInClientAssignment);
  const dataEntryProvider = useXNGSelector(selectDataEntryProvider);
  const actingServiceProvider = useXNGSelector(selectActingServiceProvider);
  const serviceProviderProfile = useXNGSelector(selectServiceProviderProfile);

  const location = useLocation();

  window.onbeforeunload = function () {
    if (localStorage.getItem(CURRENT_SESSION_KEY) !== JSON.stringify(draftSession)) {
      setIsDirty(true);
    }
    if (isDirty) {
      return "";
    }
  };

  const dispatch = useXNGDispatch();

  // ---- DATABASE / API ----
  async function undoPost() {
    if (session.id === undefined) throw Error(placeholderForFutureLogErrorText);
    session.status = 1;
    session.sessionJournal!.providerAttendanceRecord!.reasonAbsent = undefined;
    session.sessionJournal!.providerAttendanceRecord!.present = true;
    await API_SESSIONS.v1SessionsPut(stateInUS, draftSession);
    dispatch(unpostedSessionsActions.triggerRefetchUnpostedSessions());
    navigate("/xlogs/calendar");
  }

  async function signSession(savedSessionResponse?: SessionResponse) {
    let ip = "";
    const isActingAsProxy =
      userClientAssignment.serviceProviderProfile?.id !== actingServiceProvider?.id;

    const offset = dayjs().toDate().getTimezoneOffset() / 60;
    const electronicSignaturePatch: PatchSessionApprovalRequest = {
      currentUser: {
        id: user?.id,
        firstName: user?.firstName,
        lastName: user?.lastName,
        emailAddress: user?.emailAddress,
      },
      currentUserServiceProvider: {
        id: userClientAssignment.serviceProviderProfile?.id,
        firstName: userClientAssignment.serviceProviderProfile?.firstName,
        lastName: userClientAssignment.serviceProviderProfile?.lastName,
      },
      electronicSignature: {
        statementType: 3,
        isSigned: true,
        signedOnDateLocal: dayjs()
          .hour(dayjs().hour() - offset)
          .toDate(),
        signedOnDateUtc: dayjs().toDate(),
        signedByFullName: user?.firstName + " " + user?.lastName, //TODO: This should be the name the provider typed in the electronic signature input field
        objectId: user?.id, //TODO: This should be the Azure B2C OID provided by msal
        documentText: ElectronicSignatureConstants.DOCUMENT_TEXT, // This should be the text displayed in the modal when they signed the e signature
        requestIpAddress: ip, // The current Ip address of the provider
      },
      isAutonomous: userClientAssignment.isAutonomous,
      isApprover: userClientAssignment.isApprover,
      isActingAsProxy: isActingAsProxy,
    };
    const session = savedSessionResponse || draftSession;

    const sessionResponse = await API_SESSIONS.v1SessionsIdUpdateSessionElectronicSignaturePatch(
      session.id!,
      session?.serviceProvider?.id!,
      stateInUS,
      electronicSignaturePatch,
    );
    setDraftSession(sessionResponse);
  }

  async function saveAddStudentToSession(students: StudentRef[]) {
    if (session.id === undefined) throw Error(placeholderForFutureLogErrorText);

    const sessionWithNewIDIfAny = await saveSession(draftSession);

    const requestBody: AddStudentToSessionRequest = {
      id: sessionWithNewIDIfAny.id!,
      clientId: loggedInClientId,
      studentIds: students.map((student) => student.id!),
      serviceArea: session.service?.area,
      serviceProviderId: session.serviceProvider?.id,
      seriesId: session.seriesId,
      sessionDate: session.meetingDetails?.date,
      timezone: getUserTimeZone(),
    };
    const studentAddedSession = await API_SESSIONS.v1SessionsAddStudentPatch(
      stateInUS,
      requestBody,
    );
    setSession({ ...studentAddedSession });
    addApplyObject(studentAddedSession.studentJournalList?.length);
    localStorage.setItem(CURRENT_SESSION_KEY, JSON.stringify(studentAddedSession));
  }

  async function postSession() {
    if (session.id === undefined) throw Error(placeholderForFutureLogErrorText);
    let saveSessionSeriesResponse: SessionResponse | undefined;

    if (session.seriesId) {
      saveSessionSeriesResponse = await saveSession(draftSession);
      await signSession(saveSessionSeriesResponse);
    } else {
      await saveSession(draftSession);
      await signSession();
    }

    // If user is acting as a proxy on behalf of another service provider:
    let userIsAllowedToPost = true;
    if (dataEntryProvider) {
      // Check if the user has been granted access to post in the dataEntryProvider's account
      userIsAllowedToPost =
        userClientAssignment.appointingServiceProviders?.find(
          (ap) => ap.id === dataEntryProvider.id,
        )?.hasGrantedAccessToPost ?? false;
    }

    if (
      validation?.validStudentIndexes.length !== session.studentJournalList?.length &&
      userIsAllowedToPost
    ) {
      setShowPostErrorModal(true);
      return;
    }
    const serviceProviderId = session.serviceProvider?.id;
    const patchSessionStatusPosted: PatchSessionStatusRequest = {
      status: SessionStatus.NUMBER_4,
    };

    const id = saveSessionSeriesResponse
      ? saveSessionSeriesResponse?.id
      : session.id ?? draftSession.id;

    await API_SESSIONS.v1SessionsIdUpdateSessionStatusPatch(
      id!,
      serviceProviderId!,
      stateInUS,
      patchSessionStatusPosted,
    );
    dispatch(unpostedSessionsActions.triggerRefetchUnpostedSessions());
    dispatch(
      unpostedSessionsActions.setSelectedUnpostedSessionsFilterSessionIndex({ incrementValue: 1 }),
    );
    setTimeout(() => {
      dispatch(unpostedSessionsActions.setSelectedUnpostedSessionsFilter({ filter: {} }));
    }, 1000);
    bypassUnsavedChanges();
    if (!location.pathname.includes("unposted-sessions")) navigate("/xlogs/calendar");
  }
  async function requestRevisions(revisionsNote: string) {
    if (session.id === undefined) throw Error(placeholderForFutureLogErrorText);
    const savedSession = await saveSession(draftSession);
    await signSession();
    const serviceProviderId = session.serviceProvider?.id;
    const patchSessionStatusRevisionsRequested: PatchSessionStatusRequest = {
      status: SessionStatus.NUMBER_3,
      revisionsNote: {
        serviceProviderRequestingRevisions: {
          id: serviceProviderId,
          lastName: session.serviceProvider?.lastName,
          firstName: session.serviceProvider?.firstName,
        }, //TODO: get service Provider once they're cached on the page.
        note: revisionsNote,
      },
    };

    await API_SESSIONS.v1SessionsIdUpdateSessionStatusPatch(
      savedSession?.id ?? "",
      serviceProviderId!,
      stateInUS,
      patchSessionStatusRevisionsRequested,
    );

    navigate("/xlogs/calendar");
  }
  async function submitSession() {
    if (session.id === undefined) throw Error(placeholderForFutureLogErrorText);

    const savedSession = await saveSession(draftSession);
    await signSession(savedSession);
    const serviceProviderId = session.serviceProvider?.id ?? "";
    const patchSessionStatusAwaitingApproval: PatchSessionStatusRequest = {
      status: SessionStatus.NUMBER_2,
      revisionsNote: {
        serviceProviderRequestingRevisions: {
          id: serviceProviderId,
          lastName: user?.lastName,
          firstName: user?.firstName,
        },
        note: "Done",
      },
    };

    await API_SESSIONS.v1SessionsIdUpdateSessionStatusPatch(
      draftSession?.id ?? "",
      serviceProviderId,
      stateInUS,
      patchSessionStatusAwaitingApproval,
    );
    dispatch(unpostedSessionsActions.triggerRefetchUnpostedSessions());
    dispatch(
      unpostedSessionsActions.setSelectedUnpostedSessionsFilterSessionIndex({ incrementValue: 1 }),
    );
    setTimeout(() => {
      dispatch(unpostedSessionsActions.setSelectedUnpostedSessionsFilter({ filter: {} }));
    }, 1000);
    bypassUnsavedChanges();
    if (!location.pathname.includes("unposted-sessions")) navigate("/xlogs/calendar");
  }

  async function deleteSession() {
    if (session.id === undefined) throw Error(placeholderForFutureLogErrorText);
    const serviceProviderId = session.serviceProvider?.id;
    await API_SESSIONS.v1SessionsDelete(
      serviceProviderId!,
      stateInUS,
      session.id,
      session.seriesId,
      session.meetingDetails?.date
        ? new Date(session.meetingDetails?.date)
        : session.meetingDetails?.date,
    );
    dispatch(unpostedSessionsActions.triggerRefetchUnpostedSessions());
    navigate("/xlogs/calendar");
  }

  async function deleteMultipleSessions(idsToDelete: string[], datesToDelete: string[]) {
    let deleteRequests = idsToDelete.join(", ");
    let datesRequests = datesToDelete.join(", ");
    if (session.seriesId === undefined) throw Error(placeholderForFutureLogErrorText);
    const serviceProviderId = session.serviceProvider?.id;
    const seriesId = session.seriesId;
    const deleteResponse = await API_SESSIONS.v1SessionsDeleteManyDeleteDelete(
      serviceProviderId!,
      stateInUS,
      deleteRequests,
      datesRequests,
      seriesId,
    );
    dispatch(unpostedSessionsActions.triggerRefetchUnpostedSessions());
    navigate("/xlogs/calendar");
  }

  async function deleteSeries() {
    if (session.seriesId === undefined) throw Error(placeholderForFutureLogErrorText);
    const serviceProviderId = session.serviceProvider?.id;
    const deleteResponse = await API_SESSIONS.v1SessionsDeleteRecurringSessionDelete(
      session.seriesId,
      serviceProviderId!,
      stateInUS,
    );
    dispatch(unpostedSessionsActions.triggerRefetchUnpostedSessions());
    navigate("/xlogs/calendar");
  }

  useEffect(() => {
    return () => {
      localStorage.removeItem(CURRENT_SESSION_KEY);
    };
  }, []);

  // ---- VALIDATION SYSTEM ----

  function requestTab(requestedTab: NotatorTab) {
    if (
      validation?.validTabsByStudentIndex[selectedStudentIndex].includes(
        viewportTabSelection.current,
      )
    ) {
      onChangeTab(requestedTab);
    } else {
      onChangeTab(requestedTab);
      // setPrevSelectedTab(selectedTab);
      // setSelectedTab(requestedTab);
    }
  }

  function addApplyObject(newJournalLength: number | undefined) {
    if (newJournalLength === undefined) throw Error(placeholderForFutureLogErrorText);
    if (applyFutureOld.length < newJournalLength) {
      for (let i = applyFutureOld.length; i < newJournalLength; i++) {
        let addArray: FutureTabs[] = [];
        for (let x = 0; notatorSections.length > x; x++) {
          if (notatorSections[x].sectionName === 1) {
            addArray.push({ section: 1, include: false });
          }
          if (notatorSections[x].sectionName === 2) {
            addArray.push({ section: 2, include: false });
          }
          if (notatorSections[x].sectionName === 3) {
            addArray.push({ section: 3, include: false });
          }
          if (notatorSections[x].sectionName === 4) {
            addArray.push({ section: 4, include: false });
          }
          if (notatorSections[x].sectionName === 6) {
            addArray.push({ section: 6, include: false });
          }
        }
        setApplyFutureOld([...applyFutureOld, addArray]);
      }
    }
  }

  function setApplyObject() {
    let allArrays: FutureTabs[][] = [];
    for (let i = 0; i < session.studentJournalList?.length!; i++) {
      let setArray: FutureTabs[] = [];
      for (let x = 0; notatorSections.length > x; x++) {
        if (notatorSections[x].sectionName === 1) {
          setArray.push({ section: 1, include: false });
        }
        if (notatorSections[x].sectionName === 2) {
          setArray.push({ section: 2, include: false });
        }
        if (notatorSections[x].sectionName === 3) {
          setArray.push({ section: 3, include: false });
        }
        if (notatorSections[x].sectionName === 4) {
          setArray.push({ section: 4, include: false });
        }
        if (notatorSections[x].sectionName === 6) {
          setArray.push({ section: 6, include: false });
        }
      }
      allArrays.push([...setArray]);
    }
    setApplyFutureOld([...allArrays]);
  }

  useEffect(() => {
    setApplyObject();
  }, [notatorSections]);

  // ---- `onAction` Handlers ----
  function handleNextTab() {
    const currentTabIndex = notatorSections.findIndex(
      (notatorSection) =>
        notatorSection.sectionName?.toString() === viewportTabSelection.current.toString(),
    );
    const nextTab =
      notatorSections[currentTabIndex + 1 === notatorSections.length ? 0 : currentTabIndex + 1]
        .sectionName;
    onChangeTab(nextTab as Number as NotatorTab);
  }

  function handleViewChange() {
    setSelectedStudentIndex(0);
    toggleApplyEditsToFutureSessions(false);
    setExemptedStudentsFromEditsForFutureSessions({});
  }

  // ---- DOM HIERARCHY ----
  return (
    <>
      {/* load until all Notator state is initialized */}
      {session.studentJournalList === undefined ||
      draftSession.studentJournalList === undefined ||
      applyFutureOld.length < 1 ||
      draftSession.studentJournalList.length === 0 ||
      validation?.validStudentIndexes?.length === undefined ? (
        <XNGSpinner fullPage />
      ) : (
        <Box sx={{ overflow: "hidden", position: "relative", height: "100%" }}>
          {/* MODALS, OVERLAYS */}
          <Box
            sx={{
              position: "absolute",
              bottom: 0,
              right: "5rem",
              display: "flex",
              alignItems: "center",
              gap: "1rem",
              boxShadow: 1,
              border: "1px solid " + palette.contrasts[3],
              padding: "1rem",
              borderTopLeftRadius: "8px",
              borderTopRightRadius: "8px",
              transform: `translateY(${isSaveSpinnerActive ? "0%" : "100%"})`,
              transition: "transform .1s ease-in-out",
              zIndex: 10,
              bgcolor: palette.contrasts[5],
            }}
          >
            <CircularProgress size="1rem" color="primary" />
            <Typography className="noselect" variant="body1">
              Saving...
            </Typography>
          </Box>
          <BlockNavigationModal
            dirty={isDirty}
            editedSession={draftSession}
            session={session}
            setIsDirty={setIsDirty}
            bypass={bypass}
            confirmAction={() => saveSession(draftSession)}
          />
          {/* Ellipse Menu  */}
          <SessionEllipsisMenu
            open={ellipsisMenuOpen}
            anchorEl={ellipsisAnchorEl}
            onClose={() => setEllipsisMenuOpen(false)}
            onEditSessionSeriesClick={() => setIsEditSessionSeriesModalOpen(true)}
            onDeleteSessionClick={() => setIsDeleteSessionModalOpen(true)}
            contentDependencies={{
              sessionIsRecurring: Boolean(session.seriesId),
              isUsersOwnSession: session.serviceProvider?.id! === serviceProviderProfile?.id!,
            }}
          />
          <DeleteSessionModal
            setDeleteSession={setIsDeleteSessionModalOpen}
            showDeleteSession={isDeleteSessionModalOpen}
            deleteSession={deleteSession}
            deleteMultipleSessions={deleteMultipleSessions}
            deleteSeries={deleteSeries}
            seriesId={session.seriesId}
            providerId={session.serviceProvider?.id}
            state={stateInUS}
          />
          <EditSessionSeriesModal
            open={isEditSessionSeriesModalOpen}
            startDate={draftSession.meetingDetails?.startTime!}
            endDate={draftSession.meetingDetails?.endTime!}
            onClose={() => setIsEditSessionSeriesModalOpen(false)}
            editedSession={draftSession}
            studentList={draftSession.studentJournalList?.map(
              (journal) => journal.student as StudentRef,
            )}
            onRequestRefreshSessions={() => {
              setIsSaveSpinnerActive(true);
              setSoftRefreshSwitch(!softRefreshSwitch);
            }}
          />

          <SessionNotesModal
            setShowSessionNotes={setShowSessionNotes}
            showSessionNotes={showSessionNotes}
            editedSession={draftSession}
            sessionNotes={session.sessionJournal?.narrative}
            editSession={editDraft}
          />
          <ProviderPresentModal
            editedSession={draftSession}
            editSession={editDraft}
            setShowProviderModal={setShowProviderModal}
            showProviderModal={showProviderModal}
            bypassUnsavedChanges={bypassUnsavedChanges}
          />
          <PostErrorModal
            setShowPostModal={setShowPostErrorModal}
            showPostModal={showPostErrorModal}
            validStudentIndexes={validation.validStudentIndexes}
            validTabsByStudentIndex={validation.validTabsByStudentIndex}
            studentJournalList={session.studentJournalList}
            selectedStudentIndex={selectedStudentIndex}
            editedSession={draftSession}
            onSetSelectedStudentIndex={(v: number) => setSelectedStudentIndex(v)}
            setSelectedTab={(t: NotatorTab) => onChangeTab(t)}
            allStudentView={isMobileScreen}
          />

          {/* DOM HIERARCHY */}
          <Box sx={{ position: "sticky", left: 0 }}>
            <Box
              name="header-ellipses-and-back-button"
              sx={{
                display: "flex",
                justifyContent: "space-between",
                paddingX: getSizing(4),
                paddingBottom: getSizing(1),
                "& .MuiTypography-root": {
                  color: "white",
                },
              }}
              bgcolor={palette.primary[1]}
              color={"white"}
            >
              <Box sx={{ display: "flex", paddingTop: getSizing(2) }}>
                <XNGBack
                  color="white"
                  onClick={() => {
                    navigate(-1);
                    dispatch(
                      ACTION_SetAttendanceState({
                        attendance: "present",
                        index: selectedStudentIndex,
                      }),
                    );
                  }}
                />
              </Box>

              <Box sx={{ display: "flex", paddingTop: getSizing(2), width: getSizing(50) }}>
                <XNGButton
                  fullWidth
                  // disabled={draftSession.status === 4}
                  variant="outline"
                  color={"white"}
                  sx={{
                    "& .MuiTypography-root": {
                      color: "unset",
                    },
                    color: isMobileScreen ? "#206A7E" : "grey",
                    bgcolor: isMobileScreen ? "white" : "#E0E0E0",
                    borderRadius: "unset",
                  }}
                  onClick={() => {
                    setIsMobileScreen(true);
                    handleViewChange();
                  }}
                >
                  All Student View
                </XNGButton>
                <XNGButton
                  fullWidth
                  variant="outline"
                  color={"white"}
                  // disabled={draftSession.status === 4}
                  onClick={() => {
                    setIsMobileScreen(false);
                    handleViewChange();
                  }}
                  sx={{
                    "& .MuiTypography-root": {
                      color: "unset",
                    },
                    color: isMobileScreen ? "grey" : "#206A7E",
                    bgcolor: isMobileScreen ? "#E0E0E0" : "white",
                    borderRadius: "unset",
                  }}
                >
                  Documentation View
                </XNGButton>
              </Box>

              <Box
                sx={{
                  display: "flex",
                  paddingX: getSizing(2),
                  paddingTop: getSizing(2),
                }}
              >
                {session.status !== 4 && session.status !== 5 && (
                  <XNGMenuAnchorBox
                    onClickSetAnchorEl={(el) => setEllipsisAnchorEl(el)}
                    onClickSetOpen={() => setEllipsisMenuOpen(true)}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: getSizing(1),
                      cursor: "pointer",
                      padding: getSizing(1),
                    }}
                  >
                    <XNGIconRenderer size="lg" i={<XNGICONS.Ellipse />} color="white" />
                  </XNGMenuAnchorBox>
                )}
              </Box>
            </Box>
            <Box
              sx={{
                display: "flex",
                paddingBottom: getSizing(3),
                justifyContent: "space-between",
              }}
              bgcolor={palette.primary[1]}
              color={"white"}
            >
              <SessionMetadataEditor editedSession={draftSession} saveSession={saveSession} />
              <Box sx={{ width: "100%" }}>
                {session.status === 0 || session.status === 1 ? null : (
                  <UserFeedback session={session} />
                )}
              </Box>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  minWidth: "fit-content",
                  maxWidth: getSizing(22),
                  marginRight: getSizing(5),
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "flex-end",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      gap: getSizing(2),
                      minWidth: getSizing(22),
                    }}
                  >
                    <RoleBasedActions
                      onSave={() => saveSession(draftSession)}
                      postSession={postSession}
                      submitSession={submitSession}
                      requestRevisions={requestRevisions}
                      undoPost={undoPost}
                      sessionStatus={draftSession.status}
                      valid={
                        validation?.validStudentIndexes.length !==
                          session.studentJournalList?.length ||
                        !getCanPostSessionBasedOnTime(draftSession).canPost
                      }
                      setShowPostModal={setShowPostErrorModal}
                      sessionServiceProvider={draftSession.serviceProvider!}
                      editedSession={draftSession}
                    />
                    <XNGButton
                      fullWidth
                      variant="outline"
                      color="white"
                      onClick={() => {
                        setShowSessionNotes(true);
                      }}
                    >
                      Session Notes
                    </XNGButton>
                  </Box>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: getSizing(2),
                    minWidth: "fit-content",
                  }}
                >
                  <XNGRadioGroup
                    value={
                      draftSession.sessionJournal?.providerAttendanceRecord?.reasonAbsent === null
                        ? "yes"
                        : "no"
                    }
                    onChange={() => {
                      if (
                        draftSession.sessionJournal?.providerAttendanceRecord?.reasonAbsent !== null
                      ) {
                        editDraft(`sessionJournal.providerAttendanceRecord.reasonAbsent`, null);
                        if (
                          draftSession.sessionJournal?.providerAttendanceRecord?.present === false
                        ) {
                          editDraft(`sessionJournal.providerAttendanceRecord.present`, true);
                          saveSession(draftSession);
                        }
                      } else {
                        setShowProviderModal(true);
                      }
                    }}
                    sx={{ flexDirection: "row" }}
                    formLabel={
                      draftSession.sessionJournal?.providerAttendanceRecord?.present &&
                      !draftSession.sessionJournal?.providerAttendanceRecord?.reasonAbsent ? (
                        <FormLabel
                          id="demo-radio-buttons-group-label"
                          sx={{ minWidth: "fit-content", pt: 1, color: "white" }}
                        >
                          Provider Present
                        </FormLabel>
                      ) : (
                        <FormLabel
                          id="demo-radio-buttons-group-label"
                          sx={{ minWidth: "fit-content", pt: 1, color: "white" }}
                        >
                          <Link
                            href="#0"
                            onClick={() => setShowProviderModal(true)}
                            color="#FFF"
                            sx={{ textDecorationColor: "white" }}
                          >
                            Provider Present
                          </Link>
                        </FormLabel>
                      )
                    }
                    radioSx={{
                      "&.Mui-checked": {
                        color: "white",
                      },
                    }}
                    options={["Yes", "No"]}
                    values={["yes", "no"]}
                    disabled={draftSession.status && draftSession.status > 1}
                  />
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: getSizing(2),
                    minWidth: "fit-content",
                  }}
                >
                  <XNGRadioGroup
                    value={draftSession.meetingDetails?.makeUpSession ? "yes" : "no"}
                    onChange={(e) => {
                      editDraft(
                        "meetingDetails.makeUpSession",
                        e.target.value === "yes" ? true : false,
                      );
                    }}
                    sx={{ flexDirection: "row" }}
                    formLabel={
                      <FormLabel
                        id="demo-radio-buttons-group-label"
                        sx={{ minWidth: "fit-content", pt: 1, color: "white" }}
                      >
                        Make Up session
                      </FormLabel>
                    }
                    radioSx={{
                      "&.Mui-checked": {
                        color: "white",
                      },
                    }}
                    options={["Yes", "No"]}
                    values={["yes", "no"]}
                    disabled={draftSession.status && draftSession.status > 1}
                  />
                </Box>
              </Box>
            </Box>
          </Box>
          {isMobileScreen ? (
            <AllStudentsLayout
              studentCaseLoadList={studentCaseload!}
              notatorTools={notatorTools}
              studentJournalList={session.studentJournalList}
              editDraftSession={editDraft}
              draftSession={draftSession}
              applyFuture={applyFutureOld}
              setApplyFuture={setApplyFutureOld}
              defaultCareProvisions={defaultCareProvisions!}
            >
              <StudentJournalList
                studentCaseLoadList={studentCaseload!}
                editedSession={draftSession}
                saveSession={saveSession}
                saveAddStudentToSession={saveAddStudentToSession}
                validStudentIndexes={validation.validStudentIndexes}
                studentJournalList={session.studentJournalList}
                editSession={editDraft}
                setSession={setSession}
                selectedStudentIndex={selectedStudentIndex}
                onSetSelectedStudentIndex={(v: number) => setSelectedStudentIndex(v)}
                setSelectedTab={(t: NotatorTab) => onChangeTab(t)}
                applyFuture={applyFutureOld}
                setApplyFuture={setApplyFutureOld}
                session={session}
                isAllStudentView={true}
              />
            </AllStudentsLayout>
          ) : (
            <Box
              sx={{
                display: "flex",
                height: "100%",
                // backgroundColor: sessionStatusColor,
                // `sessionStatusColor` was a React state that initialized to `undefined`, and was never subsequently
                // set to anything else. It has been removed as part of the V1 notator refactor. To make sure this CSS
                // still behaves the way it did, I've hardcoded it to use `undefined` directly.
                backgroundColor: undefined,
                position: "relative",
              }}
            >
              <Box
                name="overlay"
                sx={{
                  display: isSaveSpinnerActive ? "block" : "none",
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  bgcolor: "rgba(0, 0, 0, 0.2)",
                  zIndex: 5,
                }}
              />

              <Box
                name="student journal list container"
                sx={{
                  borderRight: "2px solid " + palette.contrasts[4],
                  height: "100%",
                  width: "min-content",
                  paddingRight: getSizing(3),
                  paddingTop: getSizing(4),
                }}
              >
                <StudentJournalList
                  studentCaseLoadList={studentCaseload!}
                  editedSession={draftSession}
                  saveSession={saveSession}
                  saveAddStudentToSession={saveAddStudentToSession}
                  validStudentIndexes={validation.validStudentIndexes}
                  studentJournalList={session.studentJournalList}
                  editSession={editDraft}
                  setSession={setSession}
                  selectedStudentIndex={selectedStudentIndex}
                  onSetSelectedStudentIndex={(v: number) => setSelectedStudentIndex(v)}
                  setSelectedTab={(t: NotatorTab) => onChangeTab(t)}
                  applyFuture={applyFutureOld}
                  setApplyFuture={setApplyFutureOld}
                  session={session}
                />
              </Box>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  height: "100%",
                  width: "100%",
                  paddingLeft: getSizing(4),
                  paddingTop: getSizing(2),
                  overflowX: "auto",
                }}
              >
                <ProgressTabs
                  selectedTab={viewportTabSelection.current}
                  onSetRequestedTab={(v: NotatorTab) => requestTab(v)}
                  validation={validation}
                  selectedStudentIndex={selectedStudentIndex}
                  editedSession={draftSession}
                />
                <NotatorTabViewport
                  selectedTab={viewportTabSelection.current}
                  applyFuture={applyFutureOld}
                  setApplyFuture={setApplyFutureOld}
                  onNext={() => handleNextTab()}
                  onSave={() => saveSession(draftSession)}
                  defaultCareProvisions={defaultCareProvisions!}
                />
              </Box>
            </Box>
          )}
        </Box>
      )}
    </>
  );
}

export default Notator;
