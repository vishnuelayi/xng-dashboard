import Box from "../components-dev/BoxExtended";
import { BOX_SHADOWS } from "../styles/boxShadow";
import { SxProps } from "@mui/material";

interface IXNGCard {
  children: React.ReactNode;
  sx?: SxProps;
}
function XNGCard(props: IXNGCard) {
  const STYLES = props.sx ? props.sx : ({} as SxProps);

  return (
    <Box sx={{ ...STYLES, boxShadow: "rgba(0, 0, 0, 0.16) 0px 1px 4px;" }}>{props.children}</Box>
  );
}

export default XNGCard;
