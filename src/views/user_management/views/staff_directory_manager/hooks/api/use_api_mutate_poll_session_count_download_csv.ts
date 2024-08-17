import { API_SESSIONS_COUNT } from "../../../../../../api/api";
import { V1StudentReportsSessionCountDownloadCSVPostRequest } from "@xng/reporting/dist/apis/SessionCountApi";
import XNGApiMutateParamObject from "../../../../../../types/xng_api_mutate_param_object";
import useApiMutatePollData from "../../../../../../api/hooks/use_api_mutate_poll_data";
import { ApiResponse } from "@xng/reporting";

type Data = Awaited<
  ReturnType<typeof API_SESSIONS_COUNT.v1StudentReportsSessionCountDownloadCSVPostRaw>
> extends ApiResponse<infer T>
  ? T
  : never;
type Body = V1StudentReportsSessionCountDownloadCSVPostRequest; // generic parameter B is used to define body the type of the useApiMutateData hook

const useApiMutatePollSessionCountDownloadCSV = (
  paramObject?: Partial<XNGApiMutateParamObject<{}, Data, Body>>,
) => {
  return useApiMutatePollData<Data, Body>({
    mutationFn: async (body: Body) =>
      API_SESSIONS_COUNT.v1StudentReportsSessionCountDownloadCSVPostRaw(body),
    mutationKey: ["v1StudentReportsSessionCountDownloadCSVPostRaw"],
    ...paramObject?.options,
  });
};

export default useApiMutatePollSessionCountDownloadCSV;
