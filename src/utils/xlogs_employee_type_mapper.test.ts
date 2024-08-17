import { EmployeeType } from '../profile-sdk';
import { getEmployeeTypeEnumFromString, getEmployeeTypeStringFromEnum } from './xlogs_employee_type_mapper';

describe('getEmployeeTypeStringFromEnum', () => {
  it('should return "Full Time" for EmployeeType.NUMBER_0', () => {
    const result = getEmployeeTypeStringFromEnum(EmployeeType.NUMBER_0);
    expect(result).toEqual("Full Time");
  });

  it('should return "Part Time" for EmployeeType.NUMBER_1', () => {
    const result = getEmployeeTypeStringFromEnum(EmployeeType.NUMBER_1);
    expect(result).toEqual("Part Time");
  });

  it('should return "Contract" for EmployeeType.NUMBER_2', () => {
    const result = getEmployeeTypeStringFromEnum(EmployeeType.NUMBER_2);
    expect(result).toEqual("Contract");
  });

  it('should return "Out of District Employee" for EmployeeType.NUMBER_3', () => {
    const result = getEmployeeTypeStringFromEnum(EmployeeType.NUMBER_3);
    expect(result).toEqual("Out of District Employee");
  });

  it('should return "Full Time" for unknown EmployeeType', () => {
    const result = getEmployeeTypeStringFromEnum(100);
    expect(result).toEqual("Full Time");
  });
});


describe('getEmployeeTypeEnumFromString', () => {
  it('should return EmployeeType.NUMBER_0 for "Full Time"', () => {
    const result = getEmployeeTypeEnumFromString("Full Time");
    expect(result).toEqual(EmployeeType.NUMBER_0);
  });

  it('should return EmployeeType.NUMBER_1 for "Part Time"', () => {
    const result = getEmployeeTypeEnumFromString("Part Time");
    expect(result).toEqual(EmployeeType.NUMBER_1);
  });

  it('should return EmployeeType.NUMBER_2 for "Contract"', () => {
    const result = getEmployeeTypeEnumFromString("Contract");
    expect(result).toEqual(EmployeeType.NUMBER_2);
  });

  it('should return EmployeeType.NUMBER_3 for "Out of District Employee"', () => {
    const result = getEmployeeTypeEnumFromString("Out of District Employee");
    expect(result).toEqual(EmployeeType.NUMBER_3);
  });

  it('should return EmployeeType.NUMBER_0 for unknown string', () => {
    const result = getEmployeeTypeEnumFromString("Unknown");
    expect(result).toEqual(EmployeeType.NUMBER_0);
  });
})


