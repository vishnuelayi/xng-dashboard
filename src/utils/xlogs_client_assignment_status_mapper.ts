import { ClientAssignmentStatus } from "../profile-sdk";

export function getClientAssignmentStatusStringFromEnum(
  status: ClientAssignmentStatus | null,
): string {
  switch (status) {
    case ClientAssignmentStatus.NUMBER_0:
      case null:
      return "Active";
    case ClientAssignmentStatus.NUMBER_1:
      return "Inactive";
    default:
      return "Inactive";
  }
}

export function getClientAssignmentStatusEnumFromString(
  statusString: string | null,
): ClientAssignmentStatus {
  switch (statusString) {
    case "Active":
      case null:
      return ClientAssignmentStatus.NUMBER_0;
    case "Inactive":
      return ClientAssignmentStatus.NUMBER_1;
    default:
      return ClientAssignmentStatus.NUMBER_1;
  }
}
