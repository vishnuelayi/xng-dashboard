import { useContext, useEffect, useCallback } from "react";
import { UNSAFE_NavigationContext as NavigationContext } from "react-router-dom";
import type {
  unstable_Blocker as Blocker,
  unstable_BlockerFunction as BlockerFunction,
} from "react-router-dom";
import { unstable_useBlocker as useBlocker } from "react-router-dom";

export function useNavigationBlocker(dirty: boolean) {
  let shouldBlock = useCallback<BlockerFunction>(
    ({ currentLocation, nextLocation }) =>
      dirty && currentLocation.pathname !== nextLocation.pathname,
    [dirty],
  );
  let blocker = useBlocker(shouldBlock);
  return blocker;
}
