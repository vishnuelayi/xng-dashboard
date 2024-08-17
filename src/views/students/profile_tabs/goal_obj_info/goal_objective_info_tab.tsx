import { Box } from "@mui/material";
import GoalInfoTabHeader from "./component/presentational/goal_info_tab_header";
import { Goal, StudentResponse } from "../../../../profile-sdk";
import React from "react";
import GoalGridListView from "./component/presentational/goal_grid_list_view";
import GoalCreateEditView from "./component/presentational/goal_create_edit_view";
import { useStudentProfileContext } from "../../context/context";

type Props = {
  state: string;
  edited_student: StudentResponse;
  set_edited_student: React.Dispatch<React.SetStateAction<StudentResponse | null>>;
};

/**
 * Renders the Goal Objective Info tab.
 *
 * @param {Props} props - The component props.
 * @returns {JSX.Element} The rendered Goal Objective Info tab.
 */
export const GoalObjectiveInfoTab = (props: Props) => {
  // gets all the goals from the student object
  const all_goals = React.useMemo(() => {
    return props.edited_student.spedDossier?.prescribedCareProvisionsLedger?.goals || [];
  }, [props.edited_student]);

  // checks if the user is in the edit goal view
  const [in_edit_goal_view, set_in_edit_goal_view] = React.useState<boolean>(false);

  /* 
  gets updated to a goal or an empty object when a goal is selected or when the user clicks the back button or navigates to the edit goal view without clicking on a card
  */
  const [goal_selected, set_goal_selected] = React.useState<Goal>({});

  /**
   * Updates or adds the selected goal.
   *
   * @param {Goal} goal - The goal to update or add.
   * @returns {void}
   */
  const handle_update_or_add_selected_goal = (goal: Goal) => {
    set_goal_selected(goal);
  };

  const studentContext = useStudentProfileContext();
  /**
   * Saves the goal and updates the student's information.
   *
   * @param updated_student - The updated student object.
   * @param current_student - The current student object.
   * @returns A boolean indicating whether the goal was successfully saved or not.
   */
  const handleSaveGoal = async (
    updated_student: StudentResponse,
    current_student: StudentResponse,
  ): Promise<boolean> => {
    props.set_edited_student(updated_student);
    try {
      await studentContext.handleSave(updated_student);
      return true;
    } catch (err) {
      props.set_edited_student(current_student);
      return false;
    }
  };

  return (
    <Box px={"12px"} pt={"0.5rem"} maxWidth={"xl"}>
      {!in_edit_goal_view ? (
        <>
          <GoalInfoTabHeader
            use_save_btn={{
              label: "Create New Goal",
              onClick() {
                handle_update_or_add_selected_goal({});
                set_in_edit_goal_view(true);
              },
            }}
          />
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: "1rem",

              justifyContent: {
                xs: "center",
                md: "flex-start",
              },
            }}
          >
            <GoalGridListView
              goals={all_goals}
              onGoalCardClick={(g) => {
                handle_update_or_add_selected_goal(g);
                set_in_edit_goal_view(true);
              }}
            />
          </Box>
        </>
      ) : (
        <GoalCreateEditView
          edited_student={props.edited_student}
          selected_goal={goal_selected}
          onGoalSaved={handleSaveGoal}
          onBackBtnClick={() => {
            handle_update_or_add_selected_goal({});
            set_in_edit_goal_view(false);
          }}
        />
      )}
    </Box>
  );
};
