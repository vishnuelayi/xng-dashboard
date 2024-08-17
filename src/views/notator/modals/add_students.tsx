import {
  Autocomplete,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import { useState } from "react";
import { useNotatorTools } from "../tools";
import { StudentJournal } from "../../../session-sdk";
import { StudentRef } from "../../../profile-sdk";

export default function AddStudentModal(
  props: Readonly<{
    open: any;
    onClose: any;
    saveAddStudentToSession: Function;
    isAllStudentView?: boolean;
  }>,
) {
  const notatorTools = useNotatorTools();

  const [selectedStudents, setSelectedStudents] = useState<StudentRef[]>([]);

  const options = getStudentsNotInSession({
    journals: notatorTools.session.studentJournalList ?? [],
    caseload: notatorTools.studentCaseload ?? [],
  });

  async function handleDone() {
    if (selectedStudents.length > 0) {
      if (props.isAllStudentView) {
        props.saveAddStudentToSession(selectedStudents);
      } else {
        notatorTools.addStudentRefsToSession(selectedStudents);
      }
    }
    setSelectedStudents([]);

    props.onClose();
  }

  return (
    <Dialog open={props.open} onClose={() => props.onClose()} maxWidth="sm" fullWidth>
      <DialogTitle>Add Student(s)</DialogTitle>
      <DialogContent sx={{ overflow: "visible!important" }}>
        <Autocomplete
          multiple
          options={options}
          getOptionLabel={(option) => `${option.firstName!} ${option.lastName!}`}
          value={selectedStudents}
          onChange={(event, newSelectedStudents) => setSelectedStudents(newSelectedStudents)}
          renderInput={(params) => (
            <TextField {...params} variant="outlined" label="Type student name..." />
          )}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={() => handleDone()} color="primary">
          Done
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export function getStudentsNotInSession(props: {
  journals: StudentJournal[];
  caseload: StudentRef[];
}) {
  const res = props.caseload.filter(
    (s) => !props.journals.map((_s) => _s.student!.id!).includes(s.id!),
  );

  return res;
}
