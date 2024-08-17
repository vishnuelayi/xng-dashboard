import { CareProvisionMode } from "../types/care_provision";

export function getCapitalizedSingleCareProvisionString(mode: CareProvisionMode): string {
  switch (mode) {
    case "accommodations":
      return "Accommodation";
    case "modifications":
      return "Modification";
    case "activities":
      return "Activity";
    default:
      throw new Error(
        "Fall-through in switch statement. Has a new care provision been introduced?",
      );
  }
}

export const notatorLanguageConstants = {
  inAGroupSetting: "in a Group setting",
  notInAGroupSetting: "in an Individual setting",
};
