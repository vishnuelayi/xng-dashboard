import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { MWD } from "../../views/calendar/types";

interface CalendarViewMode {
  calendarViewMode: MWD;
}

const initialState: CalendarViewMode = {
  calendarViewMode: "Month",
};

export const calendarViewModeSlice = createSlice({
  name: "calendarViewMode",
  initialState,
  reducers: {
    ACTION_SetCalendarViewMode: (state, action: PayloadAction<MWD>) => {
      state.calendarViewMode = action.payload;
    },
  },
});

// ACTIONS, used to execute logic
export const ACTION_SetCalendarViewMode = calendarViewModeSlice.actions.ACTION_SetCalendarViewMode;

export default calendarViewModeSlice.reducer;
