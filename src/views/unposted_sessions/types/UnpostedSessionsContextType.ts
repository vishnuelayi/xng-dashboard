import { GetUnpostedSessionCountResponse } from "../../../session-sdk";
import { SelectedUnpostedSessionsFilterType } from "./SelectedUnpostedSessionsFilter";
import UnpostedSessionsCardApiData from "./UnpostedSessionsCardApiData";

/**
 * Defines the shape of the context object used for managing unposted sessions context.
 */
type UnpostedSessionsContextType = {
  routeState: {
    notator: {
      inNotator: boolean;
      setInNotator: (inNotator: boolean) => void;
    };
  };
  selectedFilterData: {
    selectedFilter: SelectedUnpostedSessionsFilterType;
    setSelectedFilter: (filter: {
      [key in keyof SelectedUnpostedSessionsFilterType]: SelectedUnpostedSessionsFilterType[key];
    }) => void;
    updateSelectedFilterSessionIndex: (IncrementValue: -1 | 1 | string) => void;
  };
  unpostedSessionsData: {
    unpostedSessionsCountData: GetUnpostedSessionCountResponse | undefined;
    unpostedSessionsApiData: UnpostedSessionsCardApiData["data"] | undefined;
};

}

export default UnpostedSessionsContextType;
