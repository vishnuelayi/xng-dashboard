import ZINDEX_LAYERS from "../../constants/zIndexLayers";
import usePalette from "../../hooks/usePalette";
import Box from "../components-dev/BoxExtended";
import { getSizing } from "../sizing";
import { Checkbox, IconButton } from "@mui/material";

interface IXNGCheckbox {
  checked: boolean;
  onToggle: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  disabled?: boolean;
}
function XNGCheckbox(props: IXNGCheckbox) {
  const palette = usePalette();
  const { disabled } = props;

  return (
    <Box
      sx={{
        position: "relative",
        svg: { color: palette.contrasts[3] },
        ".Mui-checked": {
          svg: {
            color: disabled ? "inherit" : palette.primary[2],
          },
        },
        ".Mui-checked:hover": {
          bgcolor: "unset",
        },
        button: {
          padding: 0,
        },
      }}
    >
      {/* <IconButton> */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: ZINDEX_LAYERS.xngCheckboxRipple,
        }}
      >
        <Checkbox
          size="small"
          sx={{
            ".MuiTouchRipple-root": { display: "none" },
            zIndex: ZINDEX_LAYERS.xngCheckbox,
            svg: { color: "#c1c1c1" },
          }}
          checked={props.checked}
          onClick={(e) => props.onToggle(e)}
          disabled={disabled}
        />
      </Box>
      {/* </IconButton> */}
    </Box>
  );
}

export default XNGCheckbox;
