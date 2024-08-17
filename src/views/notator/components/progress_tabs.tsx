import { NotatorTab } from "../types/types";
import { Typography, ButtonBase, useTheme } from "@mui/material";
import Box from "../../../design/components-dev/BoxExtended";
import usePalette from "../../../hooks/usePalette";
import { getSizing } from "../../../design/sizing";
import { NotatorSectionName } from "../../../profile-sdk";
import { SessionResponse } from "../../../session-sdk";
import { NotatorValidationSummaryV1 } from "../temp/validation_v1";
import { useNotatorTools } from "../tools";
import { useCallback } from "react";

interface IProgressTabs {
  validation: NotatorValidationSummaryV1;
  selectedStudentIndex: number;
  selectedTab: NotatorTab;
  onSetRequestedTab: (v: NotatorTab) => void;
  editedSession: SessionResponse;
}

/**
 * This is the structural component that renders individual `StudentTab` components.
 *
 * When we can, this should be refactored to reduce complexity and reference context
 * more rather than rely on prop drilling as observed.
 */
function ProgressTabs(props: IProgressTabs) {
  const palette = usePalette();
  const notatorTools = useNotatorTools();

  if (!props.validation.validTabsByStudentIndex) return <></>;
  return (
    <Box
      sx={{
        ".MuiTabs-indicator": { display: "none" },
        ".Mui-selected": {
          color: palette.primary[2],
        },
        ".MuiTabs-flexContainer": {
          gap: getSizing(2),
        },
        ".MuiTab-root": {
          maxHeight: getSizing(4),
          minHeight: getSizing(4),
          whiteSpace: "nowrap",
        },
        maxWidth: "calc(100vw - 20rem)",
        overflowX: "auto",
      }}
    >
      <Box
        sx={{ display: "flex" }}
        color={
          props.editedSession.status === 4 || props.editedSession.status === 5
            ? palette.disabled[3]
            : "initial"
        }
      >
        {notatorTools.notatorSections.map((ns, i) => {
          const validatedStudent = notatorTools.validatedSession?.find(
            (_s) => _s.studentIndex === notatorTools.selectedStudentIndex,
          );
          if (!validatedStudent) throw new Error();

          let complete = false;

          switch (ns.sectionName!) {
            case NotatorSectionName.NUMBER_0:
              complete = validatedStudent.validatedTabs.attendance;
              break;
            case NotatorSectionName.NUMBER_1:
              complete = validatedStudent.validatedTabs.sessionTimes;
              break;
            case NotatorSectionName.NUMBER_2:
              complete = validatedStudent.validatedTabs.activities;
              break;
            case NotatorSectionName.NUMBER_3:
              complete = validatedStudent.validatedTabs.accommodations;
              break;
            case NotatorSectionName.NUMBER_4:
              complete = validatedStudent.validatedTabs.modifications;
              break;
            case NotatorSectionName.NUMBER_5:
              complete = validatedStudent.validatedTabs.goalsObjectives;
              break;
            case NotatorSectionName.NUMBER_6:
              complete = validatedStudent.validatedTabs.observations;
              break;
          }

          return (
            <StudentTab
              key={i}
              numLabel={i + 1}
              selectedStudentIndex={props.selectedStudentIndex}
              onSetTab={(v: NotatorTab) => props.onSetRequestedTab(v)}
              notatorTab={Number(ns!.sectionName)}
              selected={props.selectedTab.valueOf() === ns.sectionName}
              required={ns?.required || false}
              complete={complete}
              editedSession={props.editedSession}
            />
          );
        })}
      </Box>
    </Box>
  );
}

const DISABLED_COLOR = "rgba(0, 0, 0, 0.35)";

interface ITab {
  numLabel: number;
  notatorTab: NotatorTab;
  selected: boolean;
  complete: boolean;
  selectedStudentIndex: number;
  required: boolean;
  onSetTab: (v: NotatorTab) => void;
  editedSession: SessionResponse;
}

/**
 * This represents each individual tab of the top navbar on the notator.
 */
function StudentTab(props: ITab) {
  const palette = usePalette();
  // --- Readable Shortcut Constants ---
  const sessionIsClosed = props.editedSession.status === 5;
  const studentIsAbsent =
    !props.editedSession.studentJournalList?.[props.selectedStudentIndex].studentAttendanceRecord
      ?.present;
  const thisTabIsNotAttendance = props.notatorTab !== NotatorTab["Attendance"];

  const tabIsDisabled =
    props.notatorTab === 6 ? false : (studentIsAbsent && thisTabIsNotAttendance) || sessionIsClosed;

  const getProgressLineColor = useGetProgressLineColor();
  const getIsTabValid = useGetIsTabValid();

  return (
    <ButtonBase
      onClick={() => {
        if (tabIsDisabled) return;
        props.onSetTab(props.notatorTab);
      }}
    >
      <Box sx={{ padding: getSizing(1) }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            minHeight: getSizing(4),
            maxHeight: getSizing(4),
            paddingRight: getSizing(1),
            gap: getSizing(1),
          }}
        >
          <Typography
            variant="h6"
            sx={{
              width: "1.5rem",
              height: "1.5rem",
              borderRadius: 999,
              bgcolor: props.selected ? palette.primary[3] : "unset",
              color: tabIsDisabled ? DISABLED_COLOR : props.selected ? palette.primary[2] : "unset",
              transition: "background-color .3s ease, color .2s ease",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            id={`walkme-progress-tab-${props.numLabel}`}
          >
            {props.numLabel}
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: tabIsDisabled ? DISABLED_COLOR : props.selected ? palette.primary[2] : "unset",
              whiteSpace: "nowrap",
              // Need to bold without changing width, so I've opted for the text shadow trick.
              // Read more here: https://stackoverflow.com/a/14978871/13401967
              textShadow: props.selected ? "0px 0px 1px " + palette.primary[2] : "unset",
            }}
          >
            {NotatorTab[props.notatorTab]}
          </Typography>
        </Box>
        <Box
          sx={{
            width: "100%",
            bgcolor: palette.contrasts[3],
            height: "2px",
            position: "relative",
          }}
        >
          <Box
            sx={{
              width: "100%",
              height: "100%",
              bgcolor: getProgressLineColor({
                tabIsDisabled,
                isComplete: props.complete,
                isRequired: props.required,
                isSelected: props.selected,
                isValid: getIsTabValid(props.notatorTab),
              }),
              transition: "all .2s ease",
            }}
          ></Box>
        </Box>
      </Box>
    </ButtonBase>
  );
}

function useGetProgressLineColor() {
  const { palette } = useTheme();

  /**
   * Weighs a variety of conditions to produce a notator tab progress line color.
   */
  const getProgressLineColor = useCallback(
    (props: {
      tabIsDisabled: boolean;
      isComplete: boolean;
      isRequired: boolean;
      isSelected: boolean;
      isValid: boolean;
    }) => {
      const { tabIsDisabled, isComplete, isRequired, isSelected, isValid } = props;

      if (isValid) return palette.success[2];
      if (tabIsDisabled) return DISABLED_COLOR;
      if (isComplete) return palette.success[2];
      if (isRequired && !isSelected) return palette.error[2];

      return DISABLED_COLOR;
    },
    [],
  );

  return getProgressLineColor;
}

export default ProgressTabs;

function useGetIsTabValid() {
  const { validatedSession, selectedStudentIndex } = useNotatorTools();

  /**
   * Accepts a `NotatorTab` and will return a true/false validity status.
   */
  const getIsTabValid = useCallback((notatorTab: NotatorTab) => {
    switch (notatorTab) {
      case NotatorTab.Accommodations:
        return validatedSession?.[selectedStudentIndex].validatedTabs.accommodations!;
      case NotatorTab.Activities:
        return validatedSession?.[selectedStudentIndex].validatedTabs.activities!;
      case NotatorTab.Attendance:
        return validatedSession?.[selectedStudentIndex].validatedTabs.attendance!;
      case NotatorTab["Goals/Objectives"]:
        return validatedSession?.[selectedStudentIndex].validatedTabs.goalsObjectives!;
      case NotatorTab.Modifications:
        return validatedSession?.[selectedStudentIndex].validatedTabs.modifications!;
      case NotatorTab.Observations:
        return validatedSession?.[selectedStudentIndex].validatedTabs.observations!;
      case NotatorTab["Session Times"]:
        return validatedSession?.[selectedStudentIndex].validatedTabs.sessionTimes!;
      default:
        throw new Error("Fallthrough in switch statement!");
    }
  }, []);

  return getIsTabValid;
}
