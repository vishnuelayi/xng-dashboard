import Modal from "@mui/material/Modal";
import Grid from "@mui/material/Unstable_Grid2";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import { Button, IconButton, Typography } from "@mui/material";
import { GoalCard } from "../components/GoalCard";
import { ReactComponent as Close } from "../../../design/icons/close.svg";
import XNGDropDown from "../../../design/low-level/dropdown2";
import { GoalAreaOfFocus, GoalDisplay } from "../../../profile-sdk";
import { GoalRef } from "../../../session-sdk";
import { useEffect, useState } from "react";
import { useXNGSelector } from "../../../context/store";
import { selectStateInUS } from "../../../context/slices/stateInUsSlice";
import { API_STATESNAPSHOTS } from "../../../api/api";

/**
 * TODO: THIS CAN BE REMOVED ONCE MULTIPLE OBJECTIVES IS COMPLETE.
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
      <Container maxWidth="lg" sx={{ height: "90%", border: 0 }}>
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
          <IconButton
            sx={{ position: "absolute", right: "1rem", top: "1rem" }}
            onClick={() => modalState.onClose()}
          >
            <Close />
          </IconButton>
          <Box paddingY={"1rem"} mb={"2rem"}>
            <Typography
              component={"h2"}
              // variant="h6"
              mb={"1rem"}
              sx={{
                textAlign: { textAlign: "center", sm: "left" },
                fontSize: { xs: "1.3rem", sm: "1.2rem" },
              }}
            >
              Edit Goal List
            </Typography>
            <Typography
              component={"p"}
              variant="body1"
              mb={"2rem"}
              textAlign={{ textAlign: "center", sm: "left" }}
            >
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
          <Grid container spacing={2} flexGrow={1} sx={{ overflowY: "auto" }}>
            {filteredGoals.map((goal, i) => {
              return (
                <Grid key={i} xs={12} sm={6} md={"auto"} lg={3}>
                  <GoalCard goal={goal} goalSelectState={goalSelectState} />
                </Grid>
              );
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

export default EditGoalListModal;
