import { DefaultComponentProps } from "@mui/types";
import Box from "./BoxExtended";
import { Menu, SxProps } from "@mui/material";
import { BoxTypeMap } from "@mui/system";
type XNGMenuAnchorBoxProps = {
  onClickSetAnchorEl: (v: HTMLElement) => void;
  onClickSetOpen: (v: boolean) => void;
  sx: SxProps;
  children: React.ReactNode;
};
export function XNGMenuAnchorBox(props: XNGMenuAnchorBoxProps) {
  return (
    <Box
      sx={props.sx ? props.sx : { width: "100%", height: "100%" }}
      onClick={(e) => {
        props.onClickSetAnchorEl(e.currentTarget);
        props.onClickSetOpen(true);
      }}
    >
      {props.children}
    </Box>
  );
}

interface IXNGMenu {
  anchorEl: null | HTMLElement;
  open: boolean;
  onClose: () => void;
  content: JSX.Element;
}
export function XNGMenu(props: IXNGMenu) {
  return (
    <Menu anchorEl={props.anchorEl} open={props.open} onClose={() => props.onClose()}>
      {props.content}
    </Menu>
  );
}
