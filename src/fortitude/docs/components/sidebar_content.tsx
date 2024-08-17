import { Link, Stack, Typography } from "@mui/material";
import { VIRTUAL_ASSISTANT_OFFSET_REM } from "../constants/virtual_assistant_offset_rem";

export type SidebarItemType = "link" | "header" | "subheader";
export type SidebarItem<T extends string> = {
  type: SidebarItemType;
  docLink?: T;
  label?: string;
};
export function SidebarContentGenerator<T extends string>(props: {
  items: SidebarItem<T>[];
  onLinkClick: (id: T) => void;
}) {
  const SUBHEADER_PY = "1rem";

  const pxRem = 1.5;

  return (
    <Stack
      sx={{
        pr: `${pxRem}rem`,
        pl: `${pxRem + VIRTUAL_ASSISTANT_OFFSET_REM}rem`,
        gap: ".25rem",
        overflow: "auto",
        maxHeight: "calc(100vh - 7rem)",
      }}
    >
      {props.items.map((item, i) => {
        switch (item.type) {
          case "link":
            return (
              <Link
                key={i}
                className="noselect"
                sx={{
                  textDecoration: "none",
                  ":hover": { filter: "brightness(120%)" },
                }}
                onClick={() => {
                  if (!item.docLink) return;
                  props.onLinkClick(item.docLink as T);
                }}
              >
                {item.label ?? item.docLink}
              </Link>
            );
          case "header":
            return (
              <Typography
                className="noselect"
                key={i}
                sx={{ color: "#333" }}
                p={i === 0 ? `0 0 ${SUBHEADER_PY} 0` : `${SUBHEADER_PY} 0`}
                variant="h5"
              >
                {item.label}
              </Typography>
            );
          case "subheader":
            return (
              <Typography
                className="noselect"
                key={i}
                variant="body1"
                sx={{ color: "#000B", pt: ".5rem", pb: ".25rem", fontWeight: "bold" }}
              >
                {item.label}
              </Typography>
            );
          default:
            throw new Error("Fallthrough in switch! Was a new sidebar item type introduced?");
        }
      })}
    </Stack>
  );
}
