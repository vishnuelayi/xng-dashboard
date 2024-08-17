import { useMemo } from "react";
import { useLocation } from "react-router";

/**
 * To inform usage of the path segments memoized in `path`, our conventional path structure in X Logs is as follows:
 *
 * `[hostname]/[product]/[view]/[feature]`
 *
 * ### Example usage for differentiating between notator and calendar
 * * When viewing calendar, `path[2]` evaluates to `"calendar"`
 * * When viewing notator, `path[2]` evaluates to `"notator"`
 */
function usePath() {
  /**
   * Named `lctn` to prevent conflict with Web API native `location` object
   */
  const lctn = useLocation();
  const path = useMemo(() => lctn.pathname.split("/"), [lctn]);

  return path;
}

export default usePath;
