import { IconButton, Popover } from "@mui/material";
import usePalette from "../../hooks/usePalette";
import { useState } from "react";
import { MSBICONS, MSBIconRenderer } from "../../fortitude";
import { CalendarFilterView } from "./calendar_filter_view";

/**
 * This is a component that will conditionally render a clickable filter button if the user
 * is of the approver role. Upon clicking a popup window will appear providing further
 * options to filter the calendar more sophisticatedly.
 *
 * The `Approver` prefix can be removed if we choose to roll this feature out to other roles in the future.
 * Since it is intended to only serve Approver roles currently, it makes sense to have an explicit name.
 */
export function ApproverFilterButton() {
  const popoverState = useFilterPopoverState();
  const palette = usePalette();

  return (
    <>
      <IconButton onClick={popoverState.handleClick}>
        <MSBIconRenderer color={palette.contrasts[5]} size="sm" i={<MSBICONS.Filter />} />
      </IconButton>

      <Popover
        open={popoverState.open}
        anchorEl={popoverState.anchorEl}
        onClose={popoverState.handleClose}
        anchorOrigin={{ horizontal: "left", vertical: "bottom" }}
        sx={{ mt: ".75rem" }}
      >
        <CalendarFilterView onClose={popoverState.handleClose} />
      </Popover>
    </>
  );
}

function useFilterPopoverState() {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  function handleClick(event: React.MouseEvent<HTMLButtonElement>) {
    setAnchorEl(event.currentTarget);
  }
  function handleClose() {
    setAnchorEl(null);
  }
  const open = Boolean(anchorEl);

  return { anchorEl, open, handleClick, handleClose };
}
