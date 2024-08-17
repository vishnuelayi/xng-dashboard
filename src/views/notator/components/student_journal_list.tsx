import Box from "../../../design/components-dev/BoxExtended";
import { getSizing } from "../../../design/sizing";
import { Typography } from "@mui/material";
import XNGToggleGroup from "../../../design/low-level/button_togglegroup";
import XNGStatusButton from "../../../design/low-level/button_status";
import { placeholderForFutureLogErrorText } from "../../../temp/errorText";
import { FutureTabs, NotatorTab } from "../types/types";
import { useEffect, useState } from "react";
import { SessionResponse, StudentJournal } from "../../../session-sdk";
import { StudentRef } from "../../../profile-sdk";
import usePalette from "../../../hooks/usePalette";
import AddStudentModal from "../modals/add_students";
import RemoveStudentModal from "../modals/remove_student";
import { EditDraftFunctionType } from "../tools/types";
import dayjs from "dayjs";

function StudentJournalList(props: {
  studentJournalList: StudentJournal[];
  validStudentIndexes: number[];
  selectedStudentIndex: number;
  onSetSelectedStudentIndex: (i: number) => void;
  setSelectedTab: (t: NotatorTab) => void;
  editSession: EditDraftFunctionType;
  setSession: React.Dispatch<React.SetStateAction<SessionResponse>>;
  saveSession: Function;
  saveAddStudentToSession: Function;
  studentCaseLoadList: StudentRef[];
  applyFuture: Array<FutureTabs[]>;
  setApplyFuture: React.Dispatch<React.SetStateAction<Array<FutureTabs[]>>>;
  editedSession: SessionResponse;
  session: SessionResponse;
  isAllStudentView?: boolean;
}) {
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [showRemoveModal, setShowRemoveModal] = useState<boolean>(false);
  const [clickable, setClickable] = useState<boolean>(false);

  const palette = usePalette();

  useEffect(() => {
    if (props.editedSession.status === 4 || props.editedSession.status === 5) {
      setClickable(true);
    }
  }, []);

  return (
    <Box
      sx={{
        marginLeft: props.isAllStudentView ? 0 : getSizing(5),
        width: getSizing(27),
        height: "100%",
      }}
    >
      <Box sx={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
        <Typography variant="h6">
          My {props.editedSession.groupSetting ? "Students" : "Student"}
        </Typography>
        {props.editedSession.groupSetting && (
          <XNGToggleGroup
            options={[
              {
                label: "+",
                onClick: () => {
                  if (!clickable) {
                    setShowAddModal(true);
                  }
                },
                unclickable: clickable,
              },
              {
                label: "-",
                onClick: () => {
                  if (!clickable) {
                    setShowRemoveModal(true);
                  }
                },
                unclickable: clickable,
              },
            ]}
          />
        )}
        <AddStudentModal
          open={showAddModal}
          onClose={() => setShowAddModal(false)}
          saveAddStudentToSession={props.saveAddStudentToSession}
          isAllStudentView={props.isAllStudentView}
        />
        <RemoveStudentModal
          studentJournalList={props.studentJournalList}
          setShowRemoveStudent={setShowRemoveModal}
          showRemoveStudent={showRemoveModal}
          setSession={props.setSession}
          saveSession={props.saveSession}
          applyFuture={props.applyFuture}
          setApplyFuture={props.setApplyFuture}
        />
      </Box>
      {!props.isAllStudentView && (
        <Box sx={{ overflowY: "auto", maxHeight: "calc(100% - 20rem)" }}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: getSizing(1),
              marginTop: getSizing(3),
            }}
          >
            {props.studentJournalList.map((journal: StudentJournal, i: number) => {
              const { signedByFullName, signedOnDateLocal } =
                journal.approval?.authorizingProviderSignature || {};
              if (!journal.student?.id) return <></>;
              // console.log(props.validStudentIndexes, "INDEXES");
              return (
                <XNGStatusButton
                  key={i}
                  isHighlighted={props.selectedStudentIndex === i}
                  color={
                    props.editedSession.status === 4 || props.editedSession.status === 5
                      ? palette.contrasts[2]
                      : palette.contrasts[2]
                  }
                  onClick={() => {
                    if (journal.student?.id === undefined)
                      throw new Error(placeholderForFutureLogErrorText);
                    props.onSetSelectedStudentIndex(i);
                    props.setSelectedTab(NotatorTab.Attendance);
                    if (
                      JSON.stringify(props.editedSession.sessionJournal) !=
                      JSON.stringify(props.session.sessionJournal)
                    )
                      props.saveSession(props.editedSession);
                    // props.setSoftRefreshSwitch(!props.softRefreshSwitch);
                  }}
                  fullWidth
                  status={props.validStudentIndexes.includes(i) ? "Success" : "Default"}
                  label={journal.student?.firstName! + " " + journal.student?.lastName!}
                  desc={
                    signedByFullName &&
                    signedOnDateLocal &&
                    "Approved by " +
                      signedByFullName +
                      " on " +
                      dayjs(signedOnDateLocal).format("MM/DD/YYYY")
                  }
                />
              );
            })}
          </Box>
        </Box>
      )}
    </Box>
  );
}

export default StudentJournalList;
