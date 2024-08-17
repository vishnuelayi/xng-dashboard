import usePalette from "../../../hooks/usePalette";
import { SessionResponse, StudentJournal } from "../../../session-sdk";
import { DictTabsByIndex } from "../temp/validation_v1";
import { useNotatorTools } from "../tools";
import { NotatorTab } from "../types/types";
import getCanPostSessionBasedOnTime from "../../../utils/getCanPostSessionBasedOnTime";
import { Alert, Dialog, Typography } from "@mui/material";
import Box from "../../../design/components-dev/BoxExtended";
import { getSizing } from "../../../design/sizing";
import { XNGICONS, XNGIconRenderer } from "../../../design/icons";
import XNGButton from "../../../design/low-level/button";
import { NotatorSection } from "../../../profile-sdk";
import { scrollParentToChild } from "../layouts/all_students_layout/utils/utils";

/**
 * Warning: This modal component is tightly coupled to its parent's state. This is not only
 * a violation of SRP in React but adds unnecessary complexity and limits reusability.
 *
 * Recommendation: Invert the control. Refactor to use standard prop names like `onClose`
 * and `open` for increased clarity and reusability.
 */
export function PostErrorModal(props: {
  setShowPostModal: React.Dispatch<React.SetStateAction<boolean>>;
  showPostModal: boolean;
  validStudentIndexes: number[];
  validTabsByStudentIndex: DictTabsByIndex;
  studentJournalList: StudentJournal[];
  selectedStudentIndex: number;
  editedSession: SessionResponse;
  onSetSelectedStudentIndex: (i: number) => void;
  setSelectedTab: (t: NotatorTab) => void;
  allStudentView: boolean;
}) {
  const palette = usePalette();
  const notatorTools = useNotatorTools();

  const sessionWarining = () => getCanPostSessionBasedOnTime(props.editedSession);
  return (
    <Dialog
      className="noselect"
      onClose={() => {
        props.setShowPostModal(false);
      }}
      open={props.showPostModal}
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
          {props.studentJournalList.length !== props.validStudentIndexes.length && (
            <Typography variant="body1">
              In order to finalize your documentation, the below items were identified as being
              required by your administrator or necessary to evaluate opportunity for Medicaid
              billing. Please click the findings below to update accordingly.
            </Typography>
          )}
          {/*  TODO: UPDATE MODAL VALIDATION CHECK */}
          {props.studentJournalList.map((student: StudentJournal, index: number) => {
            const handleLink = (tab: NotatorTab) => {
              props.onSetSelectedStudentIndex(index);
              props.setSelectedTab(tab);
              props.setShowPostModal(false);
              if (props.allStudentView) {
                const allStudentViewContainer = document.getElementById("allStudentViewContainer");
                const studentAccordionElement = document.getElementById(`${student.student?.id}`);
                scrollParentToChild(allStudentViewContainer!, studentAccordionElement!);
              }
            };
            if (props.validStudentIndexes.includes(index)) {
              return;
            }
            if (props.validTabsByStudentIndex[index] === undefined) {
              return;
            }
            return (
              <Box key={index}>
                <Typography variant="body1">
                  {student.student?.firstName} {student.student?.lastName}:{" "}
                </Typography>
                {!getNotatorSectionMetaData(
                  NotatorTab["Session Times"],
                  notatorTools.notatorSections,
                ) || props.validTabsByStudentIndex[index].includes(1) ? null : (
                  <Typography variant="body1">
                    <span
                      style={{
                        textDecoration: "underline",
                        color: palette.primary[1],
                      }}
                      onClick={() => {
                        handleLink(NotatorTab["Session Times"]);
                      }}
                    >
                      Session Times
                    </span>{" "}
                    - Review it
                  </Typography>
                )}
                {!getNotatorSectionMetaData(
                  NotatorTab["Activities"],
                  notatorTools.notatorSections,
                ) || props.validTabsByStudentIndex[index].includes(2) ? null : (
                  <Typography variant="body1">
                    <span
                      style={{
                        textDecoration: "underline",
                        color: palette.primary[1],
                      }}
                      onClick={() => {
                        handleLink(NotatorTab.Activities);
                      }}
                    >
                      Activities
                    </span>{" "}
                    - At least one activity must be notated
                  </Typography>
                )}
                {!getNotatorSectionMetaData(
                  NotatorTab["Accommodations"],
                  notatorTools.notatorSections,
                ) || props.validTabsByStudentIndex[index].includes(3) ? null : (
                  <Typography variant="body1">
                    <span
                      style={{
                        textDecoration: "underline",
                        color: palette.primary[1],
                      }}
                      onClick={() => {
                        handleLink(NotatorTab.Accommodations);
                      }}
                    >
                      Accommodations
                    </span>{" "}
                    - Review it
                  </Typography>
                )}
                {!getNotatorSectionMetaData(
                  NotatorTab["Modifications"],
                  notatorTools.notatorSections,
                ) || props.validTabsByStudentIndex[index].includes(4) ? null : (
                  <Typography variant="body1">
                    <span
                      style={{
                        textDecoration: "underline",
                        color: palette.primary[1],
                      }}
                      onClick={() => {
                        handleLink(NotatorTab.Modifications);
                      }}
                    >
                      {" "}
                      Modifications
                    </span>{" "}
                    - Review it
                  </Typography>
                )}
                {!getNotatorSectionMetaData(
                  NotatorTab["Goals/Objectives"],
                  notatorTools.notatorSections,
                ) || props.validTabsByStudentIndex[index].includes(5) ? null : (
                  <Typography variant="body1">
                    <span
                      style={{
                        textDecoration: "underline",
                        color: palette.primary[1],
                      }}
                      onClick={() => {
                        handleLink(NotatorTab["Goals/Objectives"]);
                      }}
                    >
                      {" "}
                      Goals
                    </span>{" "}
                    - At least one goal must have progress notated
                  </Typography>
                )}
                {!getNotatorSectionMetaData(
                  NotatorTab["Observations"],
                  notatorTools.notatorSections,
                ) || props.validTabsByStudentIndex[index].includes(6) ? null : (
                  <Typography variant="body1">
                    <span
                      style={{
                        textDecoration: "underline",
                        color: palette.primary[1],
                      }}
                      onClick={() => {
                        handleLink(NotatorTab.Observations);
                      }}
                    >
                      {" "}
                      Observations
                    </span>{" "}
                    - At least one observation must be notated
                  </Typography>
                )}
              </Box>
            );
          })}
        </Box>
        <Box>
          {!sessionWarining().canPost && (
            <Alert sx={{ marginInline: "2rem" }} severity="warning">
              {`You cannot post this session until ${sessionWarining().message}`}{" "}
            </Alert>
          )}
        </Box>
      </Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "end",
          paddingBottom: getSizing(4),
          paddingTop: getSizing(2),
          paddingRight: getSizing(3),
        }}
      >
        <XNGButton
          onClick={() => {
            props.setShowPostModal(false);
          }}
        >
          OK
        </XNGButton>
      </Box>
    </Dialog>
  );
}

function getNotatorSectionMetaData(tab: NotatorTab, snapshots: NotatorSection[]) {
  return snapshots.find((snap) => Number(snap.sectionName) === tab && snap.required);
}
