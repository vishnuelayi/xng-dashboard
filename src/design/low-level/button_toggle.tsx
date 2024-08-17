import { Switch } from "@mui/material";
import Box from "../components-dev/BoxExtended";
import usePalette from "../../hooks/usePalette";
import { Typography } from "@mui/material";
import { getSizing } from "../sizing";

interface IXNGToggle {
  value: boolean;
  onToggle: () => void;
  label?: string;
  variant?: "on-primary" | "on-white" | undefined;
}
function XNGToggle(props: IXNGToggle) {
  const palette = usePalette();

  const thumbColor_checked =
    props.variant === "on-primary" || props.variant === "on-white" ? "white" : "white";
  const trackColor_checked = props.variant === "on-primary" ? palette.primary[4] : "";
  const trackColor_unChecked = props.variant === "on-primary" ? palette.disabled : "";

  return (
    <Box
      sx={{ display: "flex", alignItems: "center", gap: getSizing(1), cursor: "pointer" }}
      onClick={() => (props.onToggle ? props.onToggle() : {})}
    >
      <Box
        sx={{
          // give pill shape
          "& .MuiSwitch-track": {
            borderRadius: 999,
            color: trackColor_unChecked || palette.contrasts[2],
            bgcolor: trackColor_unChecked || palette.contrasts[2],
            opacity: 1,
          },
          ".MuiSwitch-root": {
            padding: "7px",
            width: "56px",
            height: "36px",
          },
          "& .MuiSwitch-thumb": {
            width: "18px",
            height: "18px",
            bgcolor: thumbColor_checked,
          },
          // remove confusing margins using viewport method
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          maxHeight: "24px",
          maxWidth: "45px",
          // add color
          "& .Mui-checked": {
            color: thumbColor_checked || palette.primary[2],
          },
          "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
            bgcolor: trackColor_checked || palette.primary[2],
            opacity: 1,
          },
        }}
      >
        <Switch checked={props.value} />
      </Box>
      <Typography className="noselect">{props.label}</Typography>
    </Box>
  );
}

export default XNGToggle;
