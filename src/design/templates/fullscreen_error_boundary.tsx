import { useNavigate } from "react-router";
import usePalette from "../../hooks/usePalette";
import Box from "../components-dev/BoxExtended";
import { XNGICONS, XNGIconRenderer } from "../icons";
import { getSizing } from "../sizing";
import { ReactComponent as ErrorGraphic } from "../svgs/error_graphic.svg";
import { Typography, Button } from "@mui/material";

function FullScreenError() {
  const svgSize = "12rem";
  const palette = usePalette();
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        paddingTop: getSizing(15),
        width: "100%",
        display: "flex",
        alignItems: "center",
        flexDirection: "column",
        px: "4rem",
        textAlign: "center",
      }}
    >
      <Box sx={{ svg: { minWidth: svgSize, minHeight: svgSize } }}>
        <ErrorGraphic />
      </Box>
      <Typography mt="4rem" variant="h4" sx={{ fontWeight: 400 }}>
        Oops, that's our bad
      </Typography>
      <Typography mt="1.5rem" variant="h6" color={palette.contrasts[1]} sx={{ fontWeight: 400 }}>
        We've encountered an unexpected issue, and our team is looking into it.
      </Typography>
      <Button
        sx={{ mt: "3rem", gap: ".5rem", alignItems: "center" }}
        variant="contained"
        onClick={() => navigate(0)}
      >
        <XNGIconRenderer size="xs" color={palette.contrasts[5]} i={<XNGICONS.Refresh />} />
        Try Again
      </Button>
    </Box>
  );
}

export default FullScreenError;
