import GoalOrObjectiveDashboard, { NewMastery } from "../goal_or_objective_dashboard";
import { Box } from "@mui/material";
import FadeIn from "../../../../../design/components-dev/FadeIn";
import { AdaptedObjectiveProgression } from "./student_goal_option_objective_section";

import { useNotatorTools } from "../../../tools";
import { produce } from "immer";
import { useMemo } from "react";
import { GoalAndObjectiveObservation, GoalAndObjectiveToolUsed } from "../../../../../session-sdk";

type ObjectiveResultProps = {
  adaptedObjectiveProgression: AdaptedObjectiveProgression;
  rerenderKey: number;
};

/**
 * This component renders an objective option.
 */
export function StudentObjectiveOption(props: Readonly<ObjectiveResultProps>) {
  const { adaptedObjectiveProgression, rerenderKey } = props;
  const { draftSession, setDraftSession, selectedStudentIndex } = useNotatorTools();
  const progressionIndex = useObjectiveProgressionIndex(adaptedObjectiveProgression);

  function handleRemoveObjective() {
    setDraftSession(
      produce((draft) => {
        const updatedProgressions =
          draftSession.studentJournalList![
            selectedStudentIndex
          ]?.careProvisionLedger!.objectiveProgressions!.filter(
            (op) =>
              op.progressedObjective?.number !==
              adaptedObjectiveProgression.progressedObjective?.number,
          ) ?? [];

        draft.studentJournalList![
          selectedStudentIndex
        ]!.careProvisionLedger!.objectiveProgressions = updatedProgressions;
      }),
    );
  }

  const { attempts, successes, percentageComplete } = useMasteryVisualState(progressionIndex);

  const handleSetMastery = useHandleSetMastery(progressionIndex);
  const handleSetObservation = useHandleSetObservation(progressionIndex);
  const handleSetToolsUsed = useHandleSetToolsUsed(progressionIndex);
  const handleNotesChange = useHandleNotesChange(progressionIndex);

  return (
    <Box key={rerenderKey}>
      <FadeIn>
        <GoalOrObjectiveDashboard
          type="objective"
          state={{
            showInputs: true,
            description: {
              boldPrefix: `Objective ${props.adaptedObjectiveProgression.progressedObjective?.number}:`,
              content: props.adaptedObjectiveProgression.progressedObjective?.description!,
            },
            isChecked: true,
            attempts,
            successes,
            percentageComplete,
            observation: props.adaptedObjectiveProgression.objectiveObservation!,
            toolUsed: props.adaptedObjectiveProgression.objectiveToolUsed!,
            notes: props.adaptedObjectiveProgression.objectiveNarrative!,
          }}
          callbacks={{
            onCheckboxClick: handleRemoveObjective,
            onNotesChange: handleNotesChange,
            onSetMastery: handleSetMastery,
            onToolUsedChange: handleSetToolsUsed,
            onObservationChange: handleSetObservation,
          }}
        />
      </FadeIn>
    </Box>
  );
}

function useMasteryVisualState(progressionIndex: number) {
  const { selectedStudentIndex, draftSession } = useNotatorTools();

  const attempts = useMemo(
    () =>
      draftSession.studentJournalList![selectedStudentIndex].careProvisionLedger!
        .objectiveProgressions![progressionIndex]?.attempts ?? 0,
    [
      draftSession.studentJournalList![selectedStudentIndex]!.careProvisionLedger!
        .objectiveProgressions![progressionIndex],
    ],
  );
  const successes = useMemo(
    () =>
      draftSession.studentJournalList![selectedStudentIndex].careProvisionLedger!
        .objectiveProgressions![progressionIndex]?.successes ?? 0,
    [
      draftSession.studentJournalList![selectedStudentIndex].careProvisionLedger!
        .objectiveProgressions![progressionIndex]?.successes,
    ],
  );
  const percentageComplete = useMemo(
    () =>
      draftSession.studentJournalList![selectedStudentIndex].careProvisionLedger!
        .objectiveProgressions![progressionIndex]?.percentageComplete ?? 0,
    [
      draftSession.studentJournalList![selectedStudentIndex].careProvisionLedger!
        .objectiveProgressions![progressionIndex]?.percentageComplete,
    ],
  );

  return { attempts, successes, percentageComplete };
}

function useHandleSetMastery(progressionIndex: number) {
  const { setDraftSession, selectedStudentIndex, draftSession } = useNotatorTools();

  function handleSetMastery(v: NewMastery) {
    setDraftSession(
      produce(draftSession, (draft) => {
        console.log({ progressionIndex });
        console.log(
          draftSession.studentJournalList![selectedStudentIndex].careProvisionLedger!
            .objectiveProgressions,
        );

        if (v.newAttempts !== undefined) {
          draft.studentJournalList![
            selectedStudentIndex
          ].careProvisionLedger!.objectiveProgressions![progressionIndex]!.attempts = v.newAttempts;
        }
        if (v.newSuccesses !== undefined) {
          draft.studentJournalList![
            selectedStudentIndex
          ].careProvisionLedger!.objectiveProgressions![progressionIndex].successes =
            v.newSuccesses;
        }
        if (v.newPercentageComplete !== undefined) {
          draft.studentJournalList![
            selectedStudentIndex
          ].careProvisionLedger!.objectiveProgressions![progressionIndex].percentageComplete =
            Math.floor(v.newPercentageComplete);
        }
      }),
    );
  }

  return handleSetMastery;
}

function useObjectiveProgressionIndex(adaptedObjectiveProgression: AdaptedObjectiveProgression) {
  const { draftSession, selectedStudentIndex } = useNotatorTools();

  const currentObjectiveProgressions =
    draftSession.studentJournalList![selectedStudentIndex].careProvisionLedger!
      .objectiveProgressions!;

  const progressionIndex = currentObjectiveProgressions.findIndex(
    (op) =>
      op.progressedObjective!.internalId ===
      adaptedObjectiveProgression.progressedObjective!.internalId,
  );

  return progressionIndex;
}

function useHandleSetObservation(
  progressionIndex: number,
): (v: GoalAndObjectiveObservation) => void {
  const { setDraftSession, selectedStudentIndex } = useNotatorTools();

  function setObservationList(v: GoalAndObjectiveObservation) {
    console.log(v);

    setDraftSession(
      produce((draft) => {
        draft.studentJournalList![selectedStudentIndex].careProvisionLedger!.objectiveProgressions![
          progressionIndex
        ].objectiveObservation = v;
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
        draft.studentJournalList![selectedStudentIndex].careProvisionLedger!.objectiveProgressions![
          progressionIndex
        ].objectiveToolUsed = v;
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
        draft.studentJournalList![selectedStudentIndex].careProvisionLedger!.objectiveProgressions![
          progressionIndex
        ].objectiveNarrative = v;
      }),
    );
  }

  return handleNotesChange;
}
