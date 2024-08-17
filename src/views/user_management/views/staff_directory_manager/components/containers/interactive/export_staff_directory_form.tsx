import React from "react";
import useUserManagementContext from "../../../../../hooks/context/use_user_management_context";
import StaffDirectoryDialog from "../../presentational/wrappers/staff_directory_dialog";
import {
  Box,
  DialogActions,
  DialogContent,
  DialogContentText,
  Stack,
  Typography,
} from "@mui/material";
import XNGButton from "../../../../../../../design/low-level/button";
import XNGRadioGroup from "../../../../../../../design/low-level/radio_group";
import XNGToggle from "../../../../../../../design/low-level/button_toggle";

const ExportStaffDirectoryForm = () => {
  const isOpen =
    useUserManagementContext().store.staffDirectoryData.modals.exportStaffDirectory.isOpen;
  const userManagementDispatch = useUserManagementContext().dispatch;

  return (
    <StaffDirectoryDialog
      maxWidth="560px"
      isOpen={isOpen}
      onClose={() => {
        userManagementDispatch({
          type: "set_open_modal_staff_directory_export_staff_directory",
          payload: {
            isOpen: false,
          },
        });
      }}
    >
      <Typography component={"h3"} fontSize={"24px"} mb={1}>
        Export Staff Directory
      </Typography>
      <DialogContentText fontSize={"16px"}>
        Please select how you would like to export the staff directory information:
      </DialogContentText>
      <DialogContent sx={{ p: 0 }}>
        <Stack
          sx={{
            flexDirection: {
              flexDirection: "column",
              sm: "row",
            },
            justifyContent: "space-between",

            // direction={ 'row'} justifyContent={"space-between"}
          }}
        >
          <Box>
            <XNGRadioGroup
              value={"csv"}
              onChange={() => {}}
              options={["CSV", "Excel", "PDF"]}
              values={["csv", "excel", "pdf"]}
              formLabel={undefined}
              sx={{}}
              radioSx={{}}
            />
          </Box>
          <Box pt={1}>
            <XNGToggle
              label="Include Inactive Staff"
              onToggle={() => {
                // console.log("active toggle", e);
                //   staffDirectoryDispatch({
                //     type: "set_home_page_show_inactive_staff_filter",
                //     payload: { showInactive: !showInactiveStaff },
                //   });
              }}
              value={false}
            />
          </Box>
        </Stack>
      </DialogContent>
      <DialogActions>
        <XNGButton>Export</XNGButton>
      </DialogActions>
    </StaffDirectoryDialog>
  );
};

export default ExportStaffDirectoryForm;
