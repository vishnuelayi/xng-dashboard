import { useState } from "react";
import { SessionResponse, StudentJournal } from "../../../session-sdk";
import { useNotatorTools } from "../tools";
import { FutureTabs } from "../types/types";
import { Dialog, Typography } from "@mui/material";
import Box from "../../../design/components-dev/BoxExtended";
import XNGCheckbox from "../../../design/low-level/checkbox";
import { getSizing } from "../../../design/sizing";
import XNGButton from "../../../design/low-level/button";
import produce from "immer";

function RemoveStudentModal(props: {
  studentJournalList: StudentJournal[];
  showRemoveStudent: boolean;
  setShowRemoveStudent: React.Dispatch<React.SetStateAction<boolean>>;
  setSession: React.Dispatch<React.SetStateAction<SessionResponse>>;
  saveSession: Function;
  applyFuture: Array<FutureTabs[]>;
  setApplyFuture: React.Dispatch<React.SetStateAction<Array<FutureTabs[]>>>;
}) {
  const notatorTools = useNotatorTools();

  const [checked, setChecked] = useState<boolean[]>(
    props.studentJournalList.map(() => {
      return false;
    }),
  );
  const handleDone = () => {
    const newStudentJournalList = props.studentJournalList;
    for (var i = checked.length - 1; i >= 0; i--) {
      if (checked[i]) {
        if (newStudentJournalList.length === 1) {
          return;
        }
        newStudentJournalList.splice(i, 1);
      }
    }
    setChecked(newStudentJournalList.map(() => false));

    const sessionWithoutSelectedStudents = produce(notatorTools.draftSession, (draft) => {
      draft.studentJournalList = newStudentJournalList;
    });

    notatorTools.saveSession(sessionWithoutSelectedStudents);
  };

  return (
    <Dialog
      className="noselect"
      onClose={() => {
        props.setShowRemoveStudent(false);
      }}
      open={props.showRemoveStudent}
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
        <Typography variant="h6">Remove Student(s)</Typography>
        <Typography variant="body1">Remove student(s) from today's session only.</Typography>
        {props.studentJournalList.map((student, i) => {
          const handleToggle = () => {
            let temp = checked;
            temp[i] = !temp[i];
            setChecked([...temp]);
          };
          return (
            <Box key={i} sx={{ display: "flex", alignItems: "center" }}>
              <XNGCheckbox checked={checked[i]} onToggle={handleToggle} />
              <Typography variant="body1">
                {student.student?.firstName} {student.student?.lastName}
              </Typography>
            </Box>
          );
        })}
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
            props.setShowRemoveStudent(false);
            handleDone();
          }}
        >
          Done
        </XNGButton>
      </Box>
    </Dialog>
  );
}

export default RemoveStudentModal;
