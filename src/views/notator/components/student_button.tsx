import { ButtonBase, Typography } from "@mui/material";
import usePalette from "../../../hooks/usePalette";
import { StudentRef } from "../../../profile-sdk";
import { getSizing } from "../../../design/sizing";
import Box from "../../../design/components-dev/BoxExtended";
import { XNGICONS, XNGIconRenderer } from "../../../design/icons";
import XNGClose from "../../../design/low-level/button_close";

export default function NotatorStudentButton(props: { student: StudentRef; onDelete: () => void }) {
  const s = props.student;
  const palette = usePalette();

  return (
    <ButtonBase
      sx={{
        height: getSizing(4),
        display: "flex",
        alignItems: "center",
        paddingX: getSizing(1),
        justifyContent: "space-between",
        borderRadius: "4px",
      }}
    >
      <Box sx={{ display: "flex", gap: getSizing(1), alignItems: "center" }}>
        <XNGIconRenderer i={<XNGICONS.Person />} size="sm" />
        <Typography color={palette.contrasts[1]} variant="body1">
          {s.firstName + " " + s.lastName}
        </Typography>
      </Box>
      <XNGClose onClick={() => props.onDelete()} size="modal" />
    </ButtonBase>
  );
}
