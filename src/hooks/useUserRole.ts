/**
 * @deprecated This hook is deprecated and should not be used. Please use alternative solution @module useUserRole instead.
 * 
 * @remarks
 * This hook is used to determine the user role based on the logged-in client assignment.
 * The user role is determined by checking various flags such as isExecutiveAdmin, isDelegatedAdmin, isAutonomous, isApprover, and isProxyDataEntry.
 * 
 * @returns An object containing the userRole and two callback functions: isApprover and isAssistant.
 * 
 * @public
 * @deprecated
 */
import { useMemo, useCallback } from "react";
import { useXNGSelector } from "../context/store";
import { selectLoggedInClientAssignment } from "../context/slices/userProfileSlice";
import { XLogsRole } from "../profile-sdk";

/**
 * T
 */
export default function useUserRole() {
  const { isExecutiveAdmin, isDelegatedAdmin, isAutonomous, isApprover, isProxyDataEntry } =
    useXNGSelector(selectLoggedInClientAssignment);

  const userRole: XLogsRole = useMemo(() => {
    if (isExecutiveAdmin && isAutonomous && isApprover && isProxyDataEntry) {
      // Executive Admin
      return XLogsRole.NUMBER_0;
    }

    if (isDelegatedAdmin && isAutonomous && isApprover && isProxyDataEntry) {
      // Delegated Admin
      return XLogsRole.NUMBER_1;
    }

    if (isAutonomous && isApprover) {
      // Approver
      return XLogsRole.NUMBER_2;
    }

    if (isAutonomous && isProxyDataEntry) {
      // Proxy Data Entry
      return XLogsRole.NUMBER_3;
    }

    if (isAutonomous) {
      // Service Provider - Autonomous
      return XLogsRole.NUMBER_4;
    } else {
      // Service Provider - Assistant
      return XLogsRole.NUMBER_5;
    }
  }, [isExecutiveAdmin, isDelegatedAdmin, isApprover, isProxyDataEntry, isAutonomous]);

  return {
    userRole,
    // A service provider is an approver if they are an Executive Admin, Delegated Admin, or just an Approver
    isApprover: useCallback(() => !!isApprover, [isApprover]),
    isAssistant: useCallback(() => userRole === XLogsRole.NUMBER_5, [userRole]),
  };
}
