import useApiMutateData from "../use_api_mutate_data";
import { API_SESSION_LOGS } from "../../api";
import { V1SessionReportsSessionLogsGetSummaryPostRequest } from "@xng/reporting";
import XNGApiMutateParamObject from "../../../types/xng_api_mutate_param_object";



type Data = Awaited<ReturnType<typeof API_SESSION_LOGS.v1SessionReportsSessionLogsGetSummaryPost>>; // generic parameter T is used to define data the type of the useApiMutateData hook
type Body = V1SessionReportsSessionLogsGetSummaryPostRequest | undefined;  // generic parameter B is used to define body the type of the useApiMutateData hook

const useApiGetMutateSessionLogsSummary = (paramObject?: Partial<XNGApiMutateParamObject<{}, Data, Body>>) => {

  return useApiMutateData({
    mutationFn: async (body: Body) =>
    await API_SESSION_LOGS.v1SessionReportsSessionLogsGetSummaryPost(body),
    mutationKey: ["v1SessionReportsSessionLogsGetSummaryPost"],
    ...(paramObject?.options ?? {}),
  });
};

export default useApiGetMutateSessionLogsSummary;
