import useApiMutateData from "../use_api_mutate_data";
import { API_SESSION_LOGS } from "../../api";
import { V1SessionReportsSessionLogsQueueReportPostRequest } from "@xng/reporting";
import XNGApiMutateParamObject from "../../../types/xng_api_mutate_param_object";

type Data = Awaited<ReturnType<typeof API_SESSION_LOGS.v1SessionReportsSessionLogsQueueReportPost>>; // generic parameter T is used to define data the type of the useApiMutateData hook
type Body =  V1SessionReportsSessionLogsQueueReportPostRequest | undefined;  // generic parameter B is used to define body the type of the useApiMutateData hook

const useApiMutateQueSessionLogsReport = (paramObject?: Partial<XNGApiMutateParamObject<{}, Data, Body>>) => {
  return useApiMutateData({
    mutationFn: async (body: Body) =>
      await API_SESSION_LOGS.v1SessionReportsSessionLogsQueueReportPost(body),
    mutationKey: ["v1SessionReportsSessionLogsQueueReportPost"],
    gcTime: 600000,
    ...(paramObject?.options ?? {}),
  });
};

export default useApiMutateQueSessionLogsReport;
