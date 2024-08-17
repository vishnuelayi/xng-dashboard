import { useOutletContext } from "react-router";
import ReportsContextType from "./reports_context_type";

// contexts for the entire reports view
const useReportsContext = () => {
  return useOutletContext<ReportsContextType>();
};

export default useReportsContext;
