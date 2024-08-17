import { API_SESSIONS } from '../../../../../api/api'
import useApiMutateData from '../../../../../api/hooks/use_api_mutate_data';
import { RequestRevisionsRequest } from '../../../../../session-sdk';
import XNGApiMutateParamObject from '../../../../../types/xng_api_mutate_param_object';
import API_MUTATION_KEYS from '../../../../../api/constants/mutation_keys';

type Data = Awaited<ReturnType<typeof API_SESSIONS.v1SessionsRequestRevisionsAndUpdateStatusPatch>>; // generic parameter T is used to define data the type of the useApiMutateData hook
type Body = Required<RequestRevisionsRequest>; 
type QueryParams = {
    state: string,
}

const useApiMutateRequestRevisionsAndUpdateSessionStatus = (paramObject:XNGApiMutateParamObject<QueryParams, Data, Body>) => {
    const {state} = paramObject.queryParams
    return useApiMutateData({
        mutationFn: async(body:Body)=> API_SESSIONS.v1SessionsRequestRevisionsAndUpdateStatusPatch(state, body),
        mutationKey: [API_MUTATION_KEYS.mutateRequestRevisionsAndUpdateSessionStatus, state],
        ...(paramObject.options ?? {})
    })
}

export default useApiMutateRequestRevisionsAndUpdateSessionStatus
