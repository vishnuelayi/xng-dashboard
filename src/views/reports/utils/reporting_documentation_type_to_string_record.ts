import { DocumentationType } from "@xng/reporting";

/**
 * TECH DEBT: Using a record to map from enum to string. This is unfavored as it created a dependency loop if enums change.
 * The solution is to have API return strings directly instead of enum types from our OpenAPI SDKs.
 */
export const reportingDocumentationTypeToStringRecord: Record<DocumentationType, string> = {
  [DocumentationType.NUMBER_0]: "Paper",
  [DocumentationType.NUMBER_1]: "Import",
  [DocumentationType.NUMBER_2]: "X Logs",
};
