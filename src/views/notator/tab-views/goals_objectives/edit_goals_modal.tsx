import { useEffect, useState } from "react";
import { GoalAreaOfFocus, GoalDisplay } from "../../../../profile-sdk";
import { GoalRef } from "../../../../session-sdk";
import { useNotatorTools } from "../../tools";
import useNotatorStudentTools from "../../hooks/use_edit_session_student";
import { useXNGSelector } from "../../../../context/store";
import { selectStateInUS } from "../../../../context/slices/stateInUsSlice";
import { API_STATESNAPSHOTS } from "../../../../api/api";
import { Modal, Container, Paper, Typography, Grid, Button } from "@mui/material";
import XNGClose from "../../../../design/low-level/button_close";
import Box from "../../../../design/components-dev/BoxExtended";
import XNGDropDown from "../../../../design/low-level/dropdown2";
import { GoalCard } from "../../components/GoalCard";

/**
 * This function serves to encapsulate the previous EditGoalsModal's code in an isolated environment,
 * without requiring the slew of unnecessary parameters that it once did.
 */
export function EditGoalsModal(props: {
  show: boolean;
  onClose: () => void;
  displayData: {
    activeGoals: GoalDisplay[] | null;
  };
  selectedStudentIndex?: number;
}) {
  const notatorTools = useNotatorTools();
  const { draftSession, setDraftSession } = notatorTools;
  const { draftStudent, editDraftStudent } = useNotatorStudentTools({
    notatorTools,
    indexOverride: props.selectedStudentIndex,
  });

  return (
    <GoalModal
      showGoalsModal={props.show}
      onClose={() => props.onClose()}
      studentId={draftStudent.student!.id!}
      goalInventory={draftStudent.goalInventory!}
      sessionDate={draftSession.meetingDetails!.startTime!}
      allActiveGoals={props.displayData.activeGoals ?? []}
      onSave={(newGoalInventory: GoalRef[]) => {
        if (newGoalInventory.length > 1) {
          newGoalInventory.sort((a: GoalRef, b: GoalRef) => {
            const a_goal = props.displayData.activeGoals?.find((goal) => {
              return goal.number == a.goalNumberFromVendor;
            });
            const b_goal = props.displayData.activeGoals?.find((goal) => {
              return goal.number == b.goalNumberFromVendor;
            });

            const date1 = new Date(a_goal?.endDate?.toLocaleString().slice(0, 10)!);
            const date2 = new Date(b_goal?.endDate?.toLocaleString().slice(0, 10)!);

            let Difference_In_Time = date2.getTime() - date1.getTime();

            let Difference_In_Days = Math.round(Difference_In_Time / (1000 * 3600 * 24));
            return Difference_In_Days;
          });
        }
        
        const freshSession = editDraftStudent("goalInventory", newGoalInventory);
        setDraftSession(freshSession);
      }}
    />
  );
}

/**
 * INFO: This code was originally part of the pre-refactor notator codebase. For improved usability,
 * it has been internalized within this module, making it inaccessible from the outside and only available
 * to the exportable component in this file.
 *
 * For future enhancement: Let's consider retiring these current components and rebuilding one with our
 * evolving best practices in mind.
 */
function GoalModal(props: {
  studentId: string;
  sessionDate: Date;
  onClose: () => void;
  showGoalsModal: boolean;
  goalInventory: GoalRef[];
  onSave: (goalInventory: GoalRef[]) => void;
  allActiveGoals: GoalDisplay[] | undefined;
}) {
  const [goalInventory, setGoalInventory] = useState<GoalRef[]>(props.goalInventory);
  const [allActiveGoalOptions, setAllActiveGoalOptions] = useState<GoalDisplay[]>();

  useEffect(() => {
    setGoalInventory(props.goalInventory);
    setAllActiveGoalOptions(props.allActiveGoals);
  }, [props.showGoalsModal]);

  //GoalDisplay instead of PrescribedGoal
  const handleToggle = (goal: GoalRef) => {
    var newGoalInventory = goalInventory;

    const indexOfGoalInInventory = newGoalInventory.findIndex(
      (g) => g.goalNumberFromVendor === goal.goalNumberFromVendor,
    );
    if (indexOfGoalInInventory === -1) {
      const goalRef: GoalRef = {
        goalNumberFromVendor: goal.goalNumberFromVendor,
        description: goal.description,
      };
      newGoalInventory.push(goalRef);
    } else {
      newGoalInventory.splice(indexOfGoalInInventory, 1);
    }
    setGoalInventory([...newGoalInventory]);
  };
  return (
    <EditGoalListModal
      modalState={{
        open: props.showGoalsModal,
        onClose: () => props.onClose(),
      }}
      goals={allActiveGoalOptions ?? []}
      goalSelectState={{
        checked(goal) {
          return goalInventory.some((g) => g.goalNumberFromVendor === goal.goalNumberFromVendor);
        },
        onSelect(goal) {
          handleToggle(goal);
        },
      }}
      onSave={() => {
        props.onClose();
        props.onSave(goalInventory);
      }}
    />
  );
}

/**
 * INFO: This code was originally part of the pre-refactor notator codebase. For improved usability,
 * it has been internalized within this module, making it inaccessible from the outside and only available
 * to the exportable component in this file.
 *
 * For future enhancement: Let's consider retiring these current components and rebuilding one with our
 * evolving best practices in mind.
 */
function EditGoalListModal({
  modalState,
  goals,
  goalSelectState,
  onSave,
}: {
  modalState: {
    open: boolean;
    onClose: () => void;
  };
  goalSelectState: {
    checked: (goal: GoalRef) => boolean;
    onSelect: (goal: GoalRef) => void;
  };
  goals: GoalDisplay[];
  onSave: () => void;
}) {
  const [goalAreaOfFocusOptions, setGoalAreaOfFocusOptions] = useState<GoalAreaOfFocus[]>([]);
  const [goalAreaOfFocusFilter, setGoalAreaOfFocusFilter] = useState<string>("All");
  const [filteredGoals, setFilteredGoals] = useState<GoalDisplay[]>(goals);

  const state = useXNGSelector(selectStateInUS);
  const goalAreaOfFocusNames = goalAreaOfFocusOptions
    .filter((aof) => aof !== undefined)
    .map((aof) => aof.name) as string[];
  async function getGoalAreasOfFocus() {
    const response = await API_STATESNAPSHOTS.v1StateSnapshotsGoalAreasOfFocusGet(state);
    setGoalAreaOfFocusOptions(response.areasOfFocus ?? []);
    // setGoalAreaOfFocusFilter(response.areasOfFocus?.at(0));
  }

  useEffect(() => {
    getGoalAreasOfFocus();
  }, []);

  useEffect(() => {
    if (goalAreaOfFocusFilter === "All") {
      setFilteredGoals(goals);
    } else {
      const tempFilteredGoals = goals.filter(
        (g) =>
          g.goalAreaOfFocus?.name?.toLocaleLowerCase() ===
          goalAreaOfFocusFilter.toLocaleLowerCase(),
      );
      setFilteredGoals(tempFilteredGoals);
    }
  }, [goalAreaOfFocusFilter, goals]);

  return (
    <Modal
      open={modalState.open}
      onClose={() => modalState.onClose()}
      sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}
    >
      <Container maxWidth="lg" sx={{ height: "90%" }}>
        <Paper
          sx={{
            width: "100%",
            height: "100%",
            padding: "2rem",
            display: "flex",
            flexDirection: "column",
            position: "relative",
          }}
          elevation={5}
        >
          <Box sx={{ position: "absolute", right: "1rem", top: "1rem" }}>
            <XNGClose onClick={() => modalState.onClose()} />
          </Box>
          <Box paddingY={"1rem"} mb={"2rem"}>
            <Typography variant="h6" mb={"1rem"}>
              Edit Goal List
            </Typography>
            <Typography variant="body1" mb={"2rem"} textAlign={{ textAlign: "center", sm: "left" }}>
              You can edit which goals are visible within your session. Please select the goals you
              would like to appear in this session series.
            </Typography>
            <XNGDropDown
              defaultValue="All"
              label="Area Of Focus"
              id="egm-goal-status"
              value={goalAreaOfFocusFilter}
              items={["All", ...goalAreaOfFocusNames]}
              onChange={(val) => setGoalAreaOfFocusFilter(val.target.value)}
            />
          </Box>
          <Grid container gap={2} sx={{ overflowY: "auto" }}>
            {filteredGoals.map((goal, i) => {
              return <GoalCard key={i} goal={goal} goalSelectState={goalSelectState} />;
            })}
          </Grid>
          <Box
            paddingY={"1rem"}
            mt={"1rem"}
            display={"flex"}
            justifyContent={{ justifyContent: "center", sm: "right" }}
            sx={{
              paddingRight: "1rem",
            }}
          >
            <Button
              variant="contained"
              sx={{
                width: { width: "100%", sm: "fit-content" },
                maxWidth: "295px",
              }}
              onClick={() => onSave()}
            >
              Save
            </Button>
          </Box>
        </Paper>
      </Container>
    </Modal>
  );
}
