import dayjs from "dayjs";
import {
  DocumentationType,
  Gender as GenderReportingAPI,
  LikelyDuplicateStudent,
} from "@xng/reporting";
import { useV1StudentReportsDuplicateStudentReportsGet } from "../../../../api/hooks/use_v1_student_reports_duplicate_student_reports_get";
import {
  CreatedBy,
  Gender as GenderProfileAPI,
  StudentMergeDisplay,
} from "../../../../profile-sdk";
import { useV1StudentsMergeDisplayBySearchGet } from "../../../../api/hooks/use_v1_students_merge_display_by_search_get";
import { reportingDocumentationTypeToStringRecord } from "../../../reports/utils/reporting_documentation_type_to_string_record";

/**
 * This is the table cell label we use for data that returns null(ish).
 */
const LABEL_UNKNOWN_DATA = "N/A";

/**
 * TECH DEBT: Using a record to map from enum to string. This is unfavored as it created a dependency loop if enums change.
 * The solution is to have API return strings directly instead of enum types from our OpenAPI SDKs.
 */
const reportingAPI_enumToString_gender: Record<GenderReportingAPI, string> = {
  [GenderReportingAPI.NUMBER_0]: "M",
  [GenderReportingAPI.NUMBER_1]: "F",
  [GenderReportingAPI.NUMBER_2]: "Unknown",
};

/**
 * TECH DEBT: Using a record to map from enum to string. This is unfavored as it created a dependency loop if enums change.
 * The solution is to have API return strings directly instead of enum types from our OpenAPI SDKs.
 */
const profileAPI_enumToString_gender: Record<GenderProfileAPI, string> = {
  [GenderProfileAPI.NUMBER_0]: "M",
  [GenderProfileAPI.NUMBER_1]: "F",
  [GenderProfileAPI.NUMBER_2]: "Unknown",
};

/**
 * TECH DEBT: Using a record to map from enum to string. This is unfavored as it created a dependency loop if enums change.
 * The solution is to have API return strings directly instead of enum types from our OpenAPI SDKs.
 */
const profileAPI_enumToString_createdBy: Record<CreatedBy, string> = {
  [CreatedBy.NUMBER_0]: "Manual",
  [CreatedBy.NUMBER_1]: "Import",
};

// ------- EXPORTED API HOOKS -------- //

export function useFetchPotentialsAsRows() {
  const fetchRows = useV1StudentReportsDuplicateStudentReportsGet();

  async function fetchAndMap(): Promise<FrontEndStudentMergeRow[]> {
    const res = await fetchRows(100);
    return mapResultsToRowsForPotentials(res.pageRecords ?? []);
  }

  return fetchAndMap;
}

export function useFetchStudentsAsRows() {
  const fetchStudents = useV1StudentsMergeDisplayBySearchGet();

  async function fetchAndMap(searchValue: string): Promise<FrontEndStudentMergeRow[]> {
    if (searchValue === "") return [];

    const caseloadStudentDisplays = (await fetchStudents(searchValue)).studentMergeDisplays ?? [];
    return mapResultsToRowsForStudentDisplays(caseloadStudentDisplays);
  }

  return fetchAndMap;
}

/// ---------- MAPPERS ---------- ///
// These functions are responsible for translating two distinct back end models into standardized front end rows for the student merge table.

function mapResultsToRowsForPotentials(
  beModels: LikelyDuplicateStudent[],
): FrontEndStudentMergeRow[] {
  const rows: FrontEndStudentMergeRow[] = beModels.map((bem) => {
    const row: FrontEndStudentMergeRow = {
      xlogsID: bem.id ?? LABEL_UNKNOWN_DATA,
      createdBy:
        bem.documentationType !== undefined
          ? reportingDocumentationTypeToStringRecord[bem.documentationType]
          : LABEL_UNKNOWN_DATA,
      birthdate: dayjs(bem.dateOfBirth).format("MM-DD-YYYY"),
      firstName: bem.firstName ?? LABEL_UNKNOWN_DATA,
      lastName: bem.lastName ?? LABEL_UNKNOWN_DATA,
      gender: bem.gender !== undefined ? reportingAPI_enumToString_gender[bem.gender] : "",
      school: bem.schoolName ?? LABEL_UNKNOWN_DATA,
      studentID: bem.studentId ?? LABEL_UNKNOWN_DATA,
    };

    return row;
  });

  return rows;
}

// rename to specify search workflow
function mapResultsToRowsForStudentDisplays(
  backEndModels: StudentMergeDisplay[],
): FrontEndStudentMergeRow[] {
  const rows: FrontEndStudentMergeRow[] = backEndModels.map((bm) => {
    console.log(bm.id);
    const row: FrontEndStudentMergeRow = {
      xlogsID: bm.id ?? LABEL_UNKNOWN_DATA,
      birthdate: dayjs(bm.dateOfBirth).format("MM-DD-YYYY"),
      firstName: bm.firstName ?? LABEL_UNKNOWN_DATA,
      lastName: bm.lastName ?? LABEL_UNKNOWN_DATA,
      createdBy: bm.createdBy
        ? profileAPI_enumToString_createdBy[bm.createdBy]
        : LABEL_UNKNOWN_DATA,
      gender:
        bm.gender !== undefined ? profileAPI_enumToString_gender[bm.gender] : LABEL_UNKNOWN_DATA,
      school: bm.schoolName ?? LABEL_UNKNOWN_DATA,
      studentID: bm.studentId ?? LABEL_UNKNOWN_DATA,
    };

    return row;
  });

  return rows;
}

// ----- Student Merge Row Contract ----- //

export interface FrontEndStudentMergeRow {
  xlogsID: string;
  firstName: string;
  lastName: string;
  studentID: string;
  birthdate: string;
  createdBy: string;
  school: string;
  gender: string;
}
