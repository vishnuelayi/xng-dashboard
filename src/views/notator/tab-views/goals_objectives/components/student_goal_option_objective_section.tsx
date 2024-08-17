import { Objective } from "../../../../../profile-sdk";
import { Box, Typography, Divider } from "@mui/material";
import { GoalRef, ObjectiveProgression } from "../../../../../session-sdk";
import { XNGSearchMultiselect } from "../../../../../design/low-level/search_multiselect";
import useNotatorStudentTools from "../../../hooks/use_edit_session_student";
import { useNotatorTools } from "../../../tools";
import { StudentObjectiveOption } from "./student_objective_option";
import { UnifiedGoal } from "../hooks/use_unified_goals";
import { useObjectiveProgressionsAsObjectives } from "../hooks/use_localized_objectives";
import { produce } from "immer";
import { useEffect } from "react";

/**
 * TODO: Refactor this entire module to minimize its reliance on custom hooks. And implement Immer
 * for direct updates. We'll probably get to do this alongside the coming refactor of the session
 * schema.
 */
export function StudentGoalOptionObjectiveSection(props: { unifiedGoal: UnifiedGoal }) {
  const { readOnly, selectedStudentIndex, draftSession, setDraftSession } = useNotatorTools();
  const fullList = props.unifiedGoal.goalDisplay.objectives ?? [];
  const goalRef = props.unifiedGoal.goalRef;

  const progressedObjectives = useLocalAdaptedProgressedObjectives({
    goalRef,
    fullList,
    selectedStudentIndex,
  });

  const generateOptionText = (objective: Objective) => {
    const number = objective?.number ?? 0;
    const description = objective?.description ?? "";

    return `${number.toString().padStart(4, "0").slice(-4)} - ${description.slice(0, 50)}${
      description.length > 50 ? "..." : ""
    }`;
  };

  // TODO: We'll have to clarify this or reduce the difficulty of using `useObjectiveProgressionsAsObjectives`
  const { selectedObjectives, setObjectivesUsingProgressions } =
    useObjectiveProgressionsAsObjectives({
      goalRef: props.unifiedGoal.goalRef,
      defaultValue:
        draftSession
          .studentJournalList![
            selectedStudentIndex
          ].careProvisionLedger!.objectiveProgressions!.filter((op) => {
            return op.goalRef!.goalNumberFromVendor === goalRef.goalNumberFromVendor;
          })
          .map((op) => op.progressedObjective!) ?? [],
    });

  function refreshDropdownOptions() {
    const progs = draftSession.studentJournalList![
      selectedStudentIndex
    ].careProvisionLedger?.objectiveProgressions!.filter(
      (op) => op.goalRef?.goalNumberFromVendor === goalRef.goalNumberFromVendor,
    )!;

    setObjectivesUsingProgressions(progs);
  }

  useEffect(() => {
    refreshDropdownOptions();
  }, [
    draftSession.studentJournalList![selectedStudentIndex].careProvisionLedger!
      .objectiveProgressions,
  ]);

  function removeObjective(objective: Objective) {
    if (!objective) return;

    const updatedProgressions =
      draftSession.studentJournalList![
        selectedStudentIndex
      ].careProvisionLedger?.objectiveProgressions!.filter(
        (op) => op.progressedObjective?.number !== objective.number,
      ) ?? [];

    const localProgressions = updatedProgressions.filter(
      (op) => op.goalRef?.goalNumberFromVendor === goalRef.goalNumberFromVendor,
    );

    setObjectivesUsingProgressions(localProgressions);
    setDraftSession(
      produce((draft) => {
        draft.studentJournalList![selectedStudentIndex].careProvisionLedger!.objectiveProgressions =
          updatedProgressions;
      }),
    );
  }

  function handleDropdownChange(newSelectedObjectives: Objective[]) {
    const action: SelectedObjectiveActionStatus = detectUserAction(
      selectedObjectives,
      newSelectedObjectives,
    );

    if (action === "adding") {
      const addedObjective = newSelectedObjectives.find(
        (newObj) => !selectedObjectives.some((currObj) => currObj.number === newObj.number),
      );

      if (addedObjective) {
        const newProgression: ObjectiveProgression = {
          progressedObjective: addedObjective,
          successes: 0,
          attempts: 0,
          percentageComplete: 0,
          goalRef,
        };

        const updatedProgressions = [
          ...draftSession.studentJournalList![selectedStudentIndex].careProvisionLedger
            ?.objectiveProgressions!,
          newProgression,
        ];

        const localProgressions = updatedProgressions.filter(
          (op) => op.goalRef?.goalNumberFromVendor === goalRef.goalNumberFromVendor,
        );

        setObjectivesUsingProgressions(localProgressions);

        setDraftSession(
          produce((draft) => {
            draft.studentJournalList![
              selectedStudentIndex
            ].careProvisionLedger!.objectiveProgressions = updatedProgressions;
          }),
        );
      }
    } else if (action === "removing") {
      const removedObjective = selectedObjectives.find(
        (currObj) => !newSelectedObjectives.some((newObj) => newObj.number === currObj.number),
      );

      if (!removedObjective) return;
      removeObjective(removedObjective);
    }
  }

  return (
    <>
      {fullList && (
        <Box sx={{ display: "flex", alignItems: "center", gap: "1rem", my: "1rem" }}>
          <Typography className="noselect" sx={{ color: readOnly ? "grey" : "inherit" }}>
            <b>Document on Specific Objective (if needed):</b>
          </Typography>
          <XNGSearchMultiselect
            disabled={readOnly}
            options={fullList}
            selectedOptions={selectedObjectives}
            onChange={handleDropdownChange}
            getOptionLabel={(o) => o && generateOptionText(o)}
            getTooltip={(o) => o && o.description!}
            variant="no overflow after 1"
            sx={{ minWidth: "23rem" }}
            isOptionEqualToValue={(o, v) => o.number === v.number}
          />
        </Box>
      )}

      {progressedObjectives.map((apo, i) => (
        <Box key={i}>
          <Divider className="noselect" sx={{ color: "#3339" }} textAlign="left">
            {apo.progressedObjective && generateOptionText(apo.progressedObjective)}
          </Divider>

          <StudentObjectiveOption key={i} rerenderKey={i} adaptedObjectiveProgression={apo} />
        </Box>
      ))}
    </>
  );
}

export type AdaptedObjectiveProgression = ObjectiveProgression & { listItemIndex: number };

/**
 * This will return only the objectives that correlate with this goal.
 */
function useLocalAdaptedProgressedObjectives(props: {
  goalRef: GoalRef;
  fullList: Objective[];
  selectedStudentIndex?: number;
}): AdaptedObjectiveProgression[] {
  const notatorTools = useNotatorTools();
  const { draftStudent } = useNotatorStudentTools({
    notatorTools,
    indexOverride: props.selectedStudentIndex,
  });
  const { goalRef, fullList } = props;

  // Get only objective progressions associated with this goal
  const onlyLocal: ObjectiveProgression[] =
    draftStudent.careProvisionLedger?.objectiveProgressions?.filter((op) => {
      return op.goalRef!.goalNumberFromVendor === goalRef.goalNumberFromVendor;
    }) ?? [];

  // Get only objective progressions associated with this goal
  const res = onlyLocal.map((op) => {
    const matched = fullList.find((o) => o.number === op.progressedObjective?.number)!;

    const listItemIndex = fullList.indexOf(matched)!;

    return { ...op, listItemIndex: listItemIndex } as AdaptedObjectiveProgression;
  })!;

  return res;
}

type SelectedObjectiveActionStatus = "adding" | "removing";
function detectUserAction(
  currentObjectives: Objective[],
  newObjectives: Objective[],
): SelectedObjectiveActionStatus {
  if (newObjectives.length > currentObjectives.length) {
    return "adding";
  } else {
    return "removing";
  }
}
