import { Box, Stack, Typography } from "@mui/material";
import usePalette from "../../../hooks/usePalette";
import { useXNGSelector } from "../../../context/store";
import { selectLoggedInClientAssignment } from "../../../context/slices/userProfileSlice";
import { DistrictRef } from "../../../profile-sdk";
import { XNGTypedSelect } from "../../../design/low-level/typed_select";

type StateProps = {
  onChange: (v: DistrictRef) => void;
};

type AdminHeaderDistrictSelectorProps = StateProps; // available to extend with further interfaces

function AdminHeaderDistrictSelector(props: AdminHeaderDistrictSelectorProps) {
  const palette = usePalette();
  const loggedInClient = useXNGSelector(selectLoggedInClientAssignment);
  const authorizedDistricts = loggedInClient.authorizedDistricts;

  return (
    <Stack
      bgcolor={palette.primary[1]}
      boxShadow={2}
      sx={{
        borderRadius: ".25rem",
        flexDirection: {
          xs: "column",
          sm: "row",
        },
        justifyContent: {
          xs: "center",
          sm: "space-between",
        },
      }}
    >
      <Stack
        p={2}
        gap={2}
        sx={{
          alignItems: {
            alignItems: "center",
            sm: "flex-start",
          },
        }}
      >
        <Typography
          variant="h5"
          component="h3"
          color={palette.contrasts[3]}
          sx={{
            textAlign: {
              textAlign: "center",
              sm: "left",
            },
          }}
        >
          {loggedInClient.client?.name}
        </Typography>

        <Stack direction="row" alignItems="center" gap={2}>
          {authorizedDistricts && (
            <XNGTypedSelect<DistrictRef>
              options={authorizedDistricts}
              defaultOption={authorizedDistricts[0]}
              onChange={props.onChange}
              getDisplayValue={(ad) => ad.name!}
            />
          )}
          <Stack direction="row" gap={1} alignItems="center">
            <Box
              bgcolor={palette.success[2]}
              sx={{ width: "1rem", aspectRatio: "1 / 1", borderRadius: "99rem" }}
            />
            <Typography variant="body1" component="p" color={palette.contrasts[3]}>
              Active
            </Typography>
          </Stack>
        </Stack>
      </Stack>
    </Stack>
  );
}

export default AdminHeaderDistrictSelector;
