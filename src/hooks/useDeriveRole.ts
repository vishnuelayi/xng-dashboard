import { selectLoggedInClientAssignment } from "../context/slices/userProfileSlice";
import { useXNGSelector } from "../context/store";
import { XLogsRoleStrings } from "../context/types/xlogsrole";

function useDerivedRole(sessionServiceProviderID: string) {
  let res = null as XLogsRoleStrings | null;

  const loggedInClientAssignment = useXNGSelector(selectLoggedInClientAssignment);
  const currentUserIsAuthorOfSession =
    sessionServiceProviderID === loggedInClientAssignment.serviceProviderProfile?.id;
  if (loggedInClientAssignment.isApprover) {
    if (currentUserIsAuthorOfSession) {
      // There should be no such thing as an assistant approver, so we can automatically determine that this is an autonomous provider.
      res = "Service Provider - Autonomous";
    } else {
      res = "Approver";
    }
  } else if (loggedInClientAssignment.isProxyDataEntry) {
    if (currentUserIsAuthorOfSession) {
      if (loggedInClientAssignment.isAutonomous) {
        res = "Service Provider - Autonomous";
      } else {
        res = "Service Provider - Assistant";
      }
    } else {
      // We will assume for now that proxies (data entry clerks) only ever document on behalf of autonomous service providers.
      res = "Service Provider - Autonomous";
    }
  } else if (loggedInClientAssignment.isAutonomous) {
    res = "Service Provider - Autonomous";
  } else {
    res = "Service Provider - Assistant";
  }

  return res as XLogsRoleStrings;
}

export default useDerivedRole;
