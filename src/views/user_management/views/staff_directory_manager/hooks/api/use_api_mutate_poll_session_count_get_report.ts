import { API_SESSIONS_COUNT } from "../../../../../../api/api";
import { V1StudentReportsSessionCountGetReportPostRequest } from "@xng/reporting/dist/apis/SessionCountApi";
import XNGApiMutateParamObject from "../../../../../../types/xng_api_mutate_param_object";
import useApiMutatePollData from "../../../../../../api/hooks/use_api_mutate_poll_data";
import { ApiResponse } from "@xng/reporting";

type Data = Awaited<
  ReturnType<typeof API_SESSIONS_COUNT.v1StudentReportsSessionCountGetReportPostRaw>
> extends ApiResponse<infer T>
  ? T
  : never;
type Body = V1StudentReportsSessionCountGetReportPostRequest; // generic parameter B is used to define body the type of the useApiMutateData hook

const useApiMutatePollSessionCountGetReport = (
  paramObject?: Partial<XNGApiMutateParamObject<{}, Data, Body>>,
) => {
  return useApiMutatePollData<Data, Body>({
    mutationFn: async (body: Body) =>
      API_SESSIONS_COUNT.v1StudentReportsSessionCountGetReportPostRaw(body),
    mutationKey: ["v1StudentReportsSessionCountGetReportPostRaw"],
    ...paramObject?.options,
  });
};

export default useApiMutatePollSessionCountGetReport;
