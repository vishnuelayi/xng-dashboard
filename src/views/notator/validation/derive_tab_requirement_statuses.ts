import { NotatorSection, NotatorSectionName } from "../../../profile-sdk";
import { NotatorTabStatuses } from "./_types";

export function deriveTabRequirementStatuses(
  notatorSections: NotatorSection[],
): NotatorTabStatuses {
  const attendance = notatorSections.find((ns) => ns.sectionName === NotatorSectionName.NUMBER_0)
    ?.required!;
  const sessionTimes = notatorSections.find((ns) => ns.sectionName === NotatorSectionName.NUMBER_1)
    ?.required!;
  const activities = notatorSections.find((ns) => ns.sectionName === NotatorSectionName.NUMBER_2)
    ?.required!;
  const accommodations = notatorSections.find(
    (ns) => ns.sectionName === NotatorSectionName.NUMBER_3,
  )?.required!;
  const modifications = notatorSections.find((ns) => ns.sectionName === NotatorSectionName.NUMBER_4)
    ?.required!;
  const goalsObjectives = notatorSections.find(
    (ns) => ns.sectionName === NotatorSectionName.NUMBER_5,
  )?.required!;
  const observations = notatorSections.find((ns) => ns.sectionName === NotatorSectionName.NUMBER_6)
    ?.required!;

  return {
    accommodations,
    activities,
    attendance,
    goalsObjectives,
    modifications,
    observations,
    sessionTimes,
  };
}
