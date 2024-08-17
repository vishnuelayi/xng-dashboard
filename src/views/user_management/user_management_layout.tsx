import UserManagementView from "./views/user_management_view";

import SidebarLayout from "../../layouts/SidebarLayout";
import { Box } from "@mui/material";
import useUserManagementContext from "./hooks/context/use_user_management_context";
import { DualActionModal, XNGICONS, XNGIconRenderer } from "../../design";
import usePalette from "../../hooks/usePalette";
import useSidebarLayoutBtns from "../admin/constants/sidebar_layout_btns";
const UserManagementLayout = () => {
  const confirmation_modal_state = useUserManagementContext().confirmation_modal.state;
  const palette = usePalette();
  const sidebarButtons = useSidebarLayoutBtns();
  const getConfirmationModalIcon = () => {
    switch (confirmation_modal_state.icon) {
      case "warning":
        return <XNGIconRenderer color={palette.warning[4]} size="2rem" i={<XNGICONS.Alert />} />;
      case "danger":
        return <XNGIconRenderer color={palette.danger[4]} size="2rem" i={<XNGICONS.Alert />} />;
      default:
        return undefined;
    }
  };

  return (
    <SidebarLayout
      sidebarContent={sidebarButtons}
      content={
        <Box p={2}>
          <UserManagementView />
          <DualActionModal
            open={confirmation_modal_state.isOpen}
            injectContent={{
              icon: getConfirmationModalIcon(),
              header: confirmation_modal_state.title,
              body: confirmation_modal_state.body,
              noText: confirmation_modal_state.cancelText,
              yesText: confirmation_modal_state.confirmText,
              buttonStyles: confirmation_modal_state.styleBtns,
            }}
            onClose={confirmation_modal_state.onCancel}
            onConfirm={confirmation_modal_state.onConfirm}
            onReject={confirmation_modal_state.onCancel}
          />
        </Box>
      }
    />
  );
};

export default UserManagementLayout;
