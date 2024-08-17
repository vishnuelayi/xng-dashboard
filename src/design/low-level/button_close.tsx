import Box from "../components-dev/BoxExtended";
import { XNGICONS, XNGIconRenderer, XNGIconSize } from "../icons";
import { getSizing } from "../sizing";
import { SxProps, IconButton } from "@mui/material";

export type CloseSize = "default" | "modal";

interface IXNGClose {
  onClick: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
  size?: CloseSize;
  sx?: SxProps;
}
function XNGClose(props: IXNGClose) {
  const size: CloseSize = props.size ?? "modal";

  // set defaults
  let wrapSize = getSizing(4);
  let iconSize: XNGIconSize = "md";
  let translateX = 0;
  // overwrite if specified
  if (size === "modal") {
    wrapSize = getSizing(3.5);
    iconSize = "xs";
    translateX = 3;
  }

  return (
    <Box
      onClick={(e) => props.onClick(e)}
      sx={{
        ":hover": { cursor: "pointer", svg: { stroke: "red!important" } },
        height: wrapSize,
        width: wrapSize,
        minHeight: wrapSize,
        minWidth: wrapSize,
        maxHeight: wrapSize,
        maxWidth: wrapSize,
        ...props.sx,
      }}
    >
      <IconButton>
        <XNGIconRenderer i={<XNGICONS.Close />} size={iconSize} />
      </IconButton>
    </Box>
  );
}

export default XNGClose;
