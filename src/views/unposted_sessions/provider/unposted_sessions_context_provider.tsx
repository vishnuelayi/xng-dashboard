import React from "react";
import UnpostedSessionsContext from "../context/unposted_sessions_context";
import useUnpostedSessionsRouteStateCtxProperty from "../hooks/context_properties/useUnpostedSessionsRouteStateCtxProperty";
import { useXNGSelector } from "../../../context/store";
// import useUnpostedSessionsCardsApi from "../hooks/api/useUnpostedSessionsCardsApi";
import useUnpostedSessionsSelectedFilterCxtProperty from "../hooks/context_properties/useUnpostedSessionsSelectedFilterCxtProperty";
import useUnpostedSessionsCardsApi from "../hooks/api/useUnpostedSessionsCardsApi";

/**
 * Provides context for unposted sessions for meta data like filters, etc.
 * @param children - The child components to render.
 * @returns The provider component.
 */
const UnpostedSessionsContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {

  const refetchUnpostedSessions = useXNGSelector(state => state.unpostedSessionsSlice.refetchUnpostedSessions);
  useUnpostedSessionsCardsApi(refetchUnpostedSessions);
  // const unpostedSessionsSlimCards = useUnpostedSessionsCardsApi(refetchUnpostedSessions);
  const unpostedSessionsApiData = useXNGSelector(state => state.unpostedSessionsSlice.unpostedSessionsMappedCards);
  const routeState = useUnpostedSessionsRouteStateCtxProperty();
  const selectedFilterData = useUnpostedSessionsSelectedFilterCxtProperty(unpostedSessionsApiData?.slimCards);
  const unpostedSessionsCountData = useXNGSelector(state => state.unpostedSessionsSlice.unpostedSessionsCountResponse);

  // console.log("selectedFilterData", selectedFilterData);
  // console.log("unpostedSessionsCountData", unpostedSessionsCountData);
  // console.log("unpostedSessionsApiData", unpostedSessionsApiData);
// console.log("unpostedSessionsApiData", unpostedSessionsApiData)
  return (
    <UnpostedSessionsContext.Provider
      value={{
        routeState,
        selectedFilterData,
        unpostedSessionsData: {
          unpostedSessionsCountData,
          unpostedSessionsApiData,
        }
      }}
    >
      {children}
    </UnpostedSessionsContext.Provider>
  );
};

export default UnpostedSessionsContextProvider;
