import { ClassType } from "../profile-sdk";
import { getClassTypeEnumFromString, getClassTypeStringFromEnum } from "./xlogs_class_type_mapper";

describe('getClassTypeStringFromEnum', () => {
  it('should return "Life Skills" when classType is ClassType.NUMBER_0', () => {
    const result = getClassTypeStringFromEnum(ClassType.NUMBER_0);
    expect(result).toBe("Life Skills");
  });

  it('should return "Life Skills" for any other classType', () => {
    const result = getClassTypeStringFromEnum(2);
    expect(result).toBe("Life Skills");
  });
});

describe('getClassTypeEnumFromString', () => {
  it('should return ClassType.NUMBER_0 when classTypeString is "Life Skills"', () => {
    const result = getClassTypeEnumFromString("Life Skills");
    expect(result).toBe(ClassType.NUMBER_0);
  });

  it('should return ClassType.NUMBER_0 for any other classTypeString', () => {
    const result = getClassTypeEnumFromString("Some Other Class Type");
    expect(result).toBe(ClassType.NUMBER_0);
  });
});


