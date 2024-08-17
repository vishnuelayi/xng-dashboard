import XNGRadio from "../../../design/low-level/button_radio";
import Box from "../../../design/components-dev/BoxExtended";
import { SessionResponse, StudentAttendanceRecord } from "../../../session-sdk";
import { TabInnerViewportLayout } from "../layouts/inner_viewport_headers";
import { FormControl, RadioGroup, FormControlLabel, Typography } from "@mui/material";
import { EditDraftFunctionType } from "../tools/types";
import { useNotatorTools } from "../tools";

// This is purely a presentational, or "dumb" component. This is not to house any of its own state. It should only ever provide callbacks.
// See more:
// https://medium.com/@dan_abramov/smart-and-dumb-components-7ca2f9a7c7d0
// https://medium.com/@thejasonfile/dumb-components-and-smart-components-e7b33a698d43

export default function AttendanceTabView(props: {
  editSession: EditDraftFunctionType;
  selectedStudentIndex: number;
  editedSession: SessionResponse;
  isAllStudentView?: boolean;
}) {
  type AttendanceSelection = "Present" | "Virtual" | "Absent";
  const attendanceValues = ["Present", "Absent", "Virtual"];
  const { readOnly } = useNotatorTools();

  const value: AttendanceSelection = getChecked();
  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const selection = e.target.value as AttendanceSelection;

    switch (selection) {
      case "Absent":
        editStudentAttendanceRecord({ present: false, virtual: false });
        break;
      case "Present":
        editStudentAttendanceRecord({ present: true, virtual: false });
        break;
      case "Virtual":
        editStudentAttendanceRecord({ present: true, virtual: true });
        break;
    }
  }

  return (
    <>
      {props.isAllStudentView ? (
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Typography mr="1rem" className="noselect" variant="body1">
            Attendance
          </Typography>
          <FormControl component="fieldset">
            <RadioGroup
              sx={{ pl: ".5rem", display: "flex", flexDirection: "row" }}
              aria-label="attendance"
              name="attendance"
              value={value}
              onChange={(e) => handleChange(e)}
            >
              {attendanceValues.map((attendance) => (
                <FormControlLabel
                  key={attendance}
                  value={attendance}
                  control={<XNGRadio />}
                  label={attendance}
                  disabled={readOnly}
                />
              ))}
            </RadioGroup>
          </FormControl>
        </Box>
      ) : (
        <TabInnerViewportLayout title="Attendance">
          <FormControl component="fieldset">
            <RadioGroup
              sx={{ pl: ".5rem" }}
              aria-label="attendance"
              name="attendance"
              value={value}
              onChange={(e) => handleChange(e)}
            >
              {attendanceValues.map((attendance) => (
                <FormControlLabel
                  key={attendance}
                  value={attendance}
                  control={<XNGRadio />}
                  label={attendance}
                  disabled={readOnly}
                />
              ))}
            </RadioGroup>
          </FormControl>
        </TabInnerViewportLayout>
      )}
    </>
  );

  function editStudentAttendanceRecord(backendDataOptions: { present: boolean; virtual: boolean }) {
    const current =
      props.editedSession.studentJournalList![props.selectedStudentIndex].studentAttendanceRecord;

    props.editSession(`studentJournalList.${props.selectedStudentIndex}.studentAttendanceRecord`, {
      present: backendDataOptions.present,
      virtual: backendDataOptions.virtual,
      arrivalTime: current!.arrivalTime,
      departureTime: current!.departureTime,
      rationale: current!.rationale,
      timeAwayMinutes: current!.timeAwayMinutes,
    } as StudentAttendanceRecord);
  }
  function getChecked(): AttendanceSelection {
    const present =
      props.editedSession.studentJournalList?.[props.selectedStudentIndex]?.studentAttendanceRecord
        ?.present;
    const virtual =
      props.editedSession.studentJournalList?.[props.selectedStudentIndex]?.studentAttendanceRecord
        ?.virtual;

    if (!present) return "Absent";
    if (present && !virtual) return "Present";
    if (present && virtual) return "Virtual";

    // At least one condition should be met. If not, this is a fatal issue that indicates a problem with bad data.
    throw new Error("Only possible attendance conditions were not met. Is the data corrupt?");
  }
}
