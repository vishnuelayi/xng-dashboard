import { XLogsRoleStrings } from "../context/types/xlogsrole";
import { XLogsRole } from "../profile-sdk";
import { ConstructRoleAssignmentsFromXLogsRoleEnumOrString, GetXlogsRoleFromRoleAssignments, GetXlogsRoleOptions, GetXlogsRoleStringFromEnumOrAssignment } from "./xlogs_role_mapper";


describe('ConstructRoleAssignmentsFromXLogsRoleEnumOrString', () => {
  it('should return correct role assignments for "Service Provider - Autonomous"', () => {
    const role = "Service Provider - Autonomous";
    const result = ConstructRoleAssignmentsFromXLogsRoleEnumOrString(role);
    expect(result).toEqual({
      isAutonomous: true,
    });
  });

  it('should return correct role assignments for "Service Provider - Assistant"', () => {
    const role = "Service Provider - Assistant";
    const result = ConstructRoleAssignmentsFromXLogsRoleEnumOrString(role);
    expect(result).toEqual({
      isAutonomous: false,
    });
  });

  it('should return correct role assignments for "Approver"', () => {
    const role = "Approver";
    const result = ConstructRoleAssignmentsFromXLogsRoleEnumOrString(role);
    expect(result).toEqual({
      isApprover: true,
      isAutonomous: true,
    });
  });

  it('should return correct role assignments for "Proxy Data Entry"', () => {
    const role = "Proxy Data Entry";
    const result = ConstructRoleAssignmentsFromXLogsRoleEnumOrString(role);
    expect(result).toEqual({
      isProxyDataEntry: true,
      isAutonomous: true,
    });
  });

  it('should return correct role assignments for "Delegated Admin"', () => {
    const role = "Delegated Admin";
    const result = ConstructRoleAssignmentsFromXLogsRoleEnumOrString(role);
    expect(result).toEqual({
      isDelegatedAdmin: true,
      isAutonomous: true,
      isProxyDataEntry: true,
      isApprover: true,
    });
  });

  it('should return correct role assignments for "Executive Admin"', () => {
    const role = "Executive Admin";
    const result = ConstructRoleAssignmentsFromXLogsRoleEnumOrString(role);
    expect(result).toEqual({
      isExecutiveAdmin: true,
      isAutonomous: true,
      isProxyDataEntry: true,
      isApprover: true,
      isDelegatedAdmin: true,
    });
  });

  it('should return empty role assignments for unknown role', () => {
    const role = "Unknown Role";
    const result = ConstructRoleAssignmentsFromXLogsRoleEnumOrString(role as XLogsRoleStrings);
    expect(result).toEqual({});
  });
});

describe('GetXlogsRoleFromRoleAssignments', () => {
  it('should return XLogsRole.NUMBER_0 for roleAssignments with isExecutiveAdmin true', () => {
    const roleAssignments = {
      isExecutiveAdmin: true,
    };
    const result = GetXlogsRoleFromRoleAssignments(roleAssignments);
    expect(result).toEqual(XLogsRole.NUMBER_0);
  });

  it('should return XLogsRole.NUMBER_1 for roleAssignments with isDelegatedAdmin true', () => {
    const roleAssignments = {
      isDelegatedAdmin: true,
    };
    const result = GetXlogsRoleFromRoleAssignments(roleAssignments);
    expect(result).toEqual(XLogsRole.NUMBER_1);
  });

  it('should return XLogsRole.NUMBER_2 for roleAssignments with isApprover true', () => {
    const roleAssignments = {
      isApprover: true,
    };
    const result = GetXlogsRoleFromRoleAssignments(roleAssignments);
    expect(result).toEqual(XLogsRole.NUMBER_2);
  });

  it('should return XLogsRole.NUMBER_3 for roleAssignments with isProxyDataEntry true', () => {
    const roleAssignments = {
      isProxyDataEntry: true,
    };
    const result = GetXlogsRoleFromRoleAssignments(roleAssignments);
    expect(result).toEqual(XLogsRole.NUMBER_3);
  });

  it('should return XLogsRole.NUMBER_4 for roleAssignments with isAutonomous true', () => {
    const roleAssignments = {
      isAutonomous: true,
    };
    const result = GetXlogsRoleFromRoleAssignments(roleAssignments);
    expect(result).toEqual(XLogsRole.NUMBER_4);
  });

  it('should return XLogsRole.NUMBER_5 for roleAssignments with none of the properties true', () => {
    const roleAssignments = {};
    const result = GetXlogsRoleFromRoleAssignments(roleAssignments);
    expect(result).toEqual(XLogsRole.NUMBER_5);
  });
});

describe('GetXlogsRoleStringFromEnumOrAssignment', () => {
  it('should return "Executive Admin" for XLogsRole.NUMBER_0', () => {
    const role = XLogsRole.NUMBER_0;
    const result = GetXlogsRoleStringFromEnumOrAssignment(role);
    expect(result).toEqual("Executive Admin");
  });

  it('should return "Delegated Admin" for XLogsRole.NUMBER_1', () => {
    const role = XLogsRole.NUMBER_1;
    const result = GetXlogsRoleStringFromEnumOrAssignment(role);
    expect(result).toEqual("Delegated Admin");
  });

  it('should return "Approver" for XLogsRole.NUMBER_2', () => {
    const role = XLogsRole.NUMBER_2;
    const result = GetXlogsRoleStringFromEnumOrAssignment(role);
    expect(result).toEqual("Approver");
  });

  it('should return "Proxy Data Entry" for XLogsRole.NUMBER_3', () => {
    const role = XLogsRole.NUMBER_3;
    const result = GetXlogsRoleStringFromEnumOrAssignment(role);
    expect(result).toEqual("Proxy Data Entry");
  });

  it('should return "Service Provider - Autonomous" for XLogsRole.NUMBER_4', () => {
    const role = XLogsRole.NUMBER_4;
    const result = GetXlogsRoleStringFromEnumOrAssignment(role);
    expect(result).toEqual("Service Provider - Autonomous");
  });

  it('should return "Service Provider - Assistant" for XLogsRole.NUMBER_5', () => {
    const role = XLogsRole.NUMBER_5;
    const result = GetXlogsRoleStringFromEnumOrAssignment(role);
    expect(result).toEqual("Service Provider - Assistant");
  });

  it('should return "Executive Admin" for RoleAssignments with isExecutiveAdmin true', () => {
    const role = {
      isExecutiveAdmin: true,
    };
    const result = GetXlogsRoleStringFromEnumOrAssignment(role);
    expect(result).toEqual("Executive Admin");
  });

  it('should return "Delegated Admin" for RoleAssignments with isDelegatedAdmin true', () => {
    const role = {
      isDelegatedAdmin: true,
    };
    const result = GetXlogsRoleStringFromEnumOrAssignment(role);
    expect(result).toEqual("Delegated Admin");
  });

  it('should return "Approver" for RoleAssignments with isApprover true', () => {
    const role = {
      isApprover: true,
    };
    const result = GetXlogsRoleStringFromEnumOrAssignment(role);
    expect(result).toEqual("Approver");
  });

  it('should return "Proxy Data Entry" for RoleAssignments with isProxyDataEntry true', () => {
    const role = {
      isProxyDataEntry: true,
    };
    const result = GetXlogsRoleStringFromEnumOrAssignment(role);
    expect(result).toEqual("Proxy Data Entry");
  });

  it('should return "Service Provider - Autonomous" for RoleAssignments with isAutonomous true', () => {
    const role = {
      isAutonomous: true,
    };
    const result = GetXlogsRoleStringFromEnumOrAssignment(role);
    expect(result).toEqual("Service Provider - Autonomous");
  });

  it('should return "Service Provider - Assistant" for RoleAssignments with none of the properties true', () => {
    const role = {};
    const result = GetXlogsRoleStringFromEnumOrAssignment(role);
    expect(result).toEqual("Service Provider - Assistant");
  });
});

describe('GetXlogsRoleOptions', () => {
  it('should return an array of role options', () => {
    const result = GetXlogsRoleOptions();
    expect(result).toEqual([
      "Executive Admin",
      "Delegated Admin",
      "Approver",
      "Proxy Data Entry",
      "Service Provider - Autonomous",
      "Service Provider - Assistant",
    ]);
  });

  it('should return an array with 6 elements', () => {
    const result = GetXlogsRoleOptions();
    expect(result.length).toEqual(6);
  });

  it('should return the correct role options in the correct order', () => {
    const result = GetXlogsRoleOptions();
    expect(result[0]).toEqual("Executive Admin");
    expect(result[1]).toEqual("Delegated Admin");
    expect(result[2]).toEqual("Approver");
    expect(result[3]).toEqual("Proxy Data Entry");
    expect(result[4]).toEqual("Service Provider - Autonomous");
    expect(result[5]).toEqual("Service Provider - Assistant");
  });
});







