import { NotatorTab } from "../types/types";
import { ValidatedSessionV2 } from "../validation/_types";

export type DictTabsByIndex = {
  [i: number]: NotatorTab[];
};

export interface NotatorValidationSummaryV1 {
  validStudentIndexes: number[];
  validTabsByStudentIndex: DictTabsByIndex;
}

export function convertNotatorValidationSummaryV2toV1(
  v2: ValidatedSessionV2,
): NotatorValidationSummaryV1 {
  const validationSummaryInitialized = Array.isArray(v2);
  if (!validationSummaryInitialized) return {} as NotatorValidationSummaryV1;

  const v1: NotatorValidationSummaryV1 = {
    validStudentIndexes: [],
    validTabsByStudentIndex: {},
  };

  v2.forEach((studentValidity) => {
    const { studentIndex, valid, validatedTabs: tabValidities } = studentValidity;

    // Populate validStudentIndexes
    if (valid) {
      v1.validStudentIndexes.push(studentIndex);
    }

    // Populate validTabsByStudentIndex
    const validTabs: NotatorTab[] = [];
    for (const [key, value] of Object.entries(tabValidities)) {
      if (value) {
        validTabs.push(key as unknown as NotatorTab);
      }
    }
    v1.validTabsByStudentIndex[studentIndex] = validTabs;
  });

  return v1;
}
