import { XNGICONS, XNGIconRenderer } from "../../icons";
import { getSizing } from "../../sizing";
import Box from "../../components-dev/BoxExtended";
import {
  SidebarItemAnyProps as SidebarItemAnyProps,
  ButtonSidebarItemProps as ButtonSidebarItemProps,
  DropdownSidebarItemProps as DropdownSidebarItemProps,
} from "../../types/sidebar_content";
import { useXNGDispatch, useXNGSelector } from "../../../context/store";
import { setSidebarOpen, sidebarOpen } from "../../../context/slices/sidebarSlice";
import SquareIconButton from "./icon_button_square";
import { SIZE, useSidebarPalette } from "./_";
import ButtonSidebarItem from "./sidebar_item_button";
import DropdownSidebarItem from "./sidebar_item_dropdown";
import { useState } from "react";
import { useLocation } from "react-router-dom";

interface IXNGSidebar {
  sidebarContent: (ButtonSidebarItemProps | DropdownSidebarItemProps)[];
}
function XNGSidebar(props: IXNGSidebar) {
  // HOOKS
  const palette = useSidebarPalette();
  const location = useLocation();
  const dispatch = useXNGDispatch();

  // CONSTANTS
  const EXPANDED_WIDTH = getSizing(36);

  // REDUX STATE
  const isSidebarOpen = useXNGSelector(sidebarOpen);

  // TYPE CHECKERS
  function sbiIsDropdown(sbi: SidebarItemAnyProps) {
    return "tabs" in sbi;
  }

  // STATES
  const [open, setOpen] = useState<number | null>(null);

  // CALLBACKS
  function onSidebarClose() {
    // close all dropdowns, if any
    setOpen(null);
  }

  // DOM HIERARCHY
  return (
    <Box
      sx={{
        width: isSidebarOpen ? EXPANDED_WIDTH : getSizing(7),
        bgcolor: palette.bgcolor,
        height: "100%",
        padding: getSizing(1),
        overflow: "hidden",
        transition: "width .2s ease",
      }}
    >
      <Box width={EXPANDED_WIDTH}>
        <MainHamburger onSidebarClose={() => onSidebarClose()} />

        {props.sidebarContent.map((sbi: SidebarItemAnyProps, i: number) => {
          if (sbiIsDropdown(sbi)) {
            return (
              <DropdownSidebarItem
                displayAsSelected={location.pathname === sbi.route}
                item={sbi as DropdownSidebarItemProps}
                isOpen={i === open}
                onSetOpen={() => {
                  if (!isSidebarOpen) {
                    setOpen(i);
                    dispatch(setSidebarOpen(true));
                    return;
                  }
                  if (i === open) {
                    setOpen(null);
                  } else {
                    setOpen(i);
                  }
                }}
                key={i}
              />
            );
          }
          return (
            <ButtonSidebarItem
              displayAsSelected={location.pathname === sbi.route}
              item={sbi as ButtonSidebarItemProps}
              key={i}
            />
          );
        })}
      </Box>
    </Box>
  );
}

function MainHamburger(props: { onSidebarClose: () => void }) {
  const dispatch = useXNGDispatch();
  const isSidebarOpen = useXNGSelector(sidebarOpen);
  const palette = useSidebarPalette();

  return (
    <SquareIconButton
      onClick={() => {
        if (isSidebarOpen) {
          props.onSidebarClose();
          dispatch(setSidebarOpen(false));
        } else {
          dispatch(setSidebarOpen(true));
        }
      }}
      sx={{ marginBottom: getSizing(3) }}
    >
      <XNGIconRenderer color={palette.deselected} size={SIZE} i={<XNGICONS.Hamburger />} />
    </SquareIconButton>
  );
}

export default XNGSidebar;
