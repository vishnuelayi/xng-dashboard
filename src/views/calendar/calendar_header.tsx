import { Box, Input, Typography } from "@mui/material";
import { MWD } from "./types";
import { RootState, useXNGSelector } from "../../context/store";
import { getSizing } from "../../design/sizing";
import { XNGICONS, XNGIconRenderer } from "../../design";
import XNGToggleGroup from "../../design/low-level/button_togglegroup";
import usePalette from "../../hooks/usePalette";
import dayjs, { Dayjs } from "dayjs";
import XNGButton from "../../design/low-level/button";
import { ApproverFilterButton } from "./calendar_filter_button";
import { ApproverFilterBubbles } from "./assistant_filter_bubbles";
import sessionStorageKeys from "../../constants/sessionStorageKeys";
import { Dispatch, SetStateAction } from "react";
import { useCalendarContext } from "./context/context";

/**
 * In order to modularize the calendar header into its own component and streamline its memoized dependencies, we are going to
 * encapsulate all of its previously dependent state. Ideally, we may want to turn this into an isolated module using a useReducer
 * pattern or even contextual state. For now, we'll package it and pass it to the `<CalendarHeader />`.
 *
 * ### NOTE: This is closed off to any additions! In the instance of needing modifications, consider removing the field from this type.
 *
 * For more information:
 * This is effectively a way to have our header component accept its previous dependencies as part of a progressive Calendar refinement.
 * This is not an antipattern considering that the code seen will not change. For all developers who need to add new state or affect current
 * state within the calendar header module, do so in other ways: consider passing a state and callback, leveraging the `CalendarFilterState`
 * if your new functionality pertains to filter functionality, or perhaps even build the foundation for a new CalendarHeader context.
 */
export interface LegacyCalendarHeaderState {
  focusedDate: dayjs.Dayjs;
  setFocusedDate: React.Dispatch<React.SetStateAction<dayjs.Dayjs>>;
  setMWD: Dispatch<SetStateAction<MWD>>;
}

export function CalendarHeader(props: {
  onCreateClick: (start?: Date, end?: Date) => void;
  legacyState: LegacyCalendarHeaderState;
}) {
  const mwd: MWD = useXNGSelector(
    (state: RootState) => state.calendarViewModeSlice.calendarViewMode,
  );
  const palette = usePalette();
  const focusedDateKey = sessionStorageKeys.FOCUSED_DATE_KEY;
  const { focusedDate, setFocusedDate, setMWD } = props.legacyState;

  const weekFormatter = (date: Dayjs) => {
    const beginningOfTheWeek = date.date(date.date() - date.day());

    if (beginningOfTheWeek.date(beginningOfTheWeek.date() + 6).date() < beginningOfTheWeek.date()) {
      if (date.month() === 11)
        return `${beginningOfTheWeek.format("MMMM D")}, ${date.year()}-${beginningOfTheWeek
          .date(beginningOfTheWeek.date() + 6)
          .format("MMMM D")}, ${date.year() + 1}`;
      return `${beginningOfTheWeek.format("MMMM D")}-${beginningOfTheWeek
        .date(beginningOfTheWeek.date() + 6)
        .format("MMMM D")}, ${date.year()}`;
    }

    return `${beginningOfTheWeek.format("MMMM D")}-${beginningOfTheWeek
      .date(beginningOfTheWeek.date() + 6)
      .date()}, ${date.year()}`;
  };

  function onIncrement(i: number) {
    switch (mwd) {
      case "Day":
        setFocusedDate(focusedDate.add(i, "day"));
        sessionStorage.setItem(focusedDateKey, focusedDate.add(i, "day").toISOString());
        break;
      case "Week":
        setFocusedDate(focusedDate.add(i, "week"));
        sessionStorage.setItem(focusedDateKey, focusedDate.add(i, "week").toISOString());
        break;
      case "Month":
        setFocusedDate(focusedDate.add(i, "month"));
        sessionStorage.setItem(focusedDateKey, focusedDate.add(i, "month").toISOString());
        break;
    }
  }

  const calendarContext = useCalendarContext();

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          position: "relative",
        }}
      >
        <Box
          sx={{
            position: "absolute",
            width: "100%",
            justifyContent: "center",
            display: "flex",
          }}
        >
          <Typography sx={{ color: palette.contrasts[5] }} className="noselect" variant="h6">
            {mwd === "Day" && focusedDate.format("MMMM D, YYYY")}
            {mwd === "Week" && weekFormatter(focusedDate)}
            {mwd === "Month" && focusedDate.format("MMMM YYYY")}
          </Typography>
        </Box>
        <Input
          placeholder="Type here to search"
          onChange={(e) => {
            calendarContext.calendarFilterState.setSessionName(e.target.value);
          }}
          value={calendarContext.calendarFilterState.sessionName}
          sx={{
            backgroundColor: palette.contrasts[5],
            "& .MuiInputBase-input": {
              borderLeft: "2px solid #E0E0E0",
            },
            borderRadius: "4px 4px 4px 4px",
          }}
          startAdornment={
            <XNGIconRenderer disableRenderer i={<XNGICONS.Search />} size="md" color="black" />
          }
        />
        <XNGButton
          sx={{
            backgroundColor: palette.primary[3],
            color: palette.contrasts[5],
          }}
          onClick={() =>
            props.onCreateClick(
              dayjs(new Date()).startOf("day").add(8, "hours").toDate(),
              dayjs(new Date()).startOf("day").add(9, "hours").toDate(),
            )
          }
        >
          Create Session
        </XNGButton>
      </Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: getSizing(2),
          position: "relative",
        }}
      >
        <Box
          sx={{
            display: "flex",
            gap: getSizing(2),
            alignItems: "center",
            height: "3rem",
          }}
        >
          <Box
            sx={{
              display: "flex",
              // gap: getSizing(2),
              margin: "unset",
              padding: "unset",
              alignItems: "center",
            }}
          >
            <XNGToggleGroup
              options={[
                {
                  icon: (
                    <XNGIconRenderer
                      size="caret"
                      left
                      i={<XNGICONS.Caret />}
                      color={palette.primary[2]}
                    />
                  ),
                  onClick: () => {
                    onIncrement(-1);
                  },
                },
              ]}
              sx={{ backgroundColor: palette.contrasts[5], width: "57.5px" }}
              borderRadius="4px 0px 0px 4px"
            />
            <XNGToggleGroup
              options={[
                {
                  icon: (
                    <XNGIconRenderer
                      size="caret"
                      right
                      i={<XNGICONS.Caret />}
                      color={palette.primary[2]}
                    />
                  ),
                  onClick: () => {
                    onIncrement(1);
                  },
                },
              ]}
              sx={{ backgroundColor: palette.contrasts[5], width: "57.5px" }}
              borderRadius="0px 4px 4px 0px"
            />
          </Box>
          <XNGButton
            variant="outline"
            sx={{
              backgroundColor: palette.primary[3],
              color: palette.contrasts[5],
            }}
            onClick={() => {
              setFocusedDate(dayjs());
              sessionStorage.setItem(focusedDateKey, dayjs().toISOString());
            }}
          >
            Today
          </XNGButton>

          <ApproverFilterButton />
          <ApproverFilterBubbles />
        </Box>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: getSizing(2),
          }}
        >
          <XNGToggleGroup
            options={[{ label: "Month", onClick: () => setMWD("Month") }]}
            sx={{
              backgroundColor: mwd === "Month" ? palette.primary[3] : palette.contrasts[5],
              color: mwd === "Month" ? palette.contrasts[5] : palette.primary[2],
              border: "unset",
              ":hover": {},
              width: "82px",
              height: "28px",
            }}
            value={mwd === "Month" ? "Month" : ""}
            border="unset"
          />
          <XNGToggleGroup
            options={[{ label: "Week", onClick: () => setMWD("Week") }]}
            sx={{
              backgroundColor: mwd === "Week" ? palette.primary[3] : palette.contrasts[5],
              color: mwd === "Week" ? palette.contrasts[5] : palette.primary[2],
              border: "unset",
              ":hover": {},
              width: "82px",
              height: "28px",
            }}
            value={mwd === "Week" ? "Week" : ""}
            border="unset"
          />
          <XNGToggleGroup
            options={[{ label: "Day", onClick: () => setMWD("Day") }]}
            sx={{
              backgroundColor: mwd === "Day" ? palette.primary[3] : palette.contrasts[5],
              color: mwd === "Day" ? palette.contrasts[5] : palette.primary[2],
              border: "unset",
              ":hover": {},
              width: "82px",
              height: "28px",
            }}
            value={mwd === "Day" ? "Day" : ""}
            border="unset"
          />
        </Box>
      </Box>
    </Box>
  );
}
