import { SxProps } from "@mui/material";
import { getSxRecolorChildXNGIcons } from "../../icons";
import { getSizing } from "../../sizing";
import Box from "../../components-dev/BoxExtended";
import { BORDER_RADIUSES } from "../../borderRadiuses";
import { useSidebarPalette } from "./_";

interface IIconButton {
  children: React.ReactNode;
  onClick?: () => void;
  sx?: SxProps;
}
function SquareIconButton(props: IIconButton) {
  // HOOKS
  const palette = useSidebarPalette();

  // CONSTANTS
  const SELECTION_COLOR: SxProps = getSxRecolorChildXNGIcons(palette.selected);

  return (
    <div>
      <Box
        sx={{ paddingRight: getSizing(1) }}
        onClick={() => {
          if (props.onClick) {
            props.onClick();
          }
        }}
      >
        <Box
          sx={{
            ":hover": {
              cursor: "pointer",
              bgcolor: palette.bgcolorHover,
              ...SELECTION_COLOR,
            },
            width: getSizing(5),
            height: getSizing(5),
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            borderRadius: BORDER_RADIUSES[0],
            ...props.sx,
          }}
        >
          {props.children}
        </Box>
      </Box>
    </div>
  );
}

export default SquareIconButton;
