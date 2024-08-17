import { DropdownSidebarItemProps } from "../../types/sidebar_content";
import { SIZE, useSidebarPalette } from "./_";
import { useRef } from "react";
import { Typography } from "@mui/material";
import { XNGIconRenderer, getSxRecolorChildXNGIcons } from "../../icons";
import usePalette from "../../../hooks/usePalette";
import { getSizing } from "../../sizing";
import Box from "../../components-dev/BoxExtended";
import DropdownIndicator from "../../low-level/dropdown_indicator";
import VerticalTabs from "../../low-level/tabs_vertical";
import SquareIconButton from "./icon_button_square";
import { useXNGSelector } from "../../../context/store";
import { sidebarOpen } from "../../../context/slices/sidebarSlice";

function DropdownSidebarItem(props: {
  item: DropdownSidebarItemProps;
  onSetOpen: () => void;
  isOpen: boolean;
  displayAsSelected: boolean;
}) {
  // HOOKS
  const palette = useSidebarPalette();

  // HEIGHT SYSTEM
  const myRef = useRef<HTMLDivElement | null>(null);
  function getHeight() {
    return myRef.current?.clientHeight;
  }

  // REDUX
  const isSidebarOpen = useXNGSelector(sidebarOpen);

  // GET COLOR
  function getItemIconColor(): string {
    if (isSidebarOpen && props.displayAsSelected) {
      return palette.selected;
    }
    if (props.isOpen) {
      return palette.selected;
    }
    return palette.deselected;
  }

  return (
    <>
      <Box
        onClick={() => {
          props.onSetOpen();
        }}
        sx={{
          display: "flex",
          width: "100%",
          cursor: "pointer",
          ":hover": {
            ".MuiTypography-root": { color: palette.selected },
            ...getSxRecolorChildXNGIcons(palette.selected),
          },
          height: getSizing(5),
          alignItems: "center",
        }}
      >
        <SquareIconButton
          onClick={() => {
            props.onSetOpen();
          }}
        >
          <XNGIconRenderer color={getItemIconColor()} size={SIZE} i={props.item.icon} />
        </SquareIconButton>
        <Typography
          className="noselect"
          variant="body1"
          sx={{ marginLeft: getSizing(1), marginRight: getSizing(2) }}
          color={props.isOpen ? palette.selected : palette.deselected}
        >
          {props.item.label}
        </Typography>
        <DropdownIndicator
          color={props.isOpen ? palette.selected : palette.deselected}
          open={props.isOpen}
        />
      </Box>
      <Box sx={{ paddingLeft: getSizing(5), paddingRight: getSizing(2) }}>
        <Box
          sx={{
            height: props.isOpen ? getHeight() : 0,
            overflow: "hidden",
            transition: "all .2s ease",
          }}
        >
          <div ref={myRef}>
            <VerticalTabs
              round
              disableBorder
              overrideColor={{
                border: palette.deselected,
                text: palette.deselected,
                texthover: palette.selected,
                bghover: palette.bgcolorHover,
              }}
              size="compact"
              tabs={props.item.tabs}
            />
          </div>
        </Box>
      </Box>
    </>
  );
}

export default DropdownSidebarItem;
