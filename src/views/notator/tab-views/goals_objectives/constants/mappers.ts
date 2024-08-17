import { GoalAndObjectiveObservation, GoalAndObjectiveToolUsed } from "../../../../../session-sdk";

export const labelFromGoalAndObjectiveObservation: Record<GoalAndObjectiveObservation, string> = {
  [GoalAndObjectiveObservation.NUMBER_0]: "None",
  [GoalAndObjectiveObservation.NUMBER_1]: "Discontinued",
  [GoalAndObjectiveObservation.NUMBER_2]: "Mastered",
  [GoalAndObjectiveObservation.NUMBER_3]: "Not Mastered",
  [GoalAndObjectiveObservation.NUMBER_4]: "Not Yet Addressed",
  [GoalAndObjectiveObservation.NUMBER_5]: "Regression",
  [GoalAndObjectiveObservation.NUMBER_6]: "Work In Progress",
};

export const labelFromGoalAndObjectiveToolUsed: Record<GoalAndObjectiveToolUsed, string> = {
  [GoalAndObjectiveToolUsed.NUMBER_0]: "None",
  [GoalAndObjectiveToolUsed.NUMBER_1]: "Cue",
  [GoalAndObjectiveToolUsed.NUMBER_2]: "Prompt",
  [GoalAndObjectiveToolUsed.NUMBER_3]: "Model",
  [GoalAndObjectiveToolUsed.NUMBER_4]: "Verbal",
  [GoalAndObjectiveToolUsed.NUMBER_5]: "Visual",
  [GoalAndObjectiveToolUsed.NUMBER_6]: "Physical",
  [GoalAndObjectiveToolUsed.NUMBER_7]: "Prop",
};
