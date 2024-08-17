import { NotatorTabStatuses } from "./_types";

export function validateStudent(
  validatedTabs: NotatorTabStatuses,
  requiredStudentTabs: NotatorTabStatuses,
): boolean {
  // This is where we compare the newly validated tabs to the notator section validation rules.
  // So if one single required student tab isn't valid, we return false.

  if (requiredStudentTabs.attendance && validatedTabs.attendance === false) {
    return false;
  }
  if (requiredStudentTabs.sessionTimes && validatedTabs.sessionTimes === false) {
    return false;
  }
  if (requiredStudentTabs.activities && validatedTabs.activities === false) {
    return false;
  }
  if (requiredStudentTabs.accommodations && validatedTabs.accommodations === false) {
    return false;
  }
  if (requiredStudentTabs.modifications && validatedTabs.modifications === false) {
    return false;
  }
  if (requiredStudentTabs.goalsObjectives && validatedTabs.goalsObjectives === false) {
    return false;
  }
  if (requiredStudentTabs.observations && validatedTabs.observations === false) {
    return false;
  }

  return true;
}
