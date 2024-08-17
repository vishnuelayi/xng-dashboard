import { Box } from "@mui/material";
import React from "react";
import { Outlet, useLocation, useNavigate } from "react-router";
import UserManagementHeader from "../components/user_management_header";
import useUserManagementContext from "../hooks/context/use_user_management_context";
import { ROUTES_XLOGS } from "../../../constants/URLs";
import StaffDirectoryActionButtons from "./staff_directory_manager/components/containers/interactive/staff_directory_action_buttons";

const UserManagementView = () => {
  const clientName = useUserManagementContext().store.userManagementData.client?.name;
  const authorizedDistrictsData =
    useUserManagementContext().store.userManagementData.authorizedDistrictsFilterData;
  const userManagementDispatch = useUserManagementContext().dispatch;

  const navigate = useNavigate();
  const location = useLocation();
  const pathName = location.pathname.replace(/\/$/, ""); // Remove trailing slash

  React.useEffect(() => {
    // re-direct to index page if user is on the user management route
    if (pathName === ROUTES_XLOGS._admin.index) {
      navigate(ROUTES_XLOGS._admin.userApproval);
    }
  }, [location, navigate, pathName]);

  // represents the header content for the user management view based on the current route
  const HeaderContent = () => {
    switch (pathName) {
      case ROUTES_XLOGS._admin.staffDirectoryManager:
        return <StaffDirectoryActionButtons />;
      default:
        return null;
    }
  };

  return (
    <Box>
      <UserManagementHeader
        clientName={clientName}
        authorizedDistrictsData={{
          authorizedDistrictsOptions: authorizedDistrictsData.authorizedDistrictsOptions,
          selectedDistricts: authorizedDistrictsData.selectedDistricts,
          setSelectedDistricts: function (value): void {
            userManagementDispatch({
              type: "set_selected_districts_filter",
              payload: { selectedDistrict: value },
            });
          },
        }}
        content={<HeaderContent />}
      />
      <Outlet />
    </Box>
  );
};

export default UserManagementView;
