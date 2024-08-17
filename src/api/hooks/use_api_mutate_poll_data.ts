
import { ApiResponse } from "@xng/reporting";
import { useEffect, useRef, useState } from "react";
import useApiMutateData, { MSBMutationOptionsType, MSBMutationResultType } from "./use_api_mutate_data";
import { useQueryClient } from "@tanstack/react-query";

/* 
  Data represents the data type that the query function will return.
  Body represents the type of the body object that the mutation function will receive.
*/

type OptionsType<Data, Body> = {
  mutationFn: MSBMutationOptionsType<ApiResponse<Data>, Body>["mutationFn"],
  intervalDelay?: number, // The delay between polling requests
} & Omit<MSBMutationOptionsType<Data, Body>, "mutationFn">;

const useApiMutatePollData = <Data, Body = any>(options: OptionsType<Data, Body>) => {

  const [rawStatusCode, setRawStatusCode] = useState<number>(100); // The status code of the response

  const [resolvedData, setResolvedData] = useState<Data | undefined>(undefined); // The resolved data from the API, needed since we can't read a stream multiple times

  const queryClient = useQueryClient();

  // timout IDs References
  const pollTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const onSettledTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);

  const mutation = useApiMutateData({
    ...options,
    /* 
      polling success is determined by the status code of the response.
    */
    onMutate(variables) {
      pollTimeoutRef.current && clearTimeout(pollTimeoutRef.current);
      options.onMutate && options.onMutate(variables);
    },
    onSuccess(rawData, variables, context) {
      pollTimeoutRef.current && clearTimeout(pollTimeoutRef.current);
      if (rawData.raw.status === 202) {
        setRawStatusCode(202);
        pollTimeoutRef.current = setTimeout(() => mutation.mutate(variables), options.intervalDelay || 15000);
      } else if (rawData.raw.status === 200) {
        setRawStatusCode(200);
        rawData.value().then((d) => {
          setResolvedData(d)
          queryClient.setQueryData([options.mutationKey], d);
          // Call the onSuccess function if it exists, only after the data has been set and the polling process is completed
          options.onSuccess && options.onSuccess(d, variables, context);
        });
      }
      else {
        setRawStatusCode(rawData.raw.status);
      }
    },
    // onSettled override needed to ensure the onSettled function is called after the polling process is completed
    onSettled(_, error, variables, context) {
      onSettledTimeoutRef.current && clearTimeout(onSettledTimeoutRef.current);
      onSettledTimeoutRef.current = setTimeout(() => {
        setResolvedData(prev => {
          options.onSettled && options.onSettled(prev, error, variables, context);
          return prev;
        })
      }, 100);
    },
  })

  //polling status override needed to accurately reflect the status of the polling mutation
  const pollStatusRef = useRef<MSBMutationResultType<ApiResponse<Data>, Body>["status"]>("idle");

  //polling status state
  const [pollStatus, setPollStatus] = useState<MSBMutationResultType<ApiResponse<Data>, Body>["status"]>("idle");

  //polling is pending if the mutation is pending or the polling status is pending
  const pollIsPending = mutation.isPending || pollStatusRef.current === "pending";

  //polling is successful if the mutation is successful and the polling status is successful
  const pollIsSuccess = mutation.isSuccess && pollStatusRef.current === "success";

  //polling method override needed to ensure the polling process is completed before returning the data
  const pollMutateAsync = async (variables: Body, options?: MSBMutationOptionsType<ApiResponse<Data>, Body> | undefined) => {
    try {
      await mutation.mutateAsync(variables, options);

      return new Promise<Data>((resolve, reject) => {
        const intervalId = setInterval(() => {
          if (pollStatusRef.current === "success") {
            resolve(resolvedData as Data);
            clearInterval(intervalId);
          }
          if (pollStatusRef.current === "error") {
            reject(mutation.error);
            clearInterval(intervalId);
          }
          if (pollStatusRef.current === "idle") {
            clearInterval(intervalId);
            resolve(resolvedData as Data);
          }
        }, 500);

      });
    }
    catch (e) {
      throw e;
    }
  }

  const reset = () => {
    setPollStatus("idle");
    setRawStatusCode(100);
    setResolvedData(undefined);
    queryClient.removeQueries({ queryKey: [options.mutationKey] });
    if (pollTimeoutRef.current) {
      clearTimeout(pollTimeoutRef.current);
      pollTimeoutRef.current = undefined;
    }
    if (onSettledTimeoutRef.current) {
      clearTimeout(onSettledTimeoutRef.current);
      onSettledTimeoutRef.current = undefined;
    }
    mutation.reset(); //reset original mutation object to clean up any unhandled state
  }

  // unnecesary function to start the polling process, optional to maintain consistency with the other hook
  const start = () => {
    mutation.mutate({} as Body);
  };

  //unnecesary function to stop the polling process, optional to maintain consistency with the other hook
  const stop = () => {
    reset();
  }

  useEffect(() => {
    pollStatusRef.current = mutation.status === "success" ? rawStatusCode === 202 ? "pending" : "success" : mutation.status;
    setPollStatus(pollStatusRef.current);
  }, [mutation.status, rawStatusCode])

  //cleanup
  useEffect(() => {
    return () => {
      pollTimeoutRef.current && clearTimeout(pollTimeoutRef.current);
      onSettledTimeoutRef.current && clearTimeout(onSettledTimeoutRef.current);
    }
  }, [])


  
  // Override the defualt mutation results to reflect the polling process
  const mutationResultsOverride = {
    status: pollStatus,
    isPending: pollIsPending,
    isSuccess: pollIsSuccess,
    reset: reset,
    mutateAsync: pollMutateAsync,
    data: (queryClient.getQueryData<Data>([options.mutationKey]) || resolvedData),
  }

  const customResult = {
    raw: (mutation.data as ApiResponse<Data>)?.raw,
      // unnecesary function to start the polling process, optional to maintain consistency with the other hook
    start,
      //unnecesary function to stop the polling process, optional to maintain consistency with the other hook
    stop,
  }

  return { ...mutation, ...mutationResultsOverride, ...customResult };
};

export default useApiMutatePollData;
