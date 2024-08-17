/**
  Once all instances of `NotatorValidationSummaryV1` are phased out, rename V2 to only `NotatorValidationSummary`.
 */
export type ValidatedSessionV2 = ValidatedStudent[];

export type ValidatedStudent = {
  studentIndex: number;
  valid: boolean;
  validatedTabs: NotatorTabStatuses;
};

export type NotatorTabStatuses = {
  attendance: boolean;
  sessionTimes: boolean;
  activities: boolean;
  accommodations: boolean;
  modifications: boolean;
  goalsObjectives: boolean;
  observations: boolean;
};
