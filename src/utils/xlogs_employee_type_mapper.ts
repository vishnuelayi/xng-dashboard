import { EmployeeType } from "../profile-sdk";

// Enum: FullTime = 0, PartTime = 1, Contract = 2, OutOfDistrictEmployee = 3
export function getEmployeeTypeStringFromEnum(employeeType: EmployeeType): string {
  switch (employeeType) {
    case EmployeeType.NUMBER_0:
      return "Full Time";
    case EmployeeType.NUMBER_1:
      return "Part Time";
    case EmployeeType.NUMBER_2:
      return "Contract";
    case EmployeeType.NUMBER_3:
      return "Out of District Employee";
    default:
      return "Full Time";
  }
}
export function getEmployeeTypeEnumFromString(employeeTypeString: string): EmployeeType {
  switch (employeeTypeString) {
    case "Full Time":
      return EmployeeType.NUMBER_0;
    case "Part Time":
      return EmployeeType.NUMBER_1;
    case "Contract":
      return EmployeeType.NUMBER_2;
    case "Out of District Employee":
      return EmployeeType.NUMBER_3;
    default:
      return EmployeeType.NUMBER_0;
  }
}
