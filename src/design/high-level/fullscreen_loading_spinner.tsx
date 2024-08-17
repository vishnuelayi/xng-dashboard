import usePalette from "../../hooks/usePalette";
import Box from "../components-dev/BoxExtended";
import XNGSpinner from "../low-level/spinner";
import { getSizing } from "../sizing";
import { Typography } from "@mui/material";

function FullScreenLoadingMessage(props: { message: string }) {
  const palette = usePalette();

  return (
    <Box
      sx={{
        marginTop: getSizing(20),
        width: "100%",
        display: "flex",
        alignItems: "center",
        flexDirection: "column",
      }}
      className="noselect"
    >
      <XNGSpinner fullPage />
      <Typography
        sx={{ marginTop: getSizing(6), fontWeight: 500 }}
        color={palette.primary[2]}
        variant="h6"
      >
        Welcome to your X Logs!
      </Typography>
      {/* TODO: Make text thinner... */}
      <Typography
        sx={{ marginTop: getSizing(2), fontWeight: 400 }}
        color={palette.menu[2]}
        variant="h6"
      >
        {props.message}
      </Typography>
    </Box>
  );
}

export default FullScreenLoadingMessage;
