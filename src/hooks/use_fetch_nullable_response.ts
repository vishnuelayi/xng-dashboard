import { useEffect, useState } from "react";
import useEffectSkipMount from "./use_effect_after_mount";

/**
 * Accepts any asynchronous request and calls it in an effect with an optional dependency array.
 * Closed to modification.
 *
 * @returns Nullable API response for any given API request
 */
function useFetchNullableResponse<T>(
  apiRequest: () => Promise<T>,
  dependencyArray?: any[],
  options?: UseFetchNullableResponseOptions,
): T | null {
  const [res, setRes] = useState<T | null>(null);

  const skipMount = options?.skipMount ?? false;

  async function fetchAndCache() {
    const res = await apiRequest();

    setRes(res);
  }

  useEffect(
    () => {
      if (!skipMount) fetchAndCache();
    },
    dependencyArray ? [...dependencyArray] : [],
  );

  useEffectSkipMount(
    () => {
      if (skipMount) fetchAndCache();
    },
    dependencyArray ? [...dependencyArray] : [],
  );

  return res;
}

type UseFetchNullableResponseOptions = {
  skipMount?: boolean;
};

export default useFetchNullableResponse;
