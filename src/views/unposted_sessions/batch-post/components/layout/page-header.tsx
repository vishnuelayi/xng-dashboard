import { useState, useMemo } from "react";
import dayjs from "dayjs";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Icon from "@mui/material/Icon";
import Divider from "@mui/material/Divider";
import XNGLink from "../common/xng-link";
import XNGButton from "../common/xng-button";
import { ROUTES_XLOGS } from "../../../../../constants/URLs";
import useUserRole from "../../../../../hooks/useUserRole";
import DlgSignature from "../dialog/dlg-signature";
import DlgPostSuccess from "../dialog/dlg-post-success";
import DlgWrongSignature from "../dialog/dlg-wrong-signature";
import { useUnpostedSessionsBatchPostContext } from "../../providers/unposted_sessions_batch_post_provider";
import { API_SESSIONS } from "../../../../../api/api";
import {
  ActualSession,
  PatchSessionStudentJournal,
  RequestRevisionsRequest,
} from "../../../../../session-sdk";
import { useXNGSelector } from "../../../../../context/store";
import {
  selectLoggedInClientAssignment,
  selectUser,
} from "../../../../../context/slices/userProfileSlice";
import sessionStorageKeys from "../../../../../constants/sessionStorageKeys";
import useBatchRequestRevisionsModal from "../../hooks/use_batch_request_revisions_modal";

import { selectClientID } from "../../../../../context/slices/loggedInClientSlice";
import QueryStatusModal from "../../../../../design/modal_templates/query_status_modal";
import useApiMutateRequestRevisionsAndUpdateSessionStatus from "../../hooks/api/use_api_mutate_request_revisions_and_update_session_status";

export default function PageHeader() {
  const electronicSignatureKey = sessionStorageKeys.ALL_SESSIONS_ELECTRONIC_SIGNATURE_KEY;

  const signature = sessionStorage.getItem(electronicSignatureKey);
  const applySignatureToAllSessions = useMemo(() => Boolean(signature), [signature]);

  const { isApprover } = useUserRole();
  const {
    selectedSessionIds,
    onSelectAllSessions,
    selectedStudentIds,
    selectedSessionIndexes,
    selectedProviderIds,
    startDate,
    endDate,
    sessions,
    stateInUs,
    refresh,
    isPosting,
    setIsPosting,
    students,
  } = useUnpostedSessionsBatchPostContext();
  const user = useXNGSelector(selectUser)!;
  const loggedInClientAssignment = useXNGSelector(selectLoggedInClientAssignment);
  const clientId = useXNGSelector(selectClientID);
  const [isSigDialogOpen, setSigDialogOpen] = useState(false);
  const [isWrongSigDialogOpen, setWrongSigDialogOpen] = useState(false);
  const [isSuccessDialogOpen, setSuccessDialogOpen] = useState(false);
  const { showDialog, revisionsDialogEl } = useBatchRequestRevisionsModal({
    onSubmitRevisions: handleRequestRevisionBatch,
  });
  const [showQueryStatusModal, setShowQueryStatusModal] = useState(false);
  const { mutateAsync: mutateBatchRequestRevisions, status: batchRequestRevisionsStatus } =
    useApiMutateRequestRevisionsAndUpdateSessionStatus({
      queryParams: {
        state: stateInUs,
      },
      options: {
        onMutate: () => {
          setShowQueryStatusModal(true);
        },
        onSuccess: () => {
          onSelectAllSessions(false); 
          refresh();
        },
      },
    });

  async function handleRequestRevisionBatch(revisionsText: string) {
    const batchRequestRevisionsBody: Required<RequestRevisionsRequest> = {
      sessionIdsGroupedByServiceProviders: selectedProviderIds
        .map((providerId) => {
          return {
            serviceProviderId: providerId,
            sessionIds: selectedSessionIds.filter((sessionId) => {
              return (
                sessions.find((session) => session.id === sessionId)?.serviceProvider?.id ===
                providerId
              );
            }),
          };
        })
        .filter((group) => group.sessionIds.length > 0),
      revisionsNote: {
        note: revisionsText,
        serviceProviderRequestingRevisions: loggedInClientAssignment.serviceProviderProfile,
      },
    };
   
    await mutateBatchRequestRevisions(batchRequestRevisionsBody);
  }

  const handlePostBatch = async (fullName?: string, isApplyAll?: boolean) => {
    setIsPosting(true);
    const loggedInClientName = `${user?.firstName} ${user?.lastName}`;

    if (!applySignatureToAllSessions && loggedInClientName !== fullName) {
      setWrongSigDialogOpen(true);
      setIsPosting(false);
      return;
    }

    if (isApplyAll && fullName) {
      sessionStorage.setItem(electronicSignatureKey, fullName);
    }

    type SelectedSessionIdsMap = {
      [key: string]: string[];
    };

    const selectedSessionIdsMap: SelectedSessionIdsMap = {};
    const updatedSessionList: ActualSession[] = [...sessions];
    const updatedSelectedSessionIds = [...selectedSessionIds];

    // Checks for virtual sessions without an id
    for (let i = 0; i < selectedSessionIndexes.length; i++) {
      if (
        updatedSessionList[selectedSessionIndexes[i]].seriesId &&
        updatedSessionList[selectedSessionIndexes[i]].id === null
      ) {
        try {
          const sessionResponse = await API_SESSIONS.v1SessionsPut(
            stateInUs,
            updatedSessionList[selectedSessionIndexes[i]],
          );
          updatedSessionList.splice(selectedSessionIndexes[i], 1, sessionResponse);
          updatedSelectedSessionIds.splice(selectedSessionIndexes[i], 1, sessionResponse.id!);
        } catch (err) {
          setIsPosting(false);
          throw err;
        }
      }
    }

    updatedSessionList.forEach((session) => {
      if (updatedSelectedSessionIds.includes(session.id!)) {
        const serviceProviderId = session.serviceProvider?.id!;
        selectedSessionIdsMap[serviceProviderId] = selectedSessionIdsMap[serviceProviderId] || [];
        selectedSessionIdsMap[serviceProviderId].push(session.id!);
      }
    });

    const { serviceProviderProfile, isAutonomous, isApprover, isProxyDataEntry } =
      loggedInClientAssignment;

    for (const serviceProviderId in selectedSessionIdsMap) {
      const requestBody: PatchSessionStudentJournal = {
        clientId: clientId!,
        sessionIds: selectedSessionIdsMap[serviceProviderId],
        startDate:
          selectedSessionIds.length === updatedSessionList.length
            ? startDate.startOf("day").toDate()
            : undefined,
        endDate:
          selectedSessionIds.length === updatedSessionList.length
            ? endDate.endOf("day").toDate()
            : undefined,
        studentIds: selectedStudentIds,
        postSession: students.length === selectedStudentIds.length,
        serviceProviderId,
        currentUser: {
          id: user?.id,
          firstName: user?.firstName,
          lastName: user?.lastName,
          emailAddress: user?.emailAddress,
        },
        currentUserServiceProvider: {
          id: serviceProviderProfile?.id,
          firstName: serviceProviderProfile?.firstName,
          lastName: serviceProviderProfile?.lastName,
        },
        electronicSignature: {
          statementType: 3,
          isSigned: true,
          signedOnDateLocal: dayjs().toDate(),
          signedOnDateUtc: dayjs().utc(true).toDate(),
          signedByFullName: signature ?? fullName,
          objectId: user?.id, //TODO: This should be the Azure B2C OID provided by msal
          documentText: "",
          requestIpAddress: "",
        },
        isAutonomous,
        isApprover,
        isActingAsProxy: isProxyDataEntry,
      };

      try {
        await API_SESSIONS.v1SessionsPatchSessionStudentJournalApprovalPatch(
          stateInUs,
          requestBody,
        );
        setSuccessDialogOpen(true);
        setIsPosting(false);
      } catch (err) {
        setIsPosting(false);
        console.error(err);
      }
    }
    refresh();
  };

  return (
    <>
      <Box sx={{ display: "flex", alignItems: "center", padding: "20px 72px", gap: "20px" }}>
        <XNGLink href={ROUTES_XLOGS.unposted_sessions.home}>
          <Icon>chevron_left</Icon>
          Back
        </XNGLink>

        <Typography
          sx={{ flexGrow: 1, fontSize: "24px", fontWeight: 500, lineHeight: "40px" }}
          component="h1"
        >
          Session Approval
        </Typography>

        {isApprover() && (
          <XNGButton
            variant="outlined"
            onClick={() => {
              showDialog({
                showWarning: selectedSessionIds.length > 1,
              });
            }}
            disabled={!selectedSessionIds.length}
          >
            Request Revision
          </XNGButton>
        )}
        <XNGButton
          onClick={() => (applySignatureToAllSessions ? handlePostBatch() : setSigDialogOpen(true))}
          disabled={!selectedSessionIds.length || isPosting}
        >{`Approve Batch (${selectedSessionIds.length})`}</XNGButton>
      </Box>

      <Divider sx={{ borderWidth: "1px" }} />

      <DlgSignature
        open={isSigDialogOpen}
        onClose={() => setSigDialogOpen(false)}
        onPostBatch={handlePostBatch}
        userRoleText={"Approve"}
      />

      <DlgWrongSignature open={isWrongSigDialogOpen} onClose={() => setWrongSigDialogOpen(false)} />

      <DlgPostSuccess open={isSuccessDialogOpen} onClose={() => setSuccessDialogOpen(false)} />
      {revisionsDialogEl}
      <QueryStatusModal
        isOpen={showQueryStatusModal}
        content={{
          pendingTitle: "Requesting Revisions, Please Wait...",
          errorTitle: "Failed to Request Revisions",
          errorBody: "An error occurred while requesting revisions. Please try again.",
          successTitle: "Revisions Requested",
          successBody: "Revisions have been requested successfully.",
        }}
        status={batchRequestRevisionsStatus}
        onSettledClose={() => setShowQueryStatusModal(false)}
      />
    </>
  );
}
