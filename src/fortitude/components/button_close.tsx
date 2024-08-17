import { SxProps, IconButton } from "@mui/material";
import { Box } from "@mui/system";
import MSBIconRenderer from "../iconography/icon_renderer";
import MSBICONS from "../iconography/icons";

interface MSBCloseProps {
  onClick: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
  sx?: SxProps;
}

function MSBClose(props: MSBCloseProps) {
  const sizeRem = "1rem";

  return (
    <Box
      onClick={(e) => props.onClick(e)}
      sx={{
        ":hover": { cursor: "pointer", svg: { stroke: "red!important" } },
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: sizeRem,
        width: sizeRem,
        minHeight: sizeRem,
        minWidth: sizeRem,
        maxHeight: sizeRem,
        maxWidth: sizeRem,
        ...props.sx,
      }}
    >
      <IconButton>
        <MSBIconRenderer i={<MSBICONS.Close />} size={sizeRem} />
      </IconButton>
    </Box>
  );
}

export default MSBClose;
