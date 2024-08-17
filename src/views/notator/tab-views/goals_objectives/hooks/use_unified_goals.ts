import { useNotatorTools } from "../../../tools";
import useNotatorStudentTools, {
  NotatorStudentTools,
} from "../../../hooks/use_edit_session_student";
import { GoalDisplay } from "../../../../../profile-sdk";
import { GoalProgression, GoalRef } from "../../../../../session-sdk";

/**
 * This is a flexible, extensible front-end-only adapted goal class that houses all of the
 * goal-related information that the front end uses in various contexts.
 *
 * @property `goalProgression` The nullable goal progression attached to a student's care provision
 * ledger. This only exists if the user has checked/toggled the associated goal on the front end.
 */
export interface UnifiedGoal {
  goalRef: GoalRef;
  goalDisplay: GoalDisplay;
  goalProgression: GoalProgression | null;
}

export function useUnifiedGoals(props: {
  goalRefs: GoalRef[];
  activeGoals: GoalDisplay[] | null;
  indexOverride?: number;
}): UnifiedGoal[] | null {
  const { goalRefs, activeGoals } = props;
  const notatorTools = useNotatorTools();
  const studentTools = useNotatorStudentTools({
    notatorTools,
    indexOverride: props.indexOverride,
  });

  const awaitingResultOrHasNoGoals = activeGoals === null || activeGoals.length === 0;
  if (awaitingResultOrHasNoGoals) return null;

  const res: UnifiedGoal[] = [];
  goalRefs.forEach((goalRef: GoalRef) => {
    const unifiedGoal: UnifiedGoal | null = deriveUnifiedGoal({
      goalRef,
      studentTools,
      activeGoals,
    });

    if (unifiedGoal) {
      res.push(unifiedGoal);
    }
  });

  return res;

  function deriveUnifiedGoal(props: {
    goalRef: GoalRef;
    studentTools: NotatorStudentTools;
    activeGoals: GoalDisplay[];
  }): UnifiedGoal | null {
    const { studentTools, goalRef } = props;

    const goalProgression =
      studentTools.draftStudent.careProvisionLedger!.goalProgresssions!.find(
        (gp) => gp.progressedGoal!.goalNumberFromVendor === props.goalRef.goalNumberFromVendor,
      ) ?? null;

    const goalDisplay = props.activeGoals.find(
      (gd) => gd.number! === props.goalRef.goalNumberFromVendor!,
    )!;

    if (!goalDisplay) {
      return null;
    }

    return { goalProgression, goalDisplay, goalRef };
  }
}
