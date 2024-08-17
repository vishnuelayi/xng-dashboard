import { createContext } from "react";
import { SelectedUnpostedSessionsFilterType } from "../types/SelectedUnpostedSessionsFilter";
import UnpostedSessionsContextType from "../types/UnpostedSessionsContextType";
/**
 * Context object for unposted sessions.
 */
const UnpostedSessionsContext = createContext<UnpostedSessionsContextType>({
  routeState: {
    notator: {
      inNotator: false,
      setInNotator: (inNotator: boolean) => {},
    },
  },
  selectedFilterData: {
    selectedFilter: {} as SelectedUnpostedSessionsFilterType,
    setSelectedFilter: (filter: {
      [key in keyof SelectedUnpostedSessionsFilterType]: SelectedUnpostedSessionsFilterType[key];
    }) => {},
    updateSelectedFilterSessionIndex: (IncrementValue: -1 | 1| string) => {},
    // filterOptions: {
    //   providerOptions: [] as string[],
    //   studentOptions: [] as string[],
    //   campusOptions: [] as string[],
    // },
  },
  unpostedSessionsData:{
    unpostedSessionsApiData:undefined,
    unpostedSessionsCountData:undefined,
  }
});

export default UnpostedSessionsContext;
