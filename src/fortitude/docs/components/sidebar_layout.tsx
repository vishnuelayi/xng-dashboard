import { useEffect, useState } from "react";
import useBreakpointHelper from "../../../design/hooks/use_breakpoint_helper";
import { Box, IconButton } from "@mui/material";
import { PiCaretRightBold } from "react-icons/pi";
import { VIRTUAL_ASSISTANT_OFFSET_REM } from "../constants/virtual_assistant_offset_rem";
import { SIDEBAR_CLOSED_WIDTH } from "../constants/sidebar_closed_width";

export function SidebarLayout(props: {
  children: React.ReactNode;
  collapseOnMobileDependencies?: any[];
}) {
  const [isOpen, setIsOpen] = useState<boolean>(true);

  const bph = useBreakpointHelper();
  const shouldCollapse = !bph.isGreaterThanEqualTo("sm");
  useEffect(() => {
    if (shouldCollapse) {
      setIsOpen(false);
    }
  }, [shouldCollapse]);

  const EXPANDED_WIDTH = `${17 + VIRTUAL_ASSISTANT_OFFSET_REM}rem`;

  useEffect(() => {
    if (bph.isMobile) {
      setIsOpen(false);
    }
  }, [props.collapseOnMobileDependencies]);

  return (
    <Box
      sx={{
        bgcolor: "#0001",
        minHeight: "100%",
        maxHeight: "100%",
        flexBasis: 1,
        minWidth: isOpen ? (bph.isMobile ? "100%" : EXPANDED_WIDTH) : SIDEBAR_CLOSED_WIDTH,
        transition: "min-width .4s ease",
      }}
    >
      <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
        <IconButton
          onClick={() => setIsOpen(!isOpen)}
          size="medium"
          sx={{
            transform: `rotate(${isOpen ? "180deg" : "0deg"})`,
            transition: "transform .2s ease",
          }}
        >
          <PiCaretRightBold />
        </IconButton>
      </Box>

      <Box
        sx={{
          transform: `translateX(${isOpen ? 0 : "-20rem"})`,
          transition: "transform .4s ease",
          minWidth: EXPANDED_WIDTH,
        }}
      >
        {props.children}
      </Box>
    </Box>
  );
}
