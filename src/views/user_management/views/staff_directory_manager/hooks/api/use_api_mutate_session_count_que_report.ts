import useApiMutateData from "../../../../../../api/hooks/use_api_mutate_data";
import { API_SESSIONS_COUNT } from "../../../../../../api/api";
import { V1StudentReportsSessionCountQueueReportPostRequest } from "@xng/reporting/dist/apis/SessionCountApi";
import XNGApiMutateParamObject from "../../../../../../types/xng_api_mutate_param_object";

type Data = Awaited<
  ReturnType<typeof API_SESSIONS_COUNT.v1StudentReportsSessionCountQueueReportPost>
>; // generic parameter T is used to define data the type of the useApiMutateData hook
type Body = V1StudentReportsSessionCountQueueReportPostRequest; // generic parameter B is used to define body the type of the useApiMutateData hook

const useApiMutateSessionCountQueueReport = (
  paramObject?: Partial<XNGApiMutateParamObject<{}, Data, Body>>,
) => {
  return useApiMutateData({
    mutationFn: async (body: Body) =>
      API_SESSIONS_COUNT.v1StudentReportsSessionCountQueueReportPost(body),
    mutationKey: ["v1StudentReportsSessionCountQueueReportPost"],
    ...(paramObject?.options ?? {}),
  });
};

export default useApiMutateSessionCountQueueReport;
