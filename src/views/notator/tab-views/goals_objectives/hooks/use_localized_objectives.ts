import { useState } from "react";
import { Objective } from "../../../../../profile-sdk";
import { GoalRef, ObjectiveProgression } from "../../../../../session-sdk";

/**
 * This is responsible for converting ObjectiveProgression[] to an Objective[]
 * that the dropdown UI can rely on, and also filtering out objectives that
 * aren't associated with this goal using a `GoalRef` as the referential data point.
 */
export function useObjectiveProgressionsAsObjectives(props: {
  defaultValue: Objective[];
  goalRef: GoalRef;
}): {
  selectedObjectives: Objective[];
  setObjectivesUsingProgressions: (objectives: ObjectiveProgression[]) => void;
} {
  const { goalRef, defaultValue } = props;
  const [selectedObjectives, setSelectedObjectives] = useState<Objective[]>(defaultValue);

  function setObjectivesUsingProgressions(objectives: ObjectiveProgression[]) {
    const _objectives =
      objectives
        .filter((op) => op.goalRef!.goalNumberFromVendor === goalRef.goalNumberFromVendor)
        .map((op) => op.progressedObjective!) ?? [];

    setSelectedObjectives(_objectives);
  }

  return { selectedObjectives, setObjectivesUsingProgressions };
}
