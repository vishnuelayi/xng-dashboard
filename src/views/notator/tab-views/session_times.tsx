import { useEffect, useState } from "react";
import usePalette from "../../../hooks/usePalette";
import dayjs, { Dayjs } from "dayjs";
import Box from "../../../design/components-dev/BoxExtended";
import { getSizing } from "../../../design/sizing";
import { Checkbox, FormControlLabel, Typography } from "@mui/material";
import XNGTimePicker from "../../../design/low-level/time";
import XNGInput from "../../../design/low-level/input";
import { XNGCheckbox } from "../../../design";
import { TabInnerViewportLayout } from "../layouts/inner_viewport_headers";
import { useNotatorTools } from "../tools";
import useNotatorStudentTools from "../hooks/use_edit_session_student";
import { AddRationaleModal } from "../modals/add_rationale";
import useBreakpointHelper from "../../../design/hooks/use_breakpoint_helper";
import { timezoneAdjustedStartOrEndTimes } from "../../../utils/timeZones";
import { useXNGSelector } from "../../../context/store";
import { selectStateInUS } from "../../../context/slices/stateInUsSlice";
import { produce } from "immer";

// This is purely a presentational, or "dumb" component. This is not to house any of its own state. It should only ever provide callbacks.
// See more:
// https://medium.com/@dan_abramov/smart-and-dumb-components-7ca2f9a7c7d0
// https://medium.com/@thejasonfile/dumb-components-and-smart-components-e7b33a698d43

export default function SessionTimesTabView(
  props: Readonly<{
    selectedStudentIndex: number;
    isAllStudentView?: boolean;
  }>,
) {
  // ---- Hooks ----
  const notatorTools = useNotatorTools();
  const { readOnly } = notatorTools;
  const studentTools = useNotatorStudentTools({
    notatorTools,
    indexOverride: props.isAllStudentView ? props.selectedStudentIndex : undefined,
  });
  const { draftSession: editedSession, editDraft: editSession } = notatorTools;
  const palette = usePalette();
  const { isMobile } = useBreakpointHelper();
  const userStateInUS = useXNGSelector(selectStateInUS);
  // ---- States ----
  const [showRationaleModal, setShowRationaleModal] = useState<boolean>(false);

  const { timezoneAdjustedStartTime, timezoneAdjustedEndTime } = timezoneAdjustedStartOrEndTimes(
    userStateInUS,
    "display",
    dayjs(
      editedSession.studentJournalList![props.selectedStudentIndex].studentAttendanceRecord
        ?.arrivalTime
        ? editedSession.studentJournalList![props.selectedStudentIndex].studentAttendanceRecord
            ?.arrivalTime
        : editedSession.meetingDetails?.startTime,
    ) ?? null,
    dayjs(
      editedSession.studentJournalList![props.selectedStudentIndex].studentAttendanceRecord
        ?.departureTime
        ? editedSession.studentJournalList![props.selectedStudentIndex].studentAttendanceRecord
            ?.departureTime
        : editedSession.meetingDetails?.endTime,
    ) ?? null,
  );
  const draftShortcutConstants = {
    startTime: timezoneAdjustedStartTime,
    endTime: timezoneAdjustedEndTime,
    timeAway:
      editedSession.studentJournalList![props.selectedStudentIndex].studentAttendanceRecord
        ?.timeAwayMinutes,
    rationale:
      editedSession.studentJournalList?.[props.selectedStudentIndex].studentAttendanceRecord
        ?.rationale,
  };

  const draftSessionTimesAdapter = {
    scheduleMinutes: dayjs(draftShortcutConstants.endTime).diff(
      // can we get an explanation of what this is?
      draftShortcutConstants.startTime,
      "minutes",
    ),
    studentName: `${editedSession.studentJournalList?.[props.selectedStudentIndex].student
      ?.firstName} ${editedSession.studentJournalList?.[props.selectedStudentIndex].student
      ?.lastName}`,
  };

  const [clickable, setClickable] = useState<boolean>(false);

  useEffect(() => {
    if (editedSession.status === 4 || editedSession.status === 5) {
      setClickable(true);
    } else {
      setClickable(false);
    }
  }, [editedSession.status]);

  const { isApplySessionTimesChecked, toggleApplySessionTimesCheckbox } =
    useIsApplySessionTimesChecked();

  return (
    <TabInnerViewportLayout
      title="Today's Session Times"
      useLink={{
        onClick: () => setShowRationaleModal(!showRationaleModal),
        text: draftShortcutConstants.rationale ? "View Rationale" : "Add Rationale",
      }}
      isAllStudentView={props.isAllStudentView}
    >
      <AddRationaleModal
        selectedStudentIndex={props.selectedStudentIndex}
        setModalOpen={setShowRationaleModal}
        modalOpen={showRationaleModal}
        rationale={draftShortcutConstants.rationale}
        studentName={draftSessionTimesAdapter.studentName}
      />
      <FormControlLabel
        control={
          <Checkbox
            size="small"
            checked={isApplySessionTimesChecked}
            onChange={toggleApplySessionTimesCheckbox}
          />
        }
        label={<Typography variant="body1">Apply Session Times</Typography>}
      />
      <Box
        sx={{
          display: "flex",
          gap: getSizing(5),
          paddingTop: getSizing(3),
          paddingBottom: getSizing(3),
          ...(clickable === true && { pointerEvents: "none" }),
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            float: "left",
            width: !props.isAllStudentView ? "50%" : isMobile ? "100%" : "75%",
            gap: getSizing(3),
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography variant="body1">Start Time: </Typography>
            <XNGTimePicker
              value={dayjs(draftShortcutConstants.startTime)} //TODO: this is not working
              onChange={(v) =>
                studentTools.editDraftStudent("studentAttendanceRecord.arrivalTime", v)
              }
              disabled={readOnly || isApplySessionTimesChecked}
            />
          </Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography variant="body1">End Time: </Typography>
            <XNGTimePicker
              value={dayjs(draftShortcutConstants.endTime)}
              onChange={(v) =>
                studentTools.editDraftStudent("studentAttendanceRecord.departureTime", v)
              }
              disabled={readOnly || isApplySessionTimesChecked}
            />
          </Box>
          <Box
            sx={{
              width: "100%",
              bgcolor: palette.contrasts[3],
              height: "1px",
              marginY: getSizing(2),
            }}
          />
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography variant="body1">Schedule Minutes</Typography>
            <Typography variant="body1">
              {draftSessionTimesAdapter.scheduleMinutes
                ? draftSessionTimesAdapter.scheduleMinutes
                : 60}
            </Typography>
          </Box>
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography variant="body1">Time away from Student</Typography>
            <Box sx={{ display: "flex", width: getSizing(7) }}>
              <XNGInput
                type="number"
                value={draftShortcutConstants.timeAway?.toString()}
                onChange={(e) => {
                  if (e.target.value === "") {
                    editSession(
                      `studentJournalList.${props.selectedStudentIndex}.studentAttendanceRecord.timeAwayMinutes`,
                      0,
                    );
                    return;
                  }
                  if (parseInt(e.target.value) < 0) {
                    editSession(
                      `studentJournalList.${props.selectedStudentIndex}.studentAttendanceRecord.timeAwayMinutes`,
                      0,
                    );
                    return;
                  }
                  editSession(
                    `studentJournalList.${props.selectedStudentIndex}.studentAttendanceRecord.timeAwayMinutes`,
                    parseInt(e.target.value),
                  );
                }}
                disabled={readOnly}
              />
            </Box>
          </Box>
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography variant="body1">Net Duration</Typography>
            <Typography variant="body1">
              {draftSessionTimesAdapter.scheduleMinutes
                ? draftSessionTimesAdapter.scheduleMinutes - draftShortcutConstants.timeAway!
                : 60 - draftShortcutConstants.timeAway!}
            </Typography>
          </Box>
        </Box>
      </Box>
    </TabInnerViewportLayout>
  );
}

function useIsApplySessionTimesChecked() {
  const { draftSession, selectedStudentIndex, setDraftSession } = useNotatorTools();

  const [isApplySessionTimesChecked, setIsApplySessionTimesChecked] = useState<boolean>(
    getIfStudentTimesMatchSessionTimes(),
  );

  useEffect(() => {
    if (isApplySessionTimesChecked) {
      setStudentTimesToSessionTimes();
    }
  }, [isApplySessionTimesChecked]);

  /**
   * #TODO
   * Investigate bug with student arrival and departure times
   * For recurring sessions that are not the first in that series, student arrival and departure times are defaulting to
   * the date of the first session in that series. So even though the hours match, the dates are off which means
   * the apply session times checkbox will not default to being checked when first viewing the session. I don't know if this
   * is caused by the back-end or the front-end at the moment, but since we only need to make sure the hours match, the below variable was updated to
   * a function that only checks hours and not the entire date.
   */
  function getIfStudentTimesMatchSessionTimes(): boolean {
    const startMatches =
      draftSession.studentJournalList![selectedStudentIndex].studentAttendanceRecord!
        .arrivalTime === draftSession.meetingDetails!.startTime!;
    const endMatches =
      draftSession.studentJournalList![selectedStudentIndex].studentAttendanceRecord!
        .departureTime === draftSession.meetingDetails!.endTime!;

    return startMatches && endMatches;
  }

  function setStudentTimesToSessionTimes() {
    setDraftSession(
      produce((draft) => {
        draft.studentJournalList![selectedStudentIndex].studentAttendanceRecord!.arrivalTime =
          draftSession.meetingDetails!.startTime!;
        draft.studentJournalList![selectedStudentIndex].studentAttendanceRecord!.departureTime =
          draftSession.meetingDetails!.endTime!;
      }),
    );
  }

  function toggleApplySessionTimesCheckbox() {
    setIsApplySessionTimesChecked(!isApplySessionTimesChecked);
  }

  return { isApplySessionTimesChecked, toggleApplySessionTimesCheckbox };
}
