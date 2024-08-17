import {  UseQueryOptions } from "@tanstack/react-query";

type TanStackOptions<T> = Omit<UseQueryOptions<T>, "queryFn" | "queryKey">;

/**
 * Represents an object that contains query parameters and options for an XNG API Query Hook.
 *
 * @template QueryParams - The type of the query parameters.
 * @template Data - The type of the data returned by the API request.
 */
type XNGApiQueryParamObject<QueryParams, Data> = {
    queryParams: QueryParams;
    options?: TanStackOptions<Data>;
}

export default XNGApiQueryParamObject;