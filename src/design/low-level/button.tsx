import { Button, SxProps, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import usePalette from "../../hooks/usePalette";
import { XNGButtonSize, getButtonHeight } from "./button_types";

type XNGButtonType = "outline" | "filled";

interface IXNGButton {
  onClick?: () => void;
  children?: React.ReactNode;
  variant?: XNGButtonType;
  to?: string;
  size?: XNGButtonSize;
  disabled?: boolean;
  fullWidth?: boolean;
  // `error_outline` is temporarily added for `Revisions` button and should be refactored in the future
  color?: "primary" | "primary_3" | "success" | "success_3" | "white" | "error" | "error_outline";
  sx?: SxProps;
}
function XNGButton(props: IXNGButton) {
  const VARIANT: XNGButtonType = props.variant ? props.variant : "filled";
  const HEIGHT = props.size ? getButtonHeight(props.size) : getButtonHeight("default");
  const palette = usePalette();
  const STYLE = props.sx ? props.sx : ({} as SxProps);

  const color =
    props.color === "primary"
      ? palette.contrasts[5]
      : props.color === "success" || props.color === "success_3" || props.color === "primary_3"
      ? "white"
      : props.color === "white"
      ? palette.primary[2]
      : props.color === "error" || props.color === "error_outline"
      ? palette.danger[4]
      : "";

  const bgColor =
    props.color === "primary"
      ? palette.primary[2]
      : props.color === "success"
      ? palette.success[4]
      : props.color === "white"
      ? "white"
      : props.color === "success_3"
      ? palette.success[3]
      : props.color === "error" 
      ? palette.danger[4]
      : props.color === "primary_3" 
      ? palette.primary[3]
      : "";

  const hoverColor =
    props.color === "primary"
      ? palette.primary[1]
      : props.color === "success" || props.color === "success_3"
      ? palette.success[1]
      : props.color === "white"
      ? palette.primary[4]
      : props.color === "error" 
      ? palette.danger[2]
      : props.color === "primary_3" 
      ? palette.primary[4]
      : "";

  const borderColor = props.color === "error" || props.color === "error_outline" ? palette.danger[4] : "";

  const BTN = (
    <Button
      disabled={props.disabled}
      onClick={() => {
        if (props.onClick) props.onClick();
      }}
      {...(props.fullWidth ? { fullWidth: props.fullWidth } : {})}
      sx={{
        boxShadow: "none",
        height: HEIGHT,
        ":hover": {
          bgcolor:
            VARIANT === "filled" ? hoverColor || palette.primary[1] : hoverColor || "initial",
          borderColor: hoverColor || palette.primary[2],
        },
        bgcolor:
          VARIANT === "filled" ? bgColor || palette.primary[2] : bgColor || palette.contrasts[5],
        borderColor: borderColor || palette.primary[2],
        color: VARIANT === "filled" && !props.color ? palette.contrasts[5] : color || palette.primary[2],
        ...STYLE,
      }}
      variant={VARIANT === "filled" ? "contained" : "outlined"}
    >
      <Typography sx={{ textTransform: "initial" }}>{props.children}</Typography>
    </Button>
  );

  return props.to ? <Link to={props.to}>{BTN}</Link> : BTN;
}

export default XNGButton;
