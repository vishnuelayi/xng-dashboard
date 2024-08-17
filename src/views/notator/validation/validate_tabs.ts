import { StudentJournal } from "../../../session-sdk";
import { NotatorTabStatuses } from "./_types";
import dayjs from "dayjs";

export function validateStudentTabs(sj: StudentJournal): NotatorTabStatuses {
  return {
    accommodations: validateAccommodations(sj),
    activities: validateActivities(sj),
    attendance: validateAttendance(sj),
    goalsObjectives: validateGoalsObjectives(sj),
    modifications: validateModifications(sj),
    observations: validateObservations(sj),
    sessionTimes: validateSessionTimes(sj),
  };
}

// ====================== 🛠 TAB VALIDATOR FUNCTIONS 🛠 ======================

function validateAccommodations(sj: StudentJournal): boolean {
  if (!hasAtLeastOneAccommodationChecked(sj)) return false;
  return true;
}

function validateActivities(sj: StudentJournal): boolean {
  if (!hasAtLeastOneActivityChecked(sj)) return false;
  return true;
}

function validateAttendance(sj: StudentJournal): boolean {
  return true;
}

function validateGoalsObjectives(sj: StudentJournal): boolean {
  // TODO: The code seen below has been the code responsible for validating goals, and
  // has simply been ported over here as part of the notator refactor.
  // We ultimately need to refactor this to separate out its condition checks.

  const valid = sj.careProvisionLedger?.goalProgresssions?.find(
    (goal) =>
      goal.attempts ||
      goal.goalObservation ||
      goal.percentageComplete ||
      (goal.objectiveProgressions !== undefined
        ? goal.objectiveProgressions[0] !== undefined
          ? goal.objectiveProgressions[0].attempts ||
            goal.objectiveProgressions[0].percentageComplete ||
            goal.objectiveProgressions[0].objectiveObservation
          : undefined
        : undefined),
  );

  return Boolean(valid);
}

function validateModifications(sj: StudentJournal): boolean {
  if (!hasAtLeastOneModificationChecked(sj)) return false;
  return true;
}

function validateObservations(sj: StudentJournal): boolean {
  if (studentIsAbsent(sj)) return true;
  if (!hasAtLeastOneObservationChecked(sj)) return false;
  return true;
}

function validateSessionTimes(sj: StudentJournal): boolean {
  if (!isStudentArrivalAfterDeparture(sj)) return false;
  return true;
}

// ====================== 🔍 CONDITION CHECKS 🔍 ======================

function hasAtLeastOneAccommodationChecked(sj: StudentJournal) {
  return sj.careProvisionLedger!.accommodations!.filter((a) => a.increments! > 0).length! > 0;
}

function hasAtLeastOneActivityChecked(sj: StudentJournal) {
  return sj.careProvisionLedger!.activities!.filter((a) => a.increments! > 0).length! > 0;
}

function hasAtLeastOneModificationChecked(sj: StudentJournal) {
  return sj.careProvisionLedger!.modifications!.filter((a) => a.increments! > 0).length! > 0;
}

function hasAtLeastOneObservationChecked(sj: StudentJournal) {
  return sj.observationSection!.observations!.length! > 0;
}

function isStudentArrivalAfterDeparture(sj: StudentJournal) {
  const arrivalTime = dayjs(sj.studentAttendanceRecord?.arrivalTime);
  const departureTime = dayjs(sj.studentAttendanceRecord?.departureTime);

  return departureTime.isAfter(arrivalTime);
}

function studentIsAbsent(sj: StudentJournal) {
  return !sj.studentAttendanceRecord!.present!;
}
