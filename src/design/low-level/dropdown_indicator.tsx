import usePalette from "../../hooks/usePalette";
import Box from "../components-dev/BoxExtended";
import { XNGICONS, XNGIconRenderer, getSxRecolorChildXNGIcons } from "../icons";
import { SxProps } from "@mui/material";

type DropdownIndicatorSize = "sm" | "md";

function DropdownIndicator(props: { open: boolean; color?: string; size?: DropdownIndicatorSize }) {
  const palette = usePalette();
  const size = props.size ?? "md";

  return (
    <Box
      sx={{
        transition: "transform ease .2s",
        transform: props.open ? "scale(-1)" : "scale(1)",
        // transform: open ? "rotate(0deg)" : "rotate(-90deg)",
        ...getSxRecolorChildXNGIcons(palette.contrasts[1]),
      }}
    >
      <XNGIconRenderer color={palette.contrasts[1]} i={<XNGICONS.Caret />} size="caret" down />
    </Box>
  );
}

export default DropdownIndicator;
