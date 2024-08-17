import { IconButton, IconButtonProps } from "@mui/material";
import { XNGIconRenderer, XNGICONS } from "../../../../design/icons";
import usePalette from "../../../../hooks/usePalette";

type Props = {
  iconDir: "left" | "right";
  onClick?: IconButtonProps["onClick"];
};

const ArrowIconBtn = (props: Props) => {
  const palette = usePalette();
  return (
    <IconButton
      sx={{
        backgroundColor: palette.primary[2],
        ":hover": { backgroundColor: palette.primary[3] },
        borderRadius: "5px",
        pointerEvents: "all",
      }}
      onClick={props.onClick}
    >
      <XNGIconRenderer
        i={<XNGICONS.CaretOutline />}
        size="xs"
        color="white"
        left={props.iconDir === "left"}
        right={props.iconDir === "right"}
      />
    </IconButton>
  );
};

export default ArrowIconBtn;
