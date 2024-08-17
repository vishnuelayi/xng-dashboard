import { Stack } from "@mui/material";
import React from "react";
import XNGButton from "../../../../../../../design/low-level/button";
import useUserManagementContext from "../../../../../hooks/context/use_user_management_context";

const StaffDirectoryActionButtons = () => {
  const userManagementDispatch = useUserManagementContext().dispatch;
  return (
    <Stack
      gap={2}
      sx={{
        flexDirection: {
          flexDirection: "column",
          sm: "row",
        },
        justifyContent: {
          justifyContent: "stretch",
          sm: "center",
        },
      }}
    >
      <XNGButton
        color="primary_3"
        onClick={() => {
          userManagementDispatch({
            type: "set_open_modal_staff_directory_create_provider",
            payload: {
              isOpen: true,
            },
          });
        }}
      >
        Create
      </XNGButton>
      <XNGButton color="white" disabled>
        Upload
      </XNGButton>
      <XNGButton
        color="white"
        disabled
        onClick={() => {
          userManagementDispatch({
            type: "set_open_modal_staff_directory_export_staff_directory",
            payload: {
              isOpen: true,
            },
          });
        }}
      >
        Export
      </XNGButton>
    </Stack>
  );
};

export default StaffDirectoryActionButtons;
