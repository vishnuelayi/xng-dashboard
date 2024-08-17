import { Box, Typography } from "@mui/material";
import { MSBSearchMultiselect } from "../../../../../fortitude";
import msbMUIAutoCompleteFilterOptions from "../../../../../utils/msb_mui_auto_complete_filter_options";
import useSelectedProvidersHandler from "../../hooks/use_selected_providers_handler";
import useSelectedStudentsHandler from "../../hooks/use_selected_students_handler";
import { useUnpostedSessionsBatchPostContext } from "../../providers/unposted_sessions_batch_post_provider";
import XNGDateRangePicker from "../common/xng-date-range-picker";
import XNGLabelText from "../common/xng-label-text";
import useUserRoles from "../../../../../hooks/use_user_roles";

export default function ContentHeader() {
  const userRoles = useUserRoles();
  const {
    sessions,
    startDate,
    endDate,
    providers,
    students,
    onChangeDateRange,
    onChangeSelectedProviderIds,
    onChangeSelectedStudentIds,
  } = useUnpostedSessionsBatchPostContext();

  const { selectedProviders, setSelectedProviders } = useSelectedProvidersHandler({
    onChangeSelectedProviderIds,
    providers,
  });

  const { selectedStudents, setSelectedStudents } = useSelectedStudentsHandler({
    onChangeSelectedStudentIds,
    students,
  });

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "left",
        paddingTop: "20px",
        pl: 2,
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          width: "100%",
          visibility: students.length !== selectedStudents.length ? "visible" : "hidden",
        }}
      >
        <Typography sx={{ color: "red" }}>
          Sessions will be approved but not posted if all students for those sessions are not
          selected.
        </Typography>
      </Box>
      <Box sx={{ display: "flex", alignItems: "center", paddingY: "40px", gap: "20px" }}>
        <XNGDateRangePicker start={startDate} end={endDate} onChange={onChangeDateRange} />

        {!userRoles.includes("Approver") && (
          <XNGLabelText
            sx={{ marginLeft: "20px", maxWidth: "700px" }}
            label={`${
              sessions.length ? sessions.length : "No"
            } sessions within this date range meet the session posting requirements.`}
            text={`To Post the additional sessions in this period, please finalize your sessions and return to posting upon completion.`}
          />
        )}

        {userRoles.includes("Approver") && (
          <>
            <MSBSearchMultiselect
              selectedOptions={selectedProviders ?? []}
              options={providers}
              getOptionLabel={(option) => `${option?.firstName} ${option.lastName}` ?? ""}
              onChange={(sp) => setSelectedProviders(sp)}
              renderOptionVariant="checkbox"
              variant="no overflow after 1"
              isOptionEqualToValue={(option, value) => option.id === value.id}
              label="Provider"
              sx={{ backgroundColor: "white", minWidth: "250px" }}
              autocompleteProps={{
                disableCloseOnSelect: true,
                filterOptions: msbMUIAutoCompleteFilterOptions(),
                size: "medium",
              }}
            />

            {/* <XNGSelect<DistrictRef>
              label="Campus"
              multiple
              value={selectedCampusIds}
              options={campuses}
              getOptionText={(campus) => campus.name ?? ""}
              onChange={(e) => onChangeSelectedCampusIds(e.target.value as string[])}
            /> */}

            <MSBSearchMultiselect
              selectedOptions={selectedStudents ?? []}
              options={students}
              getOptionLabel={(option) => `${option?.firstName} ${option.lastName}` ?? ""}
              onChange={(selStudents) => setSelectedStudents(selStudents)}
              renderOptionVariant="checkbox"
              variant="no overflow after 1"
              isOptionEqualToValue={(option, value) => option.id === value.id}
              label="Student"
              sx={{ backgroundColor: "white", minWidth: "250px" }}
              autocompleteProps={{
                disableCloseOnSelect: true,
                filterOptions: msbMUIAutoCompleteFilterOptions(),
                size: "medium",
              }}
            />
          </>
        )}
      </Box>
    </Box>
  );
}
