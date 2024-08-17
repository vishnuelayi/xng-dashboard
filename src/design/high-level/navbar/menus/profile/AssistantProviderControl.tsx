import { Typography } from "@mui/material";
import usePalette from "../../../../../hooks/usePalette";
import Box from "../../../../components-dev/BoxExtended";
import XNGAvatar from "../../../../low-level/avatar";
import XNGButton from "../../../../low-level/button";

interface IAssistantProviderControl {
  firstName: string;
  lastName: string;
  email: string;
  onRemove: () => void;
}
export function AssistantProviderControl(props: IAssistantProviderControl) {
  const palette = usePalette();
  const userInitials = props.firstName.charAt(0) + props.lastName.charAt(0);
  return (
    <>
      <Box
        sx={{
          ":hover": { bgcolor: palette.contrasts[4] },
          borderRadius: "4px",
          padding: "3px",
          paddingY: "1rem",
          height: "6rem",
          cursor: "pointer",
          overflow: "hidden",
          transition: "height .2s ease",
        }}
      >
        <Box sx={{ display: "flex", gap: "10px", paddingLeft: "16px" }}>
          <XNGAvatar text={userInitials} size="sm" />

          <Box sx={{ paddingRight: "1rem" }}>
            <Typography display="inline" variant="body1">
              {props.firstName} {props.lastName}
            </Typography>
            <Typography variant="subtitle2">{props.email}</Typography>

            <Box sx={{ display: "flex", gap: "25px", marginTop: "12px" }}>
              <XNGButton onClick={() => props.onRemove()}>Remove</XNGButton>
            </Box>
          </Box>
        </Box>
      </Box>
    </>
  );
}
