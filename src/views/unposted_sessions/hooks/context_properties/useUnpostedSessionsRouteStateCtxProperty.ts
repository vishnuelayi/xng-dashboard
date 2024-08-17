import React from "react";
import UnpostedSessionsContextType from "../../types/UnpostedSessionsContextType";

/**
 * Returns the route state context property for unposted sessions view.
 * @returns {UnpostedSessionsContextType["a"]} The route state context property for unposted sessions view.
 */
const useUnpostedSessionsRouteStateCtxProperty = () => {
  const [inNotator, setInNotator] = React.useState<boolean>(false);

  const updateInNotator = (flag: boolean) => {
    setInNotator(flag);
  };

  const routeState: UnpostedSessionsContextType["routeState"] = {
    notator: {
      inNotator,
      setInNotator: updateInNotator,
    },
  };

  return routeState;
};

export default useUnpostedSessionsRouteStateCtxProperty;
