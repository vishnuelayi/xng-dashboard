import Box from "../components-dev/BoxExtended";
import { Typography } from "@mui/material";
import usePalette from "../../hooks/usePalette";
import { BadgeStatus } from "./badge_types";

export interface IXNGBadge {
  status: BadgeStatus;
  text?: string | number;
  absolute?: boolean;
  top?: boolean;
  right?: boolean;
  translateX?: number;
}

function XNGBadge(props: IXNGBadge) {
  const palette = usePalette();

  function getStatusColor(): string {
    switch (props.status) {
      case "Danger":
        return palette.danger[2];
      case "Refresh":
        return "";
      case "Default":
        return palette.primary[2];
        return "";
      case "Success":
        return "";
      case "Timer":
        return "";
      case "Warn":
        return "";
    }
  }

  return (
    <Box
      sx={{
        bgcolor: getStatusColor(),
        width: props.text ? "18px" : "10px",
        height: props.text ? "18px" : "10px",
        borderRadius: 999,
        position: props.absolute ? "absolute" : "static",
        top: props.top ? 0 : "initial",
        right: props.right ? 0 : "initial",
        transform: `translateX(${props.translateX}px)`,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        border: props.text ? "white 2px solid" : "none",
        zIndex: 999,
      }}
    >
      <Typography variant="body2" color={palette.contrasts[5]}>
        {props.text}
      </Typography>
    </Box>
  );
}

export default XNGBadge;
