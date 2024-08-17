
import { UseMutationOptions, useMutation } from "@tanstack/react-query";

/* 
  T represents the data type that the query function will return.
  E represents the error type that the query function can throw.
  B represents the type of the body object that the mutation function will receive.
*/

type E = Error;

type MSBMutationOptionsType<T, B> = {
  mutationFn: UseMutationOptions<T, E, B>["mutationFn"],
  mutationKey: UseMutationOptions<T, E, B>["mutationKey"]
} & UseMutationOptions<T, E, B>;

type MSBMutationResultType<T, B> = ReturnType<typeof useMutation<T, E, B>>;

const useApiMutateData = <T, B>(options: MSBMutationOptionsType<T, B>) => {

  return useMutation<T, E, B>({ ...options })
};

// type Test = typeof useApiMutateData;

export type { MSBMutationOptionsType, MSBMutationResultType};

export default useApiMutateData;
