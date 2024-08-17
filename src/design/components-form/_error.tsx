import usePalette from "../../hooks/usePalette";
import Box from "../components-dev/BoxExtended";
import { getSizing } from "../sizing";
import { Typography } from "@mui/material";

export function XNGErrorFeedback(props: { error: string | undefined }) {
  const palette = usePalette();

  return (
    <Box
      className="noselect"
      sx={{
        paddingBlock: props.error ? "3px" : 0,
        transition: "height .2s ease, margin .2s ease",
        display: "flex",
        alignItems: "center",
        // overflow: "hidden",
        whiteSpace: "normal",
        marginTop: props.error ? getSizing(0.5) : 0,
      }}
    >
      <Typography variant="body2" color={palette.danger[2]}>
        {props.error}
      </Typography>
    </Box>
  );
}
