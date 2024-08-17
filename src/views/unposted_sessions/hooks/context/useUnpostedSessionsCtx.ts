import { useContext } from "react";
import UnpostedSessionsContext from "../../context/unposted_sessions_context";

/**
 * A custom hook that returns the data from the UnpostedSessionsContext.
 * @returns The data from the UnpostedSessionsContext.
 */
const useUnpostedSessionsCtx = () => {
  const unpostedSessionsData = useContext(UnpostedSessionsContext);
  return unpostedSessionsData;
};

export default useUnpostedSessionsCtx;
