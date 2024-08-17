import Box from "../design/components-dev/BoxExtended";
import { useTheme, useMediaQuery } from "@mui/material";
import { getSizing } from "../design/sizing";
import XNGSidebar from "../design/high-level/sidebar/sidebar";
import { SidebarItemAnyProps } from "../design/types/sidebar_content";
import { NAVBAR_HEIGHT } from "../design/high-level/navbar/Navbar";
import ZINDEX_LAYERS from "../constants/zIndexLayers";

interface ISidebarLayout {
  sidebarContent: SidebarItemAnyProps[];
  content: JSX.Element;
}
function SidebarLayout(props: ISidebarLayout) {
  const thm = useTheme();
  const isMobile = useMediaQuery(thm.breakpoints.down("md"));
  const FILL_ABSOLUTE_SPACE_ON_MOBILE: number = 7;

  return (
    <Box
      sx={{
        position: "relative",
        height: "100%",
        display: "flex",
        paddingLeft: getSizing(FILL_ABSOLUTE_SPACE_ON_MOBILE),
        overflowY: "auto",
      }}
    >
      <Box
        className="noselect"
        sx={{
          zIndex: ZINDEX_LAYERS.sidebar,
          top: isMobile ? NAVBAR_HEIGHT : 0,
          position: isMobile ? "fixed" : "sticky",
          height: "100%",
          marginLeft: getSizing(-FILL_ABSOLUTE_SPACE_ON_MOBILE),
        }}
      >
        <XNGSidebar sidebarContent={props.sidebarContent} />
      </Box>
      <Box sx={{ display: "block", width: "100%", height: "100%" }}>{props.content}</Box>
    </Box>
  );
}

export default SidebarLayout;
