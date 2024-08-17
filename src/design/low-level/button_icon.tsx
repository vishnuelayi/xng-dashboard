import { IconButton } from "@mui/material";
import { XNGICONS, XNGIconRenderer, XNGIconSize } from "../icons";
import Box from "../components-dev/BoxExtended";
import { XNGButtonSize, getButtonHeight } from "./button_types";

interface IXNGIconButton {
  size?: XNGButtonSize;
  icon: JSX.Element;
}
function XNGIconButton(props: IXNGIconButton) {
  const BTN_SIZE: XNGButtonSize = props.size ? props.size : "default";
  const ICON_SIZE: XNGIconSize =
    BTN_SIZE === "large"
      ? "md"
      : BTN_SIZE === "default"
      ? "sm"
      : BTN_SIZE === "small"
      ? "xs"
      : "xs";

  return (
    <Box
      sx={{
        position: "relative",
        display: "flex",
        width: getButtonHeight(BTN_SIZE),
        height: getButtonHeight(BTN_SIZE),
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <IconButton sx={{ position: "absolute" }}>
        <XNGIconRenderer i={props.icon} size={ICON_SIZE} />
      </IconButton>
    </Box>
  );
}

export default XNGIconButton;
