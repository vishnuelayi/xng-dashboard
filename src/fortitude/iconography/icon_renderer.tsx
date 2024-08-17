import { Box } from "@mui/system";

export type MSBIconSize = "xl" | "lg" | "md" | "sm" | "xs" | "caret" | string;
function getSize(sz: MSBIconSize) {
  switch (sz) {
    case "xl":
      return "55px";
    case "lg":
      return "30px";
    case "md":
      return "22px";
    case "sm":
      return "20px";
    case "xs":
      return "14px";
    case "caret":
      return "8px";
    default:
      return sz;
  }
}
interface MSBIcon {
  color?: string;
  size: MSBIconSize;
  i: JSX.Element;
  onClick?: any;
  disableRenderer?: boolean;
  left?: boolean;
  right?: boolean;
  up?: boolean;
  down?: boolean;
}
export default function MSBIconRenderer(props: MSBIcon) {
  const size = getSize(props.size);
  const dir = props.down ? 90 : props.left ? 180 : props.up ? 270 : 0;

  return (
    <Box
      sx={{
        display: "flex" + "!important",
        justifyContent: "center" + "!important",
        alignItems: "center" + "!important",
        minWidth: size + "!important",
        minHeight: size + "!important",
        transform: `rotate(${dir}deg)` + "!important",
        svg: {
          width: size + "!important",
          height: size + "!important",
          color: props.color,
          "*": props.disableRenderer
            ? {
                stroke: props.color + "!important",
              }
            : {
                stroke: props.color + "!important",
                strokeWidth: 0 + "!important",
                fill: props.color + "!important",
              },
        },
        maxWidth: size + "!important",
        maxHeight: size + "!important",
      }}
      onClick={props.onClick}
    >
      {props.i}
    </Box>
  );
}

export function getSxRecolorChildMSBIcons(color: string) {
  return {
    svg: {
      color: color + "!important",
      "*": {
        stroke: color + "!important",
        fill: color + "!important",
      },
    },
  };
}
