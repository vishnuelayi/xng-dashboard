import { DocumentationType } from "../profile-sdk";
import { getDocTypeEnumFromString, getDocTypeStringFromEnum } from "./xlogs_doc_type_mapper";

describe('getDocTypeStringFromEnum', () => {
  it('should return "Paper" when docType is DocumentationType.NUMBER_0', () => {
    expect(getDocTypeStringFromEnum(DocumentationType.NUMBER_0)).toBe("Paper");
  });

  it('should return "Import" when docType is DocumentationType.NUMBER_1', () => {
    expect(getDocTypeStringFromEnum(DocumentationType.NUMBER_1)).toBe("Import");
  });

  it('should return "XLogs" when docType is DocumentationType.NUMBER_2', () => {
    expect(getDocTypeStringFromEnum(DocumentationType.NUMBER_2)).toBe("XLogs");
  });

  it('should return "Paper" when docType is not a valid DocumentationType', () => {
    expect(getDocTypeStringFromEnum(100)).toBe("Paper");
  });
});

describe('getDocTypeEnumFromString', () => {
  it('should return DocumentationType.NUMBER_0 when docTypeString is "Paper"', () => {
    expect(getDocTypeEnumFromString("Paper")).toBe(DocumentationType.NUMBER_0);
  });

  it('should return DocumentationType.NUMBER_1 when docTypeString is "Import"', () => {
    expect(getDocTypeEnumFromString("Import")).toBe(DocumentationType.NUMBER_1);
  });

  it('should return DocumentationType.NUMBER_2 when docTypeString is "XLogs"', () => {
    expect(getDocTypeEnumFromString("XLogs")).toBe(DocumentationType.NUMBER_2);
  });

  it('should return DocumentationType.NUMBER_0 when docTypeString is not a valid string', () => {
    expect(getDocTypeEnumFromString("Invalid")).toBe(DocumentationType.NUMBER_0);
  });
});