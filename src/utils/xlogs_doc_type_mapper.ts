import { DocumentationType } from "../profile-sdk";

// Enum: Paper = 0, Import = 1, XLogs = 2
export function getDocTypeStringFromEnum(docType: DocumentationType): string {
  switch (docType) {
    case DocumentationType.NUMBER_0:
      return "Paper";
    case DocumentationType.NUMBER_1:
      return "Import";
    case DocumentationType.NUMBER_2:
      return "XLogs";
    default:
      return "Paper";
  }
}
export function getDocTypeEnumFromString(docTypeString: string): DocumentationType {
  switch (docTypeString) {
    case "Paper":
      return DocumentationType.NUMBER_0;
    case "Import":
      return DocumentationType.NUMBER_1;
    case "XLogs":
      return DocumentationType.NUMBER_2;
    default:
      return DocumentationType.NUMBER_0;
  }
}
