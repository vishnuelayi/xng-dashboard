import { Menu, MenuItem, SxProps } from "@mui/material";
import { HiPencil } from "react-icons/hi";
import { MdOutlineRemoveCircleOutline } from "react-icons/md";
import { MSBIconRenderer } from "../fortitude";
import { useMemo } from "react";
import useUserRoles from "../hooks/use_user_roles";
import { selectUserIsCurrentlyProxying } from "../context/slices/dataEntryProvider";
import { useXNGSelector } from "../context/store";

export type SessionEllipsisMenuProps = Readonly<{
  onClose: () => void;
  open: boolean;
  onEditSessionSeriesClick: () => void;
  onDeleteSessionClick: () => void;
  anchorEl: HTMLElement | null;
  contentDependencies: {
    sessionIsRecurring: boolean;
    isUsersOwnSession: boolean;
  };
}>;

const menuItemStyle: SxProps = { gap: ".5rem", px: ".75rem" };

/**
 * Produces the `SessionEllipsisMenu` seen on both the Calendar and Notator screens.
 */
export function SessionEllipsisMenu(props: SessionEllipsisMenuProps) {
  const {
    onEditSessionSeriesClick,
    onDeleteSessionClick,
    anchorEl: ellipseAnchorEl,
    open,
    onClose,
    contentDependencies: { sessionIsRecurring, isUsersOwnSession },
  } = props;

  const userIsProxying = useXNGSelector(selectUserIsCurrentlyProxying);
  const userRoles = useUserRoles();

  // REQUIREMENTS:
  // * Should not show 'Edit Session Series' button for editing session series
  // * Delete session(s) should render as 'Delete session' for non-series
  // * Approvers should not see 'Delete' option for sessions that are not their own

  const shouldShowDeleteButton = useMemo(() => {
    if (isUsersOwnSession) return true;

    if (userIsProxying) return true; // Will only ever be seeing proxied user's sessions

    if (userRoles.includes("Executive Admin") || userRoles.includes("Delegated Admin")) return true;

    // Removing as a hot fix
    // if (userRoles.includes("Approver") && !isUsersOwnSession) {
    //   return false;
    // }

    return true;
  }, [userRoles, isUsersOwnSession, userIsProxying]);

  return (
    <Menu anchorEl={ellipseAnchorEl} open={open} onClose={onClose}>
      <MenuItem sx={menuItemStyle} onClick={onEditSessionSeriesClick}>
        <MSBIconRenderer i={<HiPencil />} size="sm" />
        {sessionIsRecurring ? "Edit session series" : "Edit session"}
      </MenuItem>

      {shouldShowDeleteButton && (
        <MenuItem
          sx={{ ...menuItemStyle, ":hover": { bgcolor: "#FEE" } }}
          onClick={onDeleteSessionClick}
        >
          <MSBIconRenderer i={<MdOutlineRemoveCircleOutline />} size="sm" />
          {sessionIsRecurring ? "Delete session(s)" : "Delete session"}
        </MenuItem>
      )}
    </Menu>
  );
}
