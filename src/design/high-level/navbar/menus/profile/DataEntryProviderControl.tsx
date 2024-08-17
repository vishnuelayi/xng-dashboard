import { Typography } from "@mui/material";
import Box from "../../../../components-dev/BoxExtended";
import XNGAvatar from "../../../../low-level/avatar";
import usePalette from "../../../../../hooks/usePalette";
import XNGButton from "../../../../low-level/button";

import { useSessionPostPermission } from "../../../../../hooks/notator/useSessionPostPermission";
import { useLocation, useNavigate } from "react-router-dom";
import { useMemo } from "react";
import { ROUTES_XLOGS } from "../../../../../constants/URLs";

interface IDataEntryProviderControl {
  firstName: string;
  lastName: string;
  email: string;
  onSignIn: () => void;
  onSignOut: () => void;
  signedIn: boolean;
  onRemove: () => void;
  onRequestAccess: () => void;
}
export function DataEntryProviderControl(props: IDataEntryProviderControl) {
  const palette = usePalette();
  const userInitials = props.firstName.charAt(0) + props.lastName.charAt(0);
  const decpostPermission = useSessionPostPermission();
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const inNotator = useMemo(() => {
    const pathArray = pathname.split("/");

    if (pathArray.includes("notator")) return true;

    return false;
  }, [pathname]);

  const redirectToCalendar = () => {
    setTimeout(() => {
      navigate(ROUTES_XLOGS.calendar);
    }, 200);
  };

  return (
    <>
      <Box
        className="noselect"
        sx={{
          ":hover": { bgcolor: palette.contrasts[4] },
          borderRadius: "4px",
          padding: "3px",
          paddingY: "1rem",
          paddingBottom: "5rem",
          height: "5rem",
          cursor: "pointer",
          overflow: "hidden",
          transition: "height .2s ease",
          width: "100%",
        }}
      >
        <Box sx={{ display: "flex", gap: "10px", paddingLeft: "16px" }}>
          <XNGAvatar text={userInitials} size="sm" />

          <Box
            sx={{
              paddingRight: "1rem",
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
            }}
          >
            <Typography variant="body1">
              {props.firstName} {props.lastName}
            </Typography>
            <Typography variant="subtitle2">{props.email}</Typography>

            <Box sx={{ display: "flex", gap: "15px", marginTop: "12px" }}>
              <XNGButton
                onClick={() => {
                  props.onRemove();
                  if (inNotator) {
                    redirectToCalendar();
                  }
                }}
                variant="outline"
              >
                Remove
              </XNGButton>
              {props.signedIn ? (
                decpostPermission.canPost ? (
                  <XNGButton
                    onClick={() => {
                      props.onSignOut();
                      if (inNotator) {
                        redirectToCalendar();
                      }
                    }}
                  >
                    Sign Out
                  </XNGButton>
                ) : (
                  <XNGButton
                    onClick={() => {
                      props.onRequestAccess();
                      if (inNotator) {
                        redirectToCalendar();
                      }
                    }}
                  >
                    Re-request
                  </XNGButton>
                )
              ) : (
                <XNGButton
                  onClick={() => {
                    props.onSignIn();
                    if (inNotator) {
                      redirectToCalendar();
                    }
                  }}
                >
                  Sign In
                </XNGButton>
              )}
            </Box>
          </Box>
        </Box>
      </Box>
    </>
  );
}
