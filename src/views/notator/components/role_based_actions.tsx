import { Dialog, Typography } from "@mui/material";
import React, { useState, useEffect } from "react";
import { XLogsRoleStrings } from "../../../context/types/xlogsrole";
import Box from "../../../design/components-dev/BoxExtended";
import XNGButton from "../../../design/low-level/button";
import XNGInput from "../../../design/low-level/input";
import { getSizing } from "../../../design/sizing";
import { useXNGSelector } from "../../../context/store";
import { ServiceProviderRef, SessionResponse, SessionStatus } from "../../../session-sdk";
import { placeholderForFutureLogErrorText } from "../../../temp/errorText";
import { XNGIconRenderer, XNGICONS } from "../../../design/icons";
import usePalette from "../../../hooks/usePalette";
import { Link } from "react-router-dom";
import { ROUTES_XLOGS } from "../../../constants/URLs";
import {
  selectLoggedInClientAssignment,
  selectUser,
} from "../../../context/slices/userProfileSlice";
import { selectClientID } from "../../../context/slices/loggedInClientSlice";
import ElectronicSignatureConstants from "../../../constants/ElectronicSignatureConstants";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { API_CLIENTS } from "../../../api/api";
import { selectStateInUS } from "../../../context/slices/stateInUsSlice";
import sessionStorageKeys from "../../../constants/sessionStorageKeys";
import { DualActionModal } from "../../../design/modal_templates/dual_action";
import { useNotatorTools } from "../tools";
import XNGCheckbox from "../../../design/low-level/checkbox";

dayjs.extend(utc);
interface IRoleBasedActions {
  requestRevisions: (note: string) => void; //This will need to be refactored to take in a revisions note later
  postSession: () => void;
  onSave: () => void;
  submitSession: () => void;
  undoPost: () => void;
  sessionStatus: SessionStatus | undefined;
  individualStudent?: boolean;
  valid?: boolean;
  setShowPostModal: React.Dispatch<React.SetStateAction<boolean>>;
  sessionServiceProvider: ServiceProviderRef;
  editedSession: SessionResponse;
}

const electronicSignatureKey = sessionStorageKeys.ALL_SESSIONS_ELECTRONIC_SIGNATURE_KEY;

export function RoleBasedActions(props: IRoleBasedActions) {
  let actingRole: XLogsRoleStrings;
  const loggedInClientAssignment = useXNGSelector(selectLoggedInClientAssignment);
  const currentUserIsAuthorOfSession =
    props.sessionServiceProvider.id === loggedInClientAssignment.serviceProviderProfile?.id;
  if (loggedInClientAssignment.isApprover) {
    if (currentUserIsAuthorOfSession) {
      // There should be no such thing as an assistant approver, so we can automatically determine that this is an autonomous provider.
      actingRole = "Service Provider - Autonomous";
    } else {
      actingRole = "Approver";
    }
  } else if (loggedInClientAssignment.isProxyDataEntry) {
    if (currentUserIsAuthorOfSession) {
      if (loggedInClientAssignment.isAutonomous) {
        actingRole = "Service Provider - Autonomous";
      } else {
        actingRole = "Service Provider - Assistant";
      }
    } else {
      // We will assume for now that proxies (data entry clerks) only ever document on behalf of autonomous service providers.
      actingRole = "Service Provider - Autonomous";
    }
  } else if (loggedInClientAssignment.isAutonomous) {
    actingRole = "Service Provider - Autonomous";
  } else {
    actingRole = "Service Provider - Assistant";
  }

  const [revisions, setRevisions] = useState<string>("");

  const { saveSession, draftSession: editedSession } = useNotatorTools();

  switch (actingRole) {
    case "Approver":
      return (
        <RoleBasedActionsLayout
          /* TODO: Create revisions note field and pass in the value */
          topLeftBtn={
            props.sessionStatus === 2
              ? {
                  text: "Revisions",
                  action: () => props.requestRevisions(revisions),
                }
              : {
                  text: "Save",
                  action: () => props.onSave(),
                }
          }
          topRightBtn={{ text: "Post", action: props.postSession }}
          undoTopRight={{ text: "Unpost", action: props.undoPost }}
          sessionStatus={props.sessionStatus}
          individualStudent={props.individualStudent}
          valid={props.valid}
          setShowPostModal={props.setShowPostModal}
          revisions={revisions}
          setRevisions={setRevisions}
          role={actingRole}
          onSave={() => saveSession(editedSession)}
          startTime={props.editedSession.meetingDetails?.startTime}
          isApprover={loggedInClientAssignment.isApprover}
        />
      );
    case "Service Provider - Assistant":
      return (
        <RoleBasedActionsLayout
          topLeftBtn={{ text: "Save", action: () => props.onSave() }}
          topRightBtn={{ text: "Submit", action: props.submitSession }}
          undoTopRight={{ text: "Unsubmit", action: props.undoPost }}
          sessionStatus={props.sessionStatus}
          individualStudent={props.individualStudent}
          valid={props.valid}
          setShowPostModal={props.setShowPostModal}
          role={actingRole}
          onSave={() => saveSession(editedSession)}
          startTime={props.editedSession.meetingDetails?.startTime}
          isApprover={loggedInClientAssignment.isApprover}
        />
      );
    case "Service Provider - Autonomous":
      return (
        <RoleBasedActionsLayout
          topLeftBtn={{ text: "Save", action: () => props.onSave() }}
          topRightBtn={{ text: "Post", action: props.postSession }}
          undoTopRight={{ text: "Unpost", action: props.undoPost }}
          sessionStatus={props.sessionStatus}
          individualStudent={props.individualStudent}
          valid={props.valid}
          setShowPostModal={props.setShowPostModal}
          role={actingRole}
          onSave={() => saveSession(editedSession)}
          startTime={props.editedSession.meetingDetails?.startTime}
          isApprover={loggedInClientAssignment.isApprover}
        />
      );
    default:
      return (
        <RoleBasedActionsLayout
          topLeftBtn={{ text: "Save", action: () => props.onSave() }}
          topRightBtn={{ text: "Post", action: props.postSession }}
          undoTopRight={{ text: "Unpost", action: props.undoPost }}
          sessionStatus={props.sessionStatus}
          individualStudent={props.individualStudent}
          setShowPostModal={props.setShowPostModal}
          role={actingRole}
          onSave={() => saveSession(editedSession)}
          startTime={props.editedSession.meetingDetails?.startTime}
          isApprover={loggedInClientAssignment.isApprover}
        />
      );
  }
}

type RoleBasedActionButton = { text: string; action: () => void };
function RoleBasedActionsLayout(props: {
  topLeftBtn: RoleBasedActionButton;
  topRightBtn: RoleBasedActionButton;
  undoTopRight: RoleBasedActionButton;
  sessionStatus: SessionStatus | undefined;
  individualStudent?: boolean;
  valid?: boolean;
  setShowPostModal: React.Dispatch<React.SetStateAction<boolean>>;
  revisions?: string;
  setRevisions?: React.Dispatch<React.SetStateAction<string>>;
  role: XLogsRoleStrings;
  onSave: () => void;
  startTime?: Date;
  isApprover: boolean | undefined;
}) {
  const loggedInClientAssignment = useXNGSelector(selectLoggedInClientAssignment);
  const { draftSession } = useNotatorTools();
  const [showSignatureModal, setShowSignatureModal] = useState<boolean>(false);
  const [showRevisionModal, setShowRevisionModal] = useState<boolean>(false);
  const [showWrongSignatureModal, setShowWrongSignatureModal] = useState<boolean>(false);
  const [showNonSchoolDaysModal, setShowNonSchoolDaysModal] = useState<boolean>(false);
  const [nonSchoolDay, setNonSchoolDay] = useState<string>("");
  const [checked, setChecked] = useState<boolean>(false);
  const [saveButtonDisabled, setSaveButtonDisabled] = useState(false);
  const [postButtonDisabled, setPostButtonDisabled] = useState(false);

  useEffect(() => {
    setSaveButtonDisabled(false);
  }, [props.sessionStatus]);

  const palette = usePalette();
  const state = useXNGSelector(selectStateInUS);
  const loggedInClientId = useXNGSelector(selectClientID);

  useEffect(() => {
    fetchAndSetNonSchoolDay();
    loggedInClientAssignment.appointingServiceProviders?.forEach((appointingServiceProvider) => {
      if (
        appointingServiceProvider.firstName === draftSession.serviceProvider?.firstName &&
        appointingServiceProvider.lastName === draftSession.serviceProvider?.lastName
      )
        setPostButtonDisabled(false);
    });
  }, []);

  async function fetchAndSetNonSchoolDay() {
    const nonSchoolDayResponse = await API_CLIENTS.v1ClientsIdNonSchoolDatesGet(
      loggedInClientId!,
      state,
    );
    const filteredNonSchoolDay = nonSchoolDayResponse.nonSchoolDays?.filter((day) => {
      // startTime is supposed to be a Date according to the api spec, but its actually a timestamp/string, so we cast it here
      let year = (day.startTime as unknown as string)?.slice(0, 10);
      return year === (props.startTime as unknown as string)?.slice(0, 10);
    });

    if (filteredNonSchoolDay && filteredNonSchoolDay.length > 0) {
      setNonSchoolDay(filteredNonSchoolDay[0].title!);
    }
  }

  const disablePostButtonAndCallNextAction = (func: () => void) => {
    setPostButtonDisabled(true);
    setSaveButtonDisabled(true);
    func();
  };

  const nonSchoolDayCheck = () => {
    if (nonSchoolDay) {
      setShowNonSchoolDaysModal(true);
      return;
    }

    props.valid
      ? props.setShowPostModal(true)
      : sessionStorage.getItem(electronicSignatureKey)
      ? disablePostButtonAndCallNextAction(props.topRightBtn.action)
      : setShowSignatureModal(true);
  };

  return (
    <>
      <DualActionModal
        open={showNonSchoolDaysModal}
        onClose={() => {
          setShowNonSchoolDaysModal(false);
          setPostButtonDisabled(false);
        }}
        onConfirm={() => {
          setShowNonSchoolDaysModal(false);
          props.valid
            ? props.setShowPostModal(true)
            : sessionStorage.getItem(electronicSignatureKey)
            ? props.topRightBtn.action()
            : setShowSignatureModal(true);
        }}
        onReject={() => {
          setShowNonSchoolDaysModal(false);
          setPostButtonDisabled(false);
        }}
        injectContent={{
          header: "Attention",
          body: (
            <Typography variant="body1">
              {/* update below value when backend work is done */}
              {`You are trying to Post a session that falls on a scheduled holiday: ${nonSchoolDay}. 
              Would you still like to post?`}
            </Typography>
          ),
          noText: "No",
          yesText: "Yes",
          icon: <XNGIconRenderer color={palette.danger[4]} size="2rem" i={<XNGICONS.Alert />} />,
          buttonStyles: {
            yesButton: {
              width: "102px",
              padding: "8px",
              borderRadius: "3px",
            },
            noButton: {
              width: "102px",
              padding: "8px",
              borderRadius: "3px",
              ":hover": {
                bgcolor: palette.danger[1],
                color: "white",
              },
              bgcolor: palette.danger[4],
              color: "white",
            },
          },
        }}
      />
      <Box sx={{ display: "flex", gap: getSizing(2) }}>
        {props.sessionStatus === 2 && props.role === "Approver" ? (
          <XNGButton
            fullWidth
            variant="outline"
            color={
              props.topLeftBtn.text.trim() === "Save"
                ? "white"
                : props.topLeftBtn.text.trim() === "Revisions"
                ? "error_outline"
                : "success"
            }
            onClick={() => {
              setShowRevisionModal(true);
              props.topLeftBtn.text.trim() === "Save" &&
                props.sessionStatus === 0 &&
                setSaveButtonDisabled(true);
            }}
            disabled={
              (props.sessionStatus === 4 && props.topLeftBtn.text.trim() === "Save") ||
              saveButtonDisabled
            }
          >
            {props.topLeftBtn.text}
          </XNGButton>
        ) : (
          <XNGButton
            fullWidth
            color={
              props.topLeftBtn.text.trim() === "Save"
                ? "white"
                : props.topLeftBtn.text.trim() === "Revisions"
                ? "error_outline"
                : "success"
            }
            variant="outline"
            onClick={() => {
              props.topLeftBtn.action();
              props.topLeftBtn.text.trim() === "Save" &&
                props.sessionStatus === 0 &&
                setSaveButtonDisabled(true);
            }}
            disabled={
              (props.sessionStatus === 4 && props.topLeftBtn.text.trim() === "Save") ||
              saveButtonDisabled
            }
          >
            {props.topLeftBtn.text}
          </XNGButton>
        )}
        {props.individualStudent ? null : (props.sessionStatus === SessionStatus.NUMBER_2 &&
            props.role === "Approver") ||
          (props.sessionStatus !== SessionStatus.NUMBER_2 &&
            props.sessionStatus !== SessionStatus.NUMBER_4 &&
            props.sessionStatus !== SessionStatus.NUMBER_5) ? (
          <XNGButton
            fullWidth
            color={
              props.topRightBtn.text === "Post"
                ? "success"
                : props.topRightBtn.text.trim() === "Unpost"
                ? "success_3"
                : "success"
            }
            disabled={postButtonDisabled}
            onClick={() => {
              nonSchoolDayCheck();
            }}
          >
            {props.topRightBtn.text}
          </XNGButton>
        ) : (
          <XNGButton
            fullWidth
            color={
              props.undoTopRight.text === "Post"
                ? "success"
                : props.undoTopRight.text.trim() === "Unpost"
                ? "success_3"
                : "success"
            }
            disabled={postButtonDisabled}
            onClick={() => {
              setPostButtonDisabled(true);
              props.undoTopRight.action();
            }}
          >
            {props.undoTopRight.text}
          </XNGButton>
        )}
        <ElectronicSignature
          setShowSignatureModal={setShowSignatureModal}
          showSignatureModal={showSignatureModal}
          setShowWrongSignatureModal={setShowWrongSignatureModal}
          checked={checked}
          setChecked={setChecked}
          topRightBtn={props.topRightBtn}
          setPostButtonDisabled={setPostButtonDisabled}
          setSaveButtonDisabled={setSaveButtonDisabled}
        />
        <RevisionsEditor
          setShowRevisionModal={setShowRevisionModal}
          showRevisionModal={showRevisionModal}
          topLeftBtn={props.topLeftBtn}
          revisions={props.revisions}
          setRevisions={props.setRevisions}
          setPostButtonDisabled={setPostButtonDisabled}
        />
        <WrongSignature
          setShowWrongSignatureModal={setShowWrongSignatureModal}
          showWrongSignatureModal={showWrongSignatureModal}
          setShowSignatureModal={setShowSignatureModal}
        />
      </Box>
    </>
  );
}

function ElectronicSignature(props: {
  setShowSignatureModal: React.Dispatch<React.SetStateAction<boolean>>;
  setShowWrongSignatureModal: React.Dispatch<React.SetStateAction<boolean>>;
  showSignatureModal: boolean;
  checked: boolean;
  setChecked: React.Dispatch<React.SetStateAction<boolean>>;
  topRightBtn: RoleBasedActionButton;
  setPostButtonDisabled: React.Dispatch<React.SetStateAction<boolean>>;
  setSaveButtonDisabled: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const user = useXNGSelector(selectUser);
  const [signValue, setSignValue] = useState<string>(
    sessionStorage.getItem(electronicSignatureKey) || "",
  );
  const [applySignatureToAllSessions, setApplySignatureToAllSessions] = useState(
    sessionStorage.getItem(electronicSignatureKey) ? true : false,
  );

  const handleDone = async () => {
    const signature = `${user?.firstName} ${user?.lastName}`;

    if (signature !== signValue.trim()) {
      props.setShowWrongSignatureModal(true);
      return;
    }

    if (applySignatureToAllSessions) {
      sessionStorage.setItem(electronicSignatureKey, signValue);
    }
    if (!applySignatureToAllSessions && sessionStorage.getItem(electronicSignatureKey)) {
      // this logic check should never happen but its here just in case
      sessionStorage.removeItem(electronicSignatureKey);
    }
    props.setSaveButtonDisabled(true);
    props.setPostButtonDisabled(true);
    props.topRightBtn.action();
  };

  return (
    <Dialog
      className="noselect"
      onClose={() => {
        props.setShowSignatureModal(false);
        props.setPostButtonDisabled(false);
      }}
      open={props.showSignatureModal}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: getSizing(2),
          paddingTop: getSizing(7),
          paddingX: getSizing(2),
        }}
      >
        <Typography variant="h6">Electronic Signature</Typography>
        <Typography variant="body1">{ElectronicSignatureConstants.DOCUMENT_TEXT}</Typography>
        <XNGInput
          placeholder="Full Name"
          onChange={(e) => {
            setSignValue(e.target.value);
          }}
          defaultValue={signValue}
        />
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <XNGCheckbox
            checked={applySignatureToAllSessions}
            onToggle={() => {
              setApplySignatureToAllSessions(!applySignatureToAllSessions);
            }}
          />
          <Typography variant="body1">
            Apply this electronic signature to all sessions until I log out.
          </Typography>
        </Box>
      </Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "End",
          paddingBottom: getSizing(4),
          paddingTop: getSizing(2),
          paddingRight: getSizing(3),
        }}
      >
        <XNGButton
          onClick={() => {
            handleDone();
            props.setShowSignatureModal(false);
          }}
        >
          Sign
        </XNGButton>
      </Box>
    </Dialog>
  );
}

function RevisionsEditor(props: {
  setShowRevisionModal: React.Dispatch<React.SetStateAction<boolean>>;
  showRevisionModal: boolean;
  topLeftBtn: RoleBasedActionButton;
  revisions: string | undefined;
  setRevisions: React.Dispatch<React.SetStateAction<string>> | undefined;
  setPostButtonDisabled: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const handleDone = () => {
    props.topLeftBtn.action();
  };
  return (
    <Dialog
      className="noselect"
      onClose={() => {
        props.setShowRevisionModal(false);
        props.setPostButtonDisabled(false);
      }}
      open={props.showRevisionModal}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: getSizing(2),
          paddingTop: getSizing(7),
          paddingX: getSizing(2),
        }}
      >
        <Typography variant="h6">Requested Revisions</Typography>
        <Typography variant="body1">
          Please type the revisions you are requesting to your assistant below.
        </Typography>
        <XNGInput
          multiline
          row={12}
          placeholder="Revisions"
          onChange={(e) => {
            if (props.setRevisions === undefined) throw Error(placeholderForFutureLogErrorText);
            props.setRevisions(e.target.value);
          }}
        />
        <Box sx={{ display: "flex" }}></Box>
      </Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "End",
          paddingBottom: getSizing(4),
          paddingTop: getSizing(2),
          paddingRight: getSizing(3),
        }}
      >
        <XNGButton
          onClick={() => {
            handleDone();
            props.setShowRevisionModal(false);
          }}
        >
          Submit
        </XNGButton>
      </Box>
    </Dialog>
  );
}

function WrongSignature(props: {
  setShowWrongSignatureModal: React.Dispatch<React.SetStateAction<boolean>>;
  showWrongSignatureModal: boolean;
  setShowSignatureModal: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const palette = usePalette();

  return (
    <Dialog
      className="noselect"
      onClose={() => {
        props.setShowWrongSignatureModal(false);
        props.setShowSignatureModal(true);
      }}
      open={props.showWrongSignatureModal}
    >
      <Box
        sx={{
          display: "flex",
          paddingBlock: getSizing(5),
          paddingTop: getSizing(3),
          paddingX: getSizing(2),
          gap: getSizing(3),
          flexDirection: "column",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: getSizing(1),
            alignItems: "center",
            paddingTop: getSizing(7),
          }}
        >
          <XNGIconRenderer i={<XNGICONS.Alert />} size="lg" />
          <Typography variant="h6">Attention</Typography>
        </Box>
        <Box sx={{ display: "flex", flexDirection: "column", gap: getSizing(1) }}>
          <Typography variant="body1" align="center">
            The signature does not match the name in your account. Please sign with the first and
            last name used in your{" "}
            <Link to={ROUTES_XLOGS.user}>
              <Typography
                variant="body1"
                display={"inline"}
                color={palette.primary[2]}
                sx={{ textDecoration: "underline", cursor: "pointer" }}
              >
                User Profile
              </Typography>
            </Link>{" "}
          </Typography>
        </Box>
      </Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          paddingBottom: getSizing(4),
          paddingTop: getSizing(2),
        }}
      >
        <XNGButton
          onClick={() => {
            props.setShowWrongSignatureModal(false);
            props.setShowSignatureModal(true);
          }}
        >
          OK
        </XNGButton>
      </Box>
    </Dialog>
  );
}
