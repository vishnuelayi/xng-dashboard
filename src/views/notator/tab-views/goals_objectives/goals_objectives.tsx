import { TabInnerViewportLayout } from "../../layouts/inner_viewport_headers";
import { useState } from "react";
import { EditGoalsModal } from "./edit_goals_modal";
import { Box, Divider } from "@mui/material";
import { useStudentGoalInventoryV1 } from "./hooks/use_student_goal_inventory_v1";
import { useFetchActiveGoals } from "./api-hooks/use_fetch_active_goals";
import { useUnifiedGoals } from "./hooks/use_unified_goals";
import { StudentGoalOption } from "./components/student_goal_option";
import { useNotatorTools } from "../../tools";

export default function GoalsObjectivesTabView(props: { isAllStudentView?: boolean,  selectedStudentIndex?: number; }) {

  const selectedStudentIndex = props.selectedStudentIndex || 0;

  const activeGoals = useFetchActiveGoals({
    indexOverride: props.isAllStudentView ? selectedStudentIndex : undefined,
  });
  const studentGoalInventory = useStudentGoalInventoryV1({
    indexOverride: props.isAllStudentView ? selectedStudentIndex : undefined,
  });
  const unifiedGoals = useUnifiedGoals({
    goalRefs: studentGoalInventory,
    activeGoals: activeGoals,
    indexOverride: props.isAllStudentView ? selectedStudentIndex : undefined,
  });
  const [showGoalsModal, setShowGoalsModal] = useState<boolean>(false);

  return (
    <>
      {/* Modals */}
      <EditGoalsModal
        key={0}
        show={showGoalsModal}
        onClose={() => setShowGoalsModal(false)}
        displayData={{ activeGoals }}
        selectedStudentIndex={selectedStudentIndex}
      />

      {/* Content */}
      <TabInnerViewportLayout
        title="Goals & Objective Progress Tracking"
        useLink={{ text: "Edit Goal List", onClick: () => setShowGoalsModal(true) }}
        isAllStudentView={props.isAllStudentView}
      >
        {unifiedGoals?.map((ug, i) => {
          return (
            <Box key={`${selectedStudentIndex}-${i}`}>
              {i !== 0 && <Divider />}

              <StudentGoalOption unifiedGoal={ug} />
            </Box>
          );
        })}
      </TabInnerViewportLayout>
    </>
  );
}
