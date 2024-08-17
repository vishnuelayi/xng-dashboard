import useApiMutateData from "../use_api_mutate_data";
import { API_SESSION_LOGS } from "../../api";
import { V1SessionReportsSessionLogsDownloadPDFPostRequest } from "@xng/reporting";
import XNGApiMutateParamObject from "../../../types/xng_api_mutate_param_object";

type Data = Awaited<ReturnType<typeof API_SESSION_LOGS.v1SessionReportsSessionLogsDownloadPDFPost>>; // generic parameter T is used to define data the type of the useApiMutateData hook
type Body = V1SessionReportsSessionLogsDownloadPDFPostRequest;  // generic parameter B is used to define body the type of the useApiMutateData hook


const useApiMutateDownloadSessionLogsPdf = (paramObject?: Partial<XNGApiMutateParamObject<{}, Data, Body>>) => {
  return useApiMutateData({
    mutationFn: async (body: Body) =>
      API_SESSION_LOGS.v1SessionReportsSessionLogsDownloadPDFPost(body),
    mutationKey: ["v1SessionReportsSessionLogsDownloadPDFPost"],
    ...(paramObject?.options ?? {})
  });
};

export default useApiMutateDownloadSessionLogsPdf;
