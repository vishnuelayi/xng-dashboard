import { UseMutationOptions } from "@tanstack/react-query";

type TanStackOptions<T, B> = Omit<UseMutationOptions<T, Error, B>, "mutationFn" | "mutationKey">;

/**
 * Represents the parameters for a mutation request in the XNG API Mutation hook.
 *
 * @template QueryParams - The type of the query parameters.
 * @template Data - The type of the response data.
 * @template Body - The type of the request body.
 */
type XNGApiMutateParamObject<QueryParams, Data, Body> = {
    queryParams: QueryParams;
    options?: TanStackOptions<Data, Body>;
}

export default XNGApiMutateParamObject;