import { ClassType } from "../profile-sdk";

// Enum Life Skills = 0
export function getClassTypeStringFromEnum(classType: ClassType): string {
  switch (classType) {
    case ClassType.NUMBER_0:
      return "Life Skills";
    default:
      return "Life Skills";
  }
}

export function getClassTypeEnumFromString(classTypeString: string): ClassType {
  switch (classTypeString) {
    case "Life Skills":
      return ClassType.NUMBER_0;
    default:
      return ClassType.NUMBER_0;
  }
}


