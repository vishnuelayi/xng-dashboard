import { getSizing } from "../../../../sizing";
import { Typography } from "@mui/material";
import Box from "../../../../components-dev/BoxExtended";
import XNGAvatar from "../../../../low-level/avatar";
import usePalette from "../../../../../hooks/usePalette";
import XNGButton from "../../../../low-level/button";
import { Capitalize } from "../../../../low-level/capitalize";
import { useNavigate } from "react-router";

export function XNGUserCard_0(props: {
  user: { firstName: string; lastName: string; email: string };
  useActions?: {
    onRemove: () => void;
    onSignOut: () => void;
    onSignIn: () => void;
    signedIn: boolean;
  };
  useNavigationPath?: { path: string };
}) {
  const palette = usePalette();
  const path = props.useNavigationPath
    ? props.useNavigationPath.path
      ? props.useNavigationPath.path
      : "xlogs/my-profile"
    : "";
  const navigate = useNavigate();

  return (
    <>
      <Box
        className="noselect"
        sx={{
          ":hover": { bgcolor: palette.contrasts[4] },
          borderRadius: "4px",
          paddingY: "1rem",
          cursor: "pointer",
          overflow: "hidden",
          transition: "height .2s ease",
          width: "100%",
        }}
        onClick={() => {
          if (props.useNavigationPath) {
            navigate(path);
          }
        }}
      >
        <Box sx={{ display: "flex", gap: "10px", paddingLeft: "16px" }}>
          <XNGAvatar text={props.user.firstName[0] + props.user.lastName[0]} size="sm" />

          <Box
            sx={{
              paddingRight: "1rem",
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
            }}
          >
            <Typography
              variant="body1"
              sx={{
                textTransform: "lowercase",
                ":first-letter": { textTransform: "uppercase" },
              }}
            >
              <Capitalize>{props.user.firstName}</Capitalize>{" "}
              <Capitalize>{props.user.lastName}</Capitalize>
            </Typography>
            <Typography variant="subtitle2">{props.user.email}</Typography>

            {props.useActions && (
              <Box sx={{ display: "flex", gap: "15px", marginTop: "12px" }}>
                <XNGButton onClick={() => props.useActions!.onRemove()} variant="outline">
                  Remove
                </XNGButton>
                {props.useActions.signedIn ? (
                  <XNGButton onClick={() => props.useActions!.onSignOut!()}>Sign Out</XNGButton>
                ) : (
                  <XNGButton onClick={() => props.useActions!.onSignIn!()}>Sign In</XNGButton>
                )}
              </Box>
            )}
          </Box>
        </Box>
      </Box>
    </>
  );
}
