import { XLogsRoleStrings } from "../context/types/xlogsrole";
import { RoleAssignments, XLogsRole } from "../profile-sdk";

//* Enum: ExecutiveAdmin = 0, DelegatedAdmin = 1, Approver = 2, ProxyDataEntry = 3, ServiceProviderAutonomous = 4, ServiceProviderAssistant = 5

export function ConstructRoleAssignmentsFromXLogsRoleEnumOrString(role: XLogsRoleStrings | XLogsRole): RoleAssignments {

  switch (role) {
    case "Service Provider - Autonomous":
    case XLogsRole.NUMBER_4:
      return {
        isAutonomous: true,
      };
    case "Service Provider - Assistant":
    case XLogsRole.NUMBER_5:
      return {
        isAutonomous: false,
      };
    case "Approver":
    case XLogsRole.NUMBER_2:
      return {
        isApprover: true,
        isAutonomous: true,
      };
    case "Proxy Data Entry":
    case XLogsRole.NUMBER_3:
      return {
        isProxyDataEntry: true,
        isAutonomous: true,
      };
    case "Delegated Admin":
    case XLogsRole.NUMBER_1:
      return {
        isDelegatedAdmin: true,
        isAutonomous: true,
        isProxyDataEntry: true,
        isApprover: true,
      };
    case "Executive Admin":
    case XLogsRole.NUMBER_0:
      return {
        isExecutiveAdmin: true,
        isAutonomous: true,
        isProxyDataEntry: true,
        isApprover: true,
        isDelegatedAdmin: true,
      };
    default:
      return {};
  }
}

export function GetXlogsRoleFromRoleAssignments(roleAssignments: RoleAssignments): XLogsRole {
  if (roleAssignments.isExecutiveAdmin)
    return XLogsRole.NUMBER_0;
  if (roleAssignments.isDelegatedAdmin)
    return XLogsRole.NUMBER_1;
  if (roleAssignments.isApprover)
    return XLogsRole.NUMBER_2;
  if (roleAssignments.isProxyDataEntry)
    return XLogsRole.NUMBER_3;
  if (roleAssignments.isAutonomous)
    return XLogsRole.NUMBER_4;
  else
    return XLogsRole.NUMBER_5;
}

export function GetXlogsRoleEnumFromString(role: string): XLogsRole | undefined {
  const roleRemap: Record<string, XLogsRole> = {
    "Executive Admin": XLogsRole.NUMBER_0,
    "Delegated Admin": XLogsRole.NUMBER_1,
    Approver: XLogsRole.NUMBER_2,
    "Proxy Data Entry": XLogsRole.NUMBER_3,
    "Service Provider - Autonomous": XLogsRole.NUMBER_4,
    "Service Provider - Assistant": XLogsRole.NUMBER_5,
  };

  return roleRemap[role];
}

export function GetXlogsRoleStringFromEnumOrAssignment(role: XLogsRole | RoleAssignments): string | undefined {

  switch (role) {
    case XLogsRole.NUMBER_0:
      return "Executive Admin";
    case XLogsRole.NUMBER_1:
      return "Delegated Admin";
    case XLogsRole.NUMBER_2:
      return "Approver";
    case XLogsRole.NUMBER_3:
      return "Proxy Data Entry";
    case XLogsRole.NUMBER_4:
      return "Service Provider - Autonomous";
    case XLogsRole.NUMBER_5:
      return "Service Provider - Assistant";
  }


  role = role as RoleAssignments;
    if (role.isExecutiveAdmin)
      return "Executive Admin";
    if (role.isDelegatedAdmin)
      return "Delegated Admin";
    if (role.isApprover)
      return "Approver";
    if (role.isProxyDataEntry)
      return "Proxy Data Entry";
    if (role.isAutonomous)
      return "Service Provider - Autonomous";
    else
      return "Service Provider - Assistant";
}



export const GetXlogsRoleOptions = ()=> [
  "Executive Admin",
  "Delegated Admin",
  "Approver",
  "Proxy Data Entry",
  "Service Provider - Autonomous",
  "Service Provider - Assistant",
]
