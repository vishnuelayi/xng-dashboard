import { Box, Typography } from "@mui/material";
import GoalOrObjectiveDashboard, { NewMastery } from "../goal_or_objective_dashboard";
import { StudentGoalOptionObjectiveSection } from "./student_goal_option_objective_section";
import { UnifiedGoal } from "../hooks/use_unified_goals";
import NOTATOR_GOAL_VIEW_STYLE_CONSTANTS from "../constants/notator_goal_view_style_constants";
import {
  GoalAndObjectiveObservation,
  GoalAndObjectiveToolUsed,
  GoalProgression,
} from "../../../../../session-sdk";
import { useNotatorTools } from "../../../tools";
import { produce } from "immer";
import { useMemo } from "react";

/**
  This is a smart component responsible for goal data operations. It also conditionally
  renders a list of objectives that control their own data operations respectively.
  
  Read more about smart/dumb components:
  https://medium.com/@dan_abramov/smart-and-dumb-components-7ca2f9a7c7d0
  https://medium.com/@thejasonfile/dumb-components-and-smart-components-e7b33a698d43
 */
export function StudentGoalOption(props: Readonly<{ unifiedGoal: UnifiedGoal }>) {
  const { readOnly, selectedStudentIndex, draftSession } = useNotatorTools();
  const { unifiedGoal } = props;

  const progressionIndex = useMemo(() => {
    return draftSession.studentJournalList![
      selectedStudentIndex
    ].careProvisionLedger!.goalProgresssions!.findIndex((gp) => {
      return (
        gp.progressedGoal?.goalNumberFromVendor ===
        props.unifiedGoal.goalProgression?.progressedGoal?.goalNumberFromVendor
      );
    });
  }, [
    draftSession.studentJournalList![selectedStudentIndex].careProvisionLedger!.goalProgresssions,
  ]);

  const showInputs = Boolean(props.unifiedGoal.goalProgression);
  const { attempts, successes, percentageComplete } = useMasteryVisualState(progressionIndex);
  const handleSetMastery = useHandleSetMastery(progressionIndex);
  const handleGoalCheckboxClick = useHandleGoalCheckboxClick({ progressionIndex, unifiedGoal });
  const handleSetObservation = useHandleSetObservation(progressionIndex);
  const handleSetToolsUsed = useHandleSetToolsUsed(progressionIndex);
  const handleNotesChange = useHandleNotesChange(progressionIndex);

  const goalProgression = useMemo(
    () =>
      draftSession.studentJournalList![selectedStudentIndex].careProvisionLedger!
        .goalProgresssions?.[progressionIndex] ?? null,
    [draftSession.studentJournalList![selectedStudentIndex].careProvisionLedger!.goalProgresssions],
  );

  return (
    <Box pb="1rem">
      <Box sx={{ display: "flex", gap: ".5rem", padding: "2rem 0 1rem 0" }}>
        <Typography sx={{ color: readOnly ? "grey" : "inherit" }}>
          <b>{`Goal Number: ${props.unifiedGoal.goalDisplay.number!}`}</b>
        </Typography>
        <Typography sx={{ color: readOnly ? "grey" : "inherit" }}>
          <b>{`Goal Focus: ${props.unifiedGoal.goalDisplay.goalAreaOfFocus!.name!}`}</b>
        </Typography>
      </Box>

      <GoalOrObjectiveDashboard
        type="goal"
        state={{
          isChecked: Boolean(
            draftSession.studentJournalList![selectedStudentIndex].careProvisionLedger!
              .goalProgresssions![progressionIndex]?.progressedGoal ?? false,
          ),
          showInputs,
          description: { content: props.unifiedGoal.goalDisplay.description! },
          attempts,
          successes,
          percentageComplete,
          observation: goalProgression?.goalObservation,
          toolUsed: goalProgression?.goalToolUsed!,
          notes: goalProgression?.goalNarrative!,
        }}
        callbacks={{
          onNotesChange: handleNotesChange,
          onCheckboxClick: handleGoalCheckboxClick,
          onSetMastery: handleSetMastery,
          onToolUsedChange: handleSetToolsUsed,
          onObservationChange: handleSetObservation,
        }}
      />

      {showInputs && (
        <Box sx={{ pl: NOTATOR_GOAL_VIEW_STYLE_CONSTANTS.viewIndentionsRem }}>
          <StudentGoalOptionObjectiveSection unifiedGoal={props.unifiedGoal} />
        </Box>
      )}
    </Box>
  );
}

function useHandleSetMastery(progressionIndex: number) {
  const { setDraftSession, selectedStudentIndex, draftSession } = useNotatorTools();

  function handleSetMastery(v: NewMastery) {
    setDraftSession(
      produce(draftSession, (draft) => {
        if (v.newAttempts !== undefined) {
          draft.studentJournalList![selectedStudentIndex].careProvisionLedger!.goalProgresssions![
            progressionIndex
          ]!.attempts = v.newAttempts;
        }
        if (v.newSuccesses !== undefined) {
          draft.studentJournalList![selectedStudentIndex].careProvisionLedger!.goalProgresssions![
            progressionIndex
          ].successes = v.newSuccesses;
        }
        if (v.newPercentageComplete !== undefined) {
          draft.studentJournalList![selectedStudentIndex].careProvisionLedger!.goalProgresssions![
            progressionIndex
          ].percentageComplete = Math.floor(v.newPercentageComplete);
        }
      }),
    );
  }

  return handleSetMastery;
}

function useHandleGoalCheckboxClick(props: { unifiedGoal: UnifiedGoal; progressionIndex: number }) {
  const { setDraftSession, selectedStudentIndex, draftSession } = useNotatorTools();

  function handleGoalCheckboxClick() {
    setDraftSession(
      produce((draft) => {
        const status = props.unifiedGoal.goalProgression ? "removing" : "adding";

        if (status === "adding") {
          console.log("adding");
          const newGoalProgression: GoalProgression = {
            progressedGoal: {
              goalNumberFromVendor: props.unifiedGoal.goalDisplay.number,
              description: props.unifiedGoal.goalDisplay.description,
            },
          };
          draft.studentJournalList![
            selectedStudentIndex
          ].careProvisionLedger!.goalProgresssions!.push(newGoalProgression);
        }

        if (status === "removing") {
          console.log({ draftSession });
          console.log(props.progressionIndex);

          draft.studentJournalList![
            selectedStudentIndex
          ].careProvisionLedger!.goalProgresssions!.splice(props.progressionIndex, 1);
        }
      }),
    );
  }

  return handleGoalCheckboxClick;
}

function useMasteryVisualState(progressionIndex: number) {
  const { selectedStudentIndex, draftSession } = useNotatorTools();

  const attempts = useMemo(
    () =>
      draftSession.studentJournalList![selectedStudentIndex].careProvisionLedger!
        .goalProgresssions![progressionIndex]?.attempts ?? 0,
    [
      draftSession.studentJournalList![selectedStudentIndex]!.careProvisionLedger!
        .goalProgresssions![progressionIndex]?.attempts,
    ],
  );
  const successes = useMemo(
    () =>
      draftSession.studentJournalList![selectedStudentIndex].careProvisionLedger!
        .goalProgresssions![progressionIndex]?.successes ?? 0,
    [
      draftSession.studentJournalList![selectedStudentIndex].careProvisionLedger!
        .goalProgresssions![progressionIndex]?.successes,
    ],
  );
  const percentageComplete = useMemo(
    () =>
      draftSession.studentJournalList![selectedStudentIndex].careProvisionLedger!
        .goalProgresssions![progressionIndex]?.percentageComplete ?? 0,
    [
      draftSession.studentJournalList![selectedStudentIndex].careProvisionLedger!
        .goalProgresssions![progressionIndex]?.percentageComplete,
    ],
  );

  return { attempts, successes, percentageComplete };
}

function useHandleSetObservation(
  progressionIndex: number,
): (v: GoalAndObjectiveObservation) => void {
  const { setDraftSession, selectedStudentIndex } = useNotatorTools();

  function setObservationList(v: GoalAndObjectiveObservation) {
    console.log(v);

    setDraftSession(
      produce((draft) => {
        draft.studentJournalList![selectedStudentIndex].careProvisionLedger!.goalProgresssions![
          progressionIndex
        ].goalObservation = v;
      }),
    );
  }

  return setObservationList;
}

function useHandleSetToolsUsed(progressionIndex: number) {
  const { setDraftSession, selectedStudentIndex } = useNotatorTools();

  function handleSetToolsUsed(v: GoalAndObjectiveToolUsed) {
    console.log(v);

    setDraftSession(
      produce((draft) => {
        draft.studentJournalList![selectedStudentIndex].careProvisionLedger!.goalProgresssions![
          progressionIndex
        ].goalToolUsed = v;
      }),
    );
  }

  return handleSetToolsUsed;
}

function useHandleNotesChange(progressionIndex: number) {
  const { setDraftSession, selectedStudentIndex } = useNotatorTools();

  function handleNotesChange(v: string) {
    console.log(v);

    setDraftSession(
      produce((draft) => {
        draft.studentJournalList![selectedStudentIndex].careProvisionLedger!.goalProgresssions![
          progressionIndex
        ].goalNarrative = v;
      }),
    );
  }

  return handleNotesChange;
}
