import { TextField, Typography } from "@mui/material";
import XNGCheckbox from "../../../../design/low-level/checkbox";
import Box from "../../../../design/components-dev/BoxExtended";
import NOTATOR_GOAL_VIEW_STYLE_CONSTANTS from "./constants/notator_goal_view_style_constants";
import XNGTickNumberInput from "./components/tick_input";
import { useNotatorTools } from "../../tools";
import { useMemo } from "react";
import { GoalAndObjectiveObservation, GoalAndObjectiveToolUsed } from "../../../../session-sdk";
import { enumAsArrayOfValues } from "../../../../utils/enum_as_array_of_values";
import { MSBTypedSelectControlled } from "../../../../fortitude/components/typed_select";
import {
  labelFromGoalAndObjectiveObservation,
  labelFromGoalAndObjectiveToolUsed,
} from "./constants/mappers";

export type NewMastery = {
  newAttempts?: number;
  newSuccesses?: number;
  newPercentageComplete?: number;
};

interface DashboardCallbacks {
  onNotesChange: (v: string) => void;
  onCheckboxClick: () => void;
  onSetMastery: (v: NewMastery) => void;
  onObservationChange: (v: GoalAndObjectiveObservation) => void;
  onToolUsedChange: (v: GoalAndObjectiveToolUsed) => void;
}

interface DashboardVisualState {
  isChecked: boolean;
  showInputs: boolean;
  description: {
    boldPrefix?: string;
    content: string;
  };
  attempts: number;
  successes: number;
  percentageComplete: number;
  observation: GoalAndObjectiveObservation | undefined;
  toolUsed: GoalAndObjectiveToolUsed;
  notes: string;
}

/**
 * Parameter `state` is defined from either a `goal` or `objective` context.
 */
export type GoalOrObjectiveDashboardProps =
  | { type: "goal"; state: DashboardVisualState; callbacks: DashboardCallbacks }
  | { type: "objective"; state: DashboardVisualState; callbacks: DashboardCallbacks };

/**
  Presentational component that conditionally renders goal or objective components and calls callbacks accordingly
  for data operations to be handled by its parent via Immer.

  TODO: Clean up the structural UI. I've found some duplicate boxes.
 */
export default function GoalOrObjectiveDashboard(props: Readonly<GoalOrObjectiveDashboardProps>) {
  return (
    <Box py="1rem">
      <Header {...props} />

      {props.state.showInputs && (
        <Box pt="2rem" sx={{ pl: NOTATOR_GOAL_VIEW_STYLE_CONSTANTS.viewIndentionsRem }}>
          <Controls {...props} />
        </Box>
      )}
    </Box>
  );
}

function Header(props: Readonly<GoalOrObjectiveDashboardProps>) {
  const { readOnly } = useNotatorTools();

  return (
    <Box
      sx={{
        display: "flex",
        borderRadius: "4px",
        ":hover": readOnly
          ? { cursor: "default" }
          : {
              bgcolor: "#0001",
              transition: "background-color .2s ease",
              cursor: "pointer",
            },
      }}
      onClick={() => !readOnly && props.callbacks.onCheckboxClick()}
    >
      <Box
        sx={{
          minWidth: NOTATOR_GOAL_VIEW_STYLE_CONSTANTS.viewIndentionsRem,
          display: "flex",
          justifyContent: "center",
        }}
      >
        <XNGCheckbox checked={props.state.isChecked} onToggle={() => {}} disabled={readOnly} />
      </Box>
      <Box p=".5rem">
        <Typography display="inline" sx={{ color: readOnly ? "grey" : "inherit" }}>
          <b>{props.state.description.boldPrefix ?? ""}</b>{" "}
        </Typography>
        <Typography sx={{ color: readOnly ? "grey" : "inherit" }} display="inline">
          {props.state.description.content}
        </Typography>
      </Box>
    </Box>
  );
}

function Controls(props: Readonly<GoalOrObjectiveDashboardProps>) {
  const { readOnly } = useNotatorTools();

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: "1rem", width: "100%" }}>
      <Box sx={{ display: "flex", gap: "1rem", alignItems: "center", width: "100%" }}>
        <Typography
          className="noselect"
          sx={{
            textTransform: "capitalize",
            color: readOnly ? "grey" : "inherit",
            whiteSpace: "nowrap",
          }}
        >
          <b>{props.type} Observation:</b>
        </Typography>

        <ObservationSelect {...props} />
      </Box>
      <Box mb="1rem" sx={{ display: "flex", gap: "1rem", width: "100%" }}>
        <MasteryDashboard {...props} />

        <Box
          sx={{
            height: "3rem",
            display: "flex",
            flexDirection: "column",
            width: "100%",
            ml: "2rem",
            mt: "1.4rem",
          }}
        >
          <Typography
            className="noselect"
            sx={{ color: readOnly ? "grey" : "inherit" }}
            gutterBottom
          >
            <b>Condition</b>
          </Typography>
          <ConditionMultiSelect {...props} />
        </Box>
      </Box>
      <Typography
        sx={{
          textTransform: "capitalize",
          color: readOnly ? "grey" : "inherit",
          fontWeight: "bold",
        }}
        className="noselect"
        gutterBottom
      >
        {props.type} Notes:
      </Typography>
      <TextField
        defaultValue={props.state.notes}
        onBlur={(e) => props.callbacks.onNotesChange(e.target.value)}
        multiline
        rows={6}
        size="small"
      />
    </Box>
  );
}

function InputLayout(
  props: Readonly<{ title: string; onChange: (v: number) => void; value: number }>,
) {
  const { readOnly } = useNotatorTools();

  return (
    <Box>
      <Box sx={{ height: "3rem", display: "flex", alignItems: "center" }}>
        <Typography className="noselect" sx={{ color: readOnly ? "grey" : "inherit" }} gutterBottom>
          <b>{props.title}</b>
        </Typography>
      </Box>
      <XNGTickNumberInput disabled={readOnly} value={props.value} onChange={props.onChange} />
    </Box>
  );
}

function ObservationSelect(props: Readonly<GoalOrObjectiveDashboardProps>) {
  const { readOnly } = useNotatorTools();

  const options = useMemo(() => enumAsArrayOfValues(GoalAndObjectiveObservation), []);

  return (
    <MSBTypedSelectControlled<GoalAndObjectiveObservation>
      options={options}
      value={props.state.observation ?? ""}
      onChange={props.callbacks.onObservationChange}
      getOptionLabel={(v) => labelFromGoalAndObjectiveObservation[v]}
      selectProps={{ disabled: readOnly, fullWidth: true }}
    />
  );
}

function ConditionMultiSelect(props: Readonly<GoalOrObjectiveDashboardProps>) {
  const { readOnly } = useNotatorTools();

  const options = useMemo(() => enumAsArrayOfValues(GoalAndObjectiveToolUsed), []);

  return (
    <Box sx={{ display: "flex", width: "100%" }}>
      <MSBTypedSelectControlled<GoalAndObjectiveToolUsed>
        options={options}
        value={props.state.toolUsed}
        onChange={(v) => props.callbacks.onToolUsedChange(v)}
        getOptionLabel={(v) => labelFromGoalAndObjectiveToolUsed[v]}
        selectProps={{ disabled: readOnly, fullWidth: true }}
      />
    </Box>
  );
}

/**
 * This is a presentational component that *may* appear like a smart component due to the calculations it runs
 * per onChange, but these are simple pre-calculations. It is still not, nor should it be in control of its own state.
 */
function MasteryDashboard(props: GoalOrObjectiveDashboardProps) {
  return (
    <>
      <Box sx={{ display: "flex", alignItems: "center", gap: "1rem" }}>
        <InputLayout
          value={props.state.attempts}
          onChange={(v) => {
            const newAttempts = Math.max(0, v);

            const newSuccesses = Math.min(props.state.successes, newAttempts);
            const newPercentageComplete =
              newAttempts === 0 ? 0 : (newSuccesses / newAttempts) * 100;

            props.callbacks.onSetMastery({
              newAttempts,
              newSuccesses,
              newPercentageComplete,
            });
          }}
          title="Attempts"
        />

        <Typography>vs</Typography>

        <InputLayout
          value={props.state.successes}
          onChange={(v) => {
            const newSuccesses = Math.max(0, v);

            const newAttempts = Math.max(props.state.attempts, newSuccesses);

            let newPercentageComplete;
            if (newAttempts === 0 || newSuccesses === 0) {
              newPercentageComplete = 0;
            } else {
              newPercentageComplete = (newSuccesses / newAttempts) * 100;
            }

            props.callbacks.onSetMastery({
              newAttempts,
              newSuccesses,
              newPercentageComplete,
            });
          }}
          title="Successes"
        />
      </Box>

      <Box ml="2rem">
        <InputLayout
          title="Mastery Percentage"
          value={props.state.percentageComplete}
          onChange={(v) => {
            const newPercentageComplete = Math.max(0, v);

            const newAttempts = 0;
            const newSuccesses = 0;

            props.callbacks.onSetMastery({
              newAttempts,
              newSuccesses,
              newPercentageComplete,
            });
          }}
        />
      </Box>
    </>
  );
}
