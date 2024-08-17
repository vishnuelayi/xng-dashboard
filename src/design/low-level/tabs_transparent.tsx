import { Tab, Tabs, useTheme, Breakpoint, Typography, SxProps } from "@mui/material";
import { Link } from "react-router-dom";
import { XNGStandardTab } from "../types/xngStandardTab";
import MediaQueryBox from "../components-dev/MediaQueryBox";
import { useState } from "react";
import DropdownIndicator from "./dropdown_indicator";
import Box from "../components-dev/BoxExtended";
import VerticalTabs from "./tabs_vertical";
import { getSizing } from "../sizing";
import { XNGMenu, XNGMenuAnchorBox } from "../components-dev/xng_menu";
import usePalette from "../../hooks/usePalette";

interface ITransparentTabs {
  value: number;
  tabs: XNGStandardTab[];
  useDropdownBreakpoint?: { breakpoint: number | Breakpoint; selectedValue: number };
}
function TransparentTabs(props: ITransparentTabs) {
  // HOOKS
  const theme = useTheme();
  const palette = usePalette();
  // STATE
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [open, setOpen] = useState<boolean>(false);

  // SX CONSTANTS
  const TABS_SX: SxProps = {
    minHeight: "100%",
    "a, .MuiTabs-flexContainer": { minHeight: "100%", textTransform: "capitalize" },
    "*": {
      ".Mui-selected, .MuiButtonBase-root-MuiTab-root.Mui-selected": {
        color: palette.primary[2] + "!important",
      },
    },
    a: { color: palette.contrasts[2] },
    ".MuiTabs-indicator": { bgcolor: palette.primary[2] },
  };

  return (
    <>
      <XNGMenu
        content={<VerticalTabs onClick={() => setOpen(false)} tabs={props.tabs} />}
        anchorEl={anchorEl}
        open={open}
        onClose={() => setOpen(false)}
      />
      {props.useDropdownBreakpoint ? (
        <>
          <MediaQueryBox
            showIf={theme.breakpoints.down(props.useDropdownBreakpoint.breakpoint)}
            sx={{ display: "flex" }}
          >
            <XNGMenuAnchorBox
              sx={{ display: "flex", width: "100%", height: "100%" }}
              onClickSetAnchorEl={(v: HTMLElement) => setAnchorEl(v)}
              onClickSetOpen={(v) => setOpen(v)}
            >
              <Tabs value={0} sx={TABS_SX}>
                <Tab
                  sx={{ textTransform: "capitalize" }}
                  label={
                    <Box sx={{ display: "flex", gap: getSizing(1) }}>
                      <Typography variant="body1">
                        {props.tabs[props.useDropdownBreakpoint.selectedValue]?.label}
                      </Typography>
                      <Box>
                        <DropdownIndicator open={open} />
                      </Box>
                    </Box>
                  }
                />
              </Tabs>
            </XNGMenuAnchorBox>
          </MediaQueryBox>
          <MediaQueryBox
            showIf={theme.breakpoints.up(props.useDropdownBreakpoint.breakpoint)}
            sx={{ display: "flex" }}
            onBreak={() => setOpen(false)}
          >
            <HorizontalTabs sxTabs={TABS_SX} value={props.value} tabs={props.tabs} />
          </MediaQueryBox>
        </>
      ) : (
        <HorizontalTabs sxTabs={TABS_SX} value={props.value} tabs={props.tabs} />
      )}
    </>
  );
}

function HorizontalTabs(props: { value: number; tabs: XNGStandardTab[]; sxTabs: SxProps }) {
  const palette = usePalette();

  return (
    <Tabs value={props.value} sx={props.sxTabs}>
      {props.tabs.map((tab: XNGStandardTab, i: number) => {
        return tab.navTo ? (
          <Tab
            key={i}
            sx={{ textTransform: "capitalize" }}
            label={<Typography variant="body1">{tab?.label}</Typography>}
            onClick={() => {
              if (tab.onClick) {
                tab.onClick();
              }
            }}
            component={Link}
            to={tab.navTo}
            target={tab.target}
          />
        ) : (
          <Tab
            key={i}
            sx={{ textTransform: "capitalize" }}
            label={<Typography variant="body1">{tab?.label}</Typography>}
            onClick={() => {
              if (tab.onClick) {
                tab.onClick();
              }
            }}
          />
        );
      })}
    </Tabs>
  );
}

export default TransparentTabs;
