import Box from "../../../design/components-dev/BoxExtended";
import XNGNotification from "../../../design/low-level/notification";
import { getSizing } from "../../../design/sizing";
import { Dialog, Typography } from "@mui/material";
import { ElectronicSignature, SessionResponse, SessionStatus } from "../../../session-sdk";
import dayjs from "dayjs";
import usePalette from "../../../hooks/usePalette";
import { useState } from "react";
import XNGInput from "../../../design/low-level/input";
import XNGButton from "../../../design/low-level/button";

function UserFeedback(props: { session: SessionResponse }) {
  const palette = usePalette();
  const [showModal, setShowModal] = useState<boolean>(false);
  function deriveSessionNote(): JSX.Element {
    // derive is closed due to provider absent
    // derive revision requested
    // derive session submitted by "" at date
    // derive session posted on date at time

    // but for now,

    const getProviderSignature = () => {
      let signature: ElectronicSignature | undefined = undefined;

      switch (props.session.status) {
        case SessionStatus.NUMBER_2:
          signature = props.session.documentingProviderSignature;
          break;
        default:
          signature = props.session.authorizingProviderSignature;
          break;
      }
      return signature;
    };

    const signature = getProviderSignature();

    return (
      <Box display={"flex"} justifyContent={"center"}>
        <XNGNotification status={props.session.status}>
          <Typography>
            {props.session.status === 1 ? "Session in Progress by: " : null}
            {props.session.status === 2 ? "Session Submitted by: " : null}
            {props.session.status === 3 ? "Session Revisions requested by: " : null}
            {props.session.status === 4 ? "Session Posted by: " : null}
            {props.session.status === 5 ? "Session Closed by: " : null}
            <Typography component="b" display="inline" sx={{ fontWeight: "bold" }}>
              {signature?.signedByFullName} on{" "}
              {dayjs(signature?.signedOnDateUtc).format("MM/DD/YYYY")} at{" "}
              {dayjs(signature?.signedOnDateUtc).format("hh:mm A ")}
              {props.session.status === 3 ? (
                <Typography
                  color={palette.primary[2]}
                  display={"inline"}
                  variant="body1"
                  sx={{ textDecoration: "underline", cursor: "pointer" }}
                  onClick={() => {
                    setShowModal(true);
                  }}
                >
                  Click Here
                </Typography>
              ) : null}
            </Typography>
          </Typography>
          <RevisionModal
            setShowModal={setShowModal}
            showModal={showModal}
            session={props.session}
          />
        </XNGNotification>
      </Box>
    );
  }

  return <Box sx={{ paddingX: getSizing(3), width: "100%" }}>{deriveSessionNote()}</Box>;
}

export default UserFeedback;

const RevisionModal = (props: {
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  showModal: boolean;
  session: SessionResponse;
}) => {
  return (
    <Dialog
      className="noselect"
      onClose={() => {
        props.setShowModal(false);
      }}
      open={props.showModal}
      PaperProps={{ sx: { position: "fixed", top: getSizing(20) } }}
    >
      <Box
        sx={{
          display: "flex",
          paddingBlock: getSizing(5),
          paddingTop: getSizing(3),
          paddingX: getSizing(2),
          width: getSizing(55),
          gap: getSizing(3),
          flexDirection: "column",
        }}
      >
        <Typography variant="h5">Requested Revisions</Typography>
        <Typography variant="body1">
          The following revisions were requested by your approver. Please make the corrections and
          then click the submit button to resubmit your session for approval.
        </Typography>
        <XNGInput
          value={props.session.studentJournalList![0].revisionsNote?.note}
          multiline
          row={12}
        />
        <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
          <XNGButton
            variant="filled"
            onClick={() => {
              props.setShowModal(false);
            }}
          >
            Done
          </XNGButton>
        </Box>
      </Box>
    </Dialog>
  );
};
