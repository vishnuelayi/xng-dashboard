import { Box, Checkbox, Divider, FormControlLabel, Link, Stack, Typography } from "@mui/material";
import { useXNGSelector } from "../../context/store";
import { selectUser } from "../../context/slices/userProfileSlice";
import { useCalendarContext } from "./context/context";
import { MSBSearchMultiselect } from "../../fortitude";
import MSBClose from "../../fortitude/components/button_close";
import { ServiceAreaRef, ServiceProviderRef } from "../../profile-sdk";
import { StudentRef } from "../../session-sdk";
import {
  selectDataEntryProvider,
  selectUserIsSignedInAsDEP,
} from "../../context/slices/dataEntryProvider";

export function CalendarFilterView(props: { onClose: () => void }) {
  const calendarContext = useCalendarContext();
  const filterState = calendarContext.calendarFilterState;

  const userIsSignedInAsDEP = useXNGSelector(selectUserIsSignedInAsDEP);

  return (
    <Box
      sx={{
        minWidth: "25rem",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Box sx={{ display: "flex", justifyContent: "flex-end", padding: ".5rem", pb: 0 }}>
        <MSBClose onClick={props.onClose} />
      </Box>

      <Stack gap=".75rem" px="1rem" pb="1rem">
        <Typography variant="h6">Filter(s)</Typography>

        <Divider />

        <ControlsHeader />

        <Stack gap="1rem">
          {!userIsSignedInAsDEP && (
            <MSBSearchMultiselect<ServiceProviderRef>
              variant="no overflow after 1"
              label="Service Provider"
              getOptionLabel={(v) => `${v.firstName} ${v.lastName}`}
              options={filterState.fullSelectableAssistantList}
              selectedOptions={filterState.selectedAssistantRefs}
              onChange={filterState.setSelectedAssistants}
            />
          )}

          <MSBSearchMultiselect<ServiceAreaRef>
            variant="no overflow after 1"
            label="Service Area"
            options={filterState.fullSelectableServiceAreaList}
            selectedOptions={filterState.selectedServiceAreas}
            getOptionLabel={(v) => v.name!}
            onChange={filterState.setSelectedServiceAreas}
            // Our full selectable list is intended to update on each selection change, thereby making it an unstable
            // dependency for an MUI Autoselect. We need to enforce stability through the usage of a strict equality check.
            isOptionEqualToValue={(option, value) => option.id === value.id}
          />

          <MSBSearchMultiselect<StudentRef>
            variant="no overflow after 1"
            label="Student"
            options={filterState.fullSelectableStudentList}
            selectedOptions={filterState.selectedStudents}
            getOptionLabel={(v) => `${v.firstName} ${v.lastName}`}
            onChange={filterState.setSelectedStudents}
            // Our full selectable list is intended to update on each selection change, thereby making it an unstable
            // dependency for an MUI Autoselect. We need to enforce stability through the usage of a strict equality check.
            isOptionEqualToValue={(option, value) => option.id === value.id}
          />
        </Stack>
      </Stack>
    </Box>
  );
}

function ControlsHeader() {
  const calendarContext = useCalendarContext();
  const filterState = calendarContext.calendarFilterState;
  const user = useXNGSelector(selectUser);
  const userIsSignedInAsDEP = Boolean(useXNGSelector(selectDataEntryProvider));

  function ResetAllFiltersHyperlink() {
    return (
      <Link
        className="noselect"
        onClick={() => {
          filterState.reset();
        }}
      >
        Reset All Filters
      </Link>
    );
  }

  return (
    <>
      {userIsSignedInAsDEP ? (
        <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
          <ResetAllFiltersHyperlink />
        </Box>
      ) : (
        <>
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography>Default Account</Typography>
            <ResetAllFiltersHyperlink />
          </Box>
          <FormControlLabel
            className="noselect"
            label={`${user?.firstName} ${user?.lastName}`}
            checked={filterState.defaultAccountChecked}
            onChange={() => {
              filterState.setDefaultAccountChecked(!filterState.defaultAccountChecked);
            }}
            control={<Checkbox />}
          />
          <Divider sx={{ mb: "1rem" }} />
        </>
      )}
    </>
  );
}
