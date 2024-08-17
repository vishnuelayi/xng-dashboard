import { useEffect, useMemo, useState } from "react";
import { NotatorTabStatuses as NotatorTabStatuses } from "./_types";
import { NotatorSection } from "../../../profile-sdk";
import { deriveTabRequirementStatuses } from "./derive_tab_requirement_statuses";

const DEFAULT_REQUIRED: NotatorTabStatuses = {
  accommodations: true,
  activities: true,
  attendance: true,
  goalsObjectives: true,
  modifications: true,
  observations: true,
  sessionTimes: true,
};

export default function useTabRequirementStatuses(
  notatorSections: NotatorSection[] | null,
): NotatorTabStatuses {
  const tabRequirementStatuses = useMemo(() => {
    if (notatorSections === null) return DEFAULT_REQUIRED;
    return deriveTabRequirementStatuses(notatorSections);
  }, [notatorSections]);

  return tabRequirementStatuses;
}
