import React, { createContext, useContext } from "react";
import { useCalendarFilterOptionsReducer } from "./modules/filters/use_calendar_filter_options_state";
import { CalendarFilterReducer } from "./modules/filters/types";

/**
 * Note if trying to reference from an external module: Use `useCalendarContext` instead
 */
const CalendarContext = createContext<CalendarContextStore | null>(null);
interface CalendarContextStore {
  calendarFilterState: CalendarFilterReducer;
}

export const CalendarContextProvider = (props: { children: React.ReactNode }) => {
  const calendarFilterState = useCalendarFilterOptionsReducer();

  const value: CalendarContextStore = {
    calendarFilterState,
  };

  return <CalendarContext.Provider value={value}>{props.children}</CalendarContext.Provider>;
};

export function useCalendarContext(): CalendarContextStore {
  const context = useContext(CalendarContext);
  if (!context) {
    throw new Error("useCalendarContext must be used within a CalendarContextProvider");
  }
  return context;
}
