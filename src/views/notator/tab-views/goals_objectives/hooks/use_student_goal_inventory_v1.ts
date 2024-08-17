import { useNotatorTools } from "../../../tools";
import useNotatorStudentTools from "../../../hooks/use_edit_session_student";
import { GoalRef } from "../../../../../session-sdk";

/**
 * After talking with Paul, we plan on replacing this in
 * accordance with a coming refactor to our session schema.
 */
export function useStudentGoalInventoryV1(props?: { indexOverride?: number }): GoalRef[] {
  const notatorTools = useNotatorTools();
  const studentTools = useNotatorStudentTools({
    notatorTools,
    indexOverride: props?.indexOverride,
  });

  const res: GoalRef[] = studentTools.draftStudent.goalInventory!;
  return res;
}
