import { useOutletContext } from "react-router";
import SessionLogsContextType from "./session_logs_context_type";

// contexts for the entire session logs view
const useSessionLogsContext = () => {
  return useOutletContext<SessionLogsContextType>();
};

export default useSessionLogsContext;
