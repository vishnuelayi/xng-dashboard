import { SxProps, useMediaQuery } from "@mui/material";
import { BoxTypeMap } from "@mui/system";
import Box from "./BoxExtended";
import { DefaultComponentProps } from "@mui/material/OverridableComponent";

type MediaQueryBoxProps = {
  showIf: string;
  onBreak?: () => void;
  sx: SxProps;
  children: any;
};
function MediaQueryBox(props: MediaQueryBoxProps) {
  const isResized = useMediaQuery(props.showIf);
  if (props.onBreak) {
    if (isResized) {
      props.onBreak();
    }
  }

  return (
    <Box
      sx={{
        display: "none",
        [props.showIf]: props.sx ? { ...props.sx } : { ...{ display: "block" } },
      }}
    >
      {props.children}
    </Box>
  );
}

export default MediaQueryBox;
