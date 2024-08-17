import { useMemo } from "react";
import { selectLoggedInClientAssignment } from "../context/slices/userProfileSlice";
import { useXNGSelector } from "../context/store";
import { XLogsRoleStrings } from "../context/types/xlogsrole";

/**
 * This will maintain an array representing the user's associated roles based on their logged in client assignment.
 */
function useUserRoles(): XLogsRoleStrings[] {
  const { isExecutiveAdmin, isDelegatedAdmin, isAutonomous, isApprover, isProxyDataEntry } =
    useXNGSelector(selectLoggedInClientAssignment);

  const userRoles = useMemo(() => {
    let res: XLogsRoleStrings[] = [];

    if (isExecutiveAdmin) res.push("Executive Admin");
    if (isDelegatedAdmin) res.push("Delegated Admin");
    if (isAutonomous) res.push("Service Provider - Autonomous");
    if (isApprover) res.push("Approver");
    if (isProxyDataEntry) res.push("Proxy Data Entry");
    res.push("Service Provider - Assistant");

    return res;
  }, [isExecutiveAdmin, isDelegatedAdmin, isAutonomous, isApprover, isProxyDataEntry]);

  return userRoles;
}

export default useUserRoles;
