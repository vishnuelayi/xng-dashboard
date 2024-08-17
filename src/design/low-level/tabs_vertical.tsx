import { Box, Typography } from "@mui/material";
import usePalette from "../../hooks/usePalette";
import { XNGStandardTab } from "../types/xngStandardTab";
import { Link } from "react-router-dom";
import { getSizing } from "../sizing";
import { BORDER_RADIUSES } from "../borderRadiuses";
import { useEffect } from "react";
import { XNGICONS, XNGIconRenderer } from "../icons";

type RowSize = "compact" | "standard";

function VerticalTabs(props: {
  tabs: XNGStandardTab[];
  displayCarets?: boolean;
  onClick?: () => void;
  size?: RowSize;
  overrideColor?: {
    text: string;
    texthover: string;
    bghover: string;
    border: string;
  };
  round?: boolean;
  disableBorder?: boolean;
  minWidth?: string;
}) {
  const palette = usePalette();
  const compact = props.size === "compact";

  const COLOR_BGHOVER: string = props.overrideColor
    ? props.overrideColor.bghover
    : palette.contrasts[4];
  const COLOR_TEXT: string = props.overrideColor ? props.overrideColor.text : "";
  const COLOR_BORDER: string = props.overrideColor
    ? props.overrideColor.border
    : palette.contrasts[3];
  const COLOR_TEXT_HOVER: string = props.overrideColor ? props.overrideColor.texthover : "";

  return (
    <>
      {props.tabs.map((tab: XNGStandardTab, i) => {
        const isLastItem = i === props.tabs.length - 1;
        return (
          <Box
            className="noselect"
            key={i}
            onClick={() => {
              if (tab.onClick) {
                tab.onClick();
              }
              if (props.onClick) {
                props.onClick();
              }
            }}
            {...(tab.navTo ? { to: tab.navTo, component: Link } : {})}
            sx={{
              position: "relative",
              textTransform: "capitalize",
              textDecoration: "none",
              color: palette.contrasts[1],
              display: "flex",
              padding: compact ? getSizing(1) : getSizing(2),
              minWidth: props.minWidth ? props.minWidth : "10rem",
              width: "100%",
              borderBottom: props.disableBorder
                ? "none"
                : isLastItem
                ? "none"
                : `1px ${COLOR_BORDER} solid`,
              alignItems: "center",
              borderRadius: props.round ? BORDER_RADIUSES[0] : 0,
              ":hover": {
                cursor: "pointer",
                bgcolor: COLOR_BGHOVER,
                ".MuiTypography-root": {
                  color: props.overrideColor ? COLOR_TEXT_HOVER : "initial",
                },
              },
            }}
          >
            {tab.icon && <Box sx={{ marginRight: getSizing(1) }}>{tab.icon}</Box>}
            <Typography color={COLOR_TEXT} variant="body2">
              {tab.label}
            </Typography>
            <Box sx={{ position: "absolute", right: getSizing(2) }}>
              <XNGIconRenderer i={<XNGICONS.CaretOutline />} size="caret" />
            </Box>
          </Box>
        );
      })}
    </>
  );
}

export default VerticalTabs;
