import Box from "../components-dev/BoxExtended";
import usePalette from "../../hooks/usePalette";
import { XNGICONS, XNGIconRenderer } from "../icons";
import { getSizing } from "../sizing";
import { ButtonBase, Typography } from "@mui/material";

function XNGBack(props: { onClick: () => void; color?: string }) {
  const palette = usePalette();
  const COLOR = props.color || palette.primary[2];

  return (
    <ButtonBase>
      <Box
        onClick={() => props.onClick()}
        sx={{
          ":hover": { cursor: "pointer" },
          padding: getSizing(1),
          paddingX: getSizing(1),
          width: getSizing(8),
        }}
        className="noselect"
      >
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <XNGIconRenderer color={COLOR} left i={<XNGICONS.CaretOutline />} size="md" />
          <Typography color={COLOR}>Back</Typography>
        </Box>
      </Box>
    </ButtonBase>
  );
}

export default XNGBack;
