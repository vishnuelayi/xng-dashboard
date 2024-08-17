import {
  MutationFunction,
  MutationKey,
  UseMutationOptions,
  UseMutationResult,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { ApiResponse } from "@xng/reporting";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

const DEFAULT_KEY = ["DEFAULT_KEY"]; // Used when caching isn't necessary

/**
 * Custom hook that accepts a Reporting endpoint in the form of a TanStack Query mutation function. After
 * firing `start()`, this hook will poll the Reporting API until successfully retrieving a result.
 *
 * Created with the help of the BE to make sure it accurately reflects the way the BE expects the FE to
 * interact with poll requests.
 *
 * @returns `start` This function will begin the polling process using the provided Reporting endpoint.
 * @returns `result` Initialized with null, this will cache the returned data once polling is complete.
 *
 * Note: This function should only return a `PollRequest`.
 */
export function useReportingPollRequest<T>(props: ReportingPollRequestProps<T>): PollRequest<T> {
  const interval = props.interval ?? POLLING_INTERVAL;
  const timeoutRef = useRef<number | null>(null);
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async () => await props.mutationFn(),

    onSuccess: (data) => {
      if (data.raw.status === 202) {
        timeoutRef.current = window.setTimeout(() => mutation.mutate(), interval);
      } else if (data.raw.status === 200) {
        cacheDataAsync(data);
      }
    },

    mutationKey: props.mutationKey,

    ...props.useMutationOptions,
  });

  async function cacheDataAsync(data: ApiResponse<T>) {
    queryClient.setQueryData(props.mutationKey ?? DEFAULT_KEY, (await data.value()) as T);
  }

  // Return subscribed, potentially cached result (if any)
  const result = useSubscribe<T>(props.mutationKey ?? DEFAULT_KEY);

  // Clean-up to prevent memory leak during request cancellations
  useEffect(() => {
    return () => {
      stop();
    };
  }, []);

  const stop = useCallback(() => {
    if (timeoutRef.current !== null) {
      window.clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  const start = useMemo(() => mutation.mutate, [mutation]);

  const isPolling = useMemo(() => !result && mutation.status !== "idle", [result, mutation.status]);

  return { start, result, mutation, isPolling, stop };
}

function useSubscribe<T>(mutationKey: MutationKey) {
  const queryClient = useQueryClient();
  const [result, setResult] = useState<T | null>(
    () => queryClient.getQueryData(mutationKey) ?? null,
  );

  useEffect(() => {
    const updateData = () => setResult(queryClient.getQueryData(mutationKey) ?? null);
    const unsubscribe = queryClient.getQueryCache().subscribe(updateData);

    return () => unsubscribe();
  }, [mutationKey, queryClient]);

  return result;
}

// ------------------------------ CONTRACTS ------------------------------

/**
 * Represents the poll request system and the general way we expect to handle these
 * mechanisms. Intentionally agnostic of the 'Reports' tab, we may extract this type
 * to a higher level if other tabs similarly implement polling in the future
 * (which we currently expect them to).
 *
 * @property `start` Function that will fire repeatedly until polling is complete.
 * @property `result` The stateful cache for a polled result.
 * @property `mutation` The internal mutation object provided by TanStack Query.
 * @property `isPolling` Represents if the poll request process has been started and is actively pending a result.
 */
export interface PollRequest<T> {
  start: () => void;
  stop: () => void;
  result: T | null;
  mutation: UseMutationResult<ApiResponse<T>, Error, void, unknown>;
  isPolling: boolean;
}

/**
 * Closed for modification
 */
type ReportingPollRequestBaseProps<T> = {
  mutationFn: MutationFunction<ApiResponse<T>, void>;
};

type ReportingPollRequestOptionalProps<T> = {
  useMutationOptions?: Partial<UseMutationOptions<ApiResponse<T>, Error, void, unknown>>;
  interval?: number;
  mutationKey?: MutationKey;
};

export type ReportingPollRequestProps<T> = ReportingPollRequestBaseProps<T> &
  ReportingPollRequestOptionalProps<T>;

// We will consider viable enumerable values soon
export const POLLING_INTERVAL = 15000;
