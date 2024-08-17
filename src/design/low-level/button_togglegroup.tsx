import Box from "../components-dev/BoxExtended";
import usePalette from "../../hooks/usePalette";
import { BORDER_RADIUSES } from "../borderRadiuses";
import { getSizing } from "../sizing";
import { XNGStandardTab } from "../types/xngStandardTab";
import { XNGButtonSize, getButtonHeight } from "./button_types";
import { ButtonBase, SxProps, Typography } from "@mui/material";

interface IXNGToggleGroup {
  options: XNGStandardTab[];
  size?: XNGButtonSize;
  value?: string;
  sx?: SxProps;
  border?: string;
  borderRadius?: string;
}
function XNGToggleGroup(props: IXNGToggleGroup) {
  const palette = usePalette();
  const HEIGHT = props.size ? getButtonHeight(props.size) : getButtonHeight("default");
  const NOSELECT: boolean = !props.value;
  const STYLE = props.sx ? props.sx : ({} as SxProps);

  return (
    <Box
      sx={{
        display: "inline-flex",
        borderRadius: props.borderRadius || BORDER_RADIUSES[0],
        overflow: "hidden",
        border: props.border || "1px solid " + palette.contrasts[3],
        cursor: "pointer",
        height: HEIGHT,
        bgcolor: "white",
      }}
    >
      {props.options.map((o: XNGStandardTab, i) => {
        const ID = o.id ? o.id : o.label;
        const SELECTED = NOSELECT ? false : ID === props.value;
        const click = o.onClick ? o.onClick : undefined;

        return (
          <ButtonBase
            disableRipple={o.unclickable}
            disableTouchRipple={o.unclickable}
            key={i}
            className="noselect"
            onClick={click}
            sx={{
              bgcolor: SELECTED ? palette.primary[2] : "initial",
              color: SELECTED ? palette.contrasts[5] : "initial",
              minWidth: getSizing(4),
              display: "flex",
              justifyContent: "center",
              paddingX: getSizing(1),
              borderRight:
                i === props.options.length - 1 ? "none" : "1px solid " + palette.contrasts[3],
              alignItems: "center",
              ":hover": {
                bgcolor: SELECTED ? palette.primary[1] : palette.contrasts[4],
              },
              transition: "background-color .2s ease",
              ":active": {
                bgcolor: SELECTED ? palette.primary[1] : palette.contrasts[3],
              },
              cursor: o.unclickable ? "default" : "pointer",
              ...STYLE,
              ...o.sx,
            }}
          >
            {o.icon}
            <Typography>{o.label}</Typography>
          </ButtonBase>
        );
      })}
    </Box>
  );
}

export default XNGToggleGroup;
