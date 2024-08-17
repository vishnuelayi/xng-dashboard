import {
  Box,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormLabel,
  Stack,
} from "@mui/material";
import { Dayjs } from "dayjs";
import { MSBSearchMultiselect } from "../../../../fortitude";
import { DatePicker } from "@mui/x-date-pickers";
import { DistrictRef } from "../../../../profile-sdk";
import { MSBSearchMultiselectProps } from "../../../../fortitude/components/search_multiselect/search_multiselect";

type TableInputControlsProps = Readonly<{
  checkboxState: {
    value: boolean;
    onCheckboxClick: () => void;
  };
  shouldCollapse: boolean;
  dateRangeState: {
    startDate: Dayjs;
    endDate: Dayjs;
    onStartDateChange: (v: Dayjs) => void;
    onEndDateChange: (v: Dayjs) => void;
  };
  campusDropdownProps: MSBSearchMultiselectProps<DistrictRef>;
  onRunClick: () => void;
}>;

function TableInputControls(props: TableInputControlsProps) {
  const { shouldCollapse } = props;

  return shouldCollapse ? (
    <Stack
      sx={{ height: "10rem", gap: ".5rem", my: ".5rem" }} // Total height is 11rem. This is used to configure DataGrid height on the breakpoint.
    >
      <CampusesControl {...props} />
      <CheckboxControl {...props} />
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          width: "100%",
          alignItems: "flex-end",
          columnGap: "1rem",
        }}
      >
        <StartDateControl {...props} />
        <EndDateControl {...props} />
        <RunButtonControl {...props} />
      </Box>
    </Stack>
  ) : (
    <Stack
      sx={{ height: "6rem", gap: ".5rem", my: ".5rem" }} // Total height is 7rem. This is used to configure DataGrid height on the breakpoint.
    >
      <Box
        sx={{
          // Should render all elements along one one line
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          width: "100%",
          alignItems: "flex-end",
          gap: "1rem",
        }}
      >
        <CampusesControl {...props} />
        <StartDateControl {...props} />
        <EndDateControl {...props} />
        <RunButtonControl {...props} />
      </Box>
      <CheckboxControl {...props} />
    </Stack>
  );
}

function CheckboxControl(props: TableInputControlsProps) {
  return (
    <FormControl>
      <FormControlLabel
        sx={{ maxHeight: "2rem", width: "min-content", whiteSpace: "nowrap" }}
        control={
          <Checkbox
            size="small"
            checked={props.checkboxState.value}
            onClick={props.checkboxState.onCheckboxClick}
          />
        }
        className="noselect" // Prevents text from highlighting when repeatedly clicking checkbox
        label="Include providers without assigned campuses?"
      />
    </FormControl>
  );
}

function CampusesControl(props: TableInputControlsProps) {
  return (
    <FormControl fullWidth>
      <FormLabel>Campus(es)</FormLabel>
      <MSBSearchMultiselect {...props.campusDropdownProps} />
    </FormControl>
  );
}

function StartDateControl(props: TableInputControlsProps) {
  return (
    <FormControl fullWidth>
      <FormLabel>Start Date</FormLabel>
      <DatePicker
        value={props.dateRangeState.startDate}
        onChange={(v) => v && props.dateRangeState.onStartDateChange(v)}
        slotProps={{ textField: { size: "small" } }}
      />
    </FormControl>
  );
}

function EndDateControl(props: TableInputControlsProps) {
  return (
    <FormControl fullWidth>
      <FormLabel>End Date</FormLabel>
      <DatePicker
        value={props.dateRangeState.endDate}
        onChange={(v) => v && props.dateRangeState.onEndDateChange(v)}
        slotProps={{ textField: { size: "small" } }}
      />
    </FormControl>
  );
}

function RunButtonControl(props: TableInputControlsProps) {
  return (
    <FormControl fullWidth>
      <Button
        fullWidth
        onClick={() => props.onRunClick()}
        sx={{
          minHeight: "2.3rem",
        }}
      >
        Run
      </Button>
    </FormControl>
  );
}

export default TableInputControls;
