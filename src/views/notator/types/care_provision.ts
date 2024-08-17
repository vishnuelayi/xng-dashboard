import {
  ProvidedAccommodation,
  ProvidedActivity,
  ProvidedModification,
} from "../../../session-sdk";

export type CareProvisionMode = "activities" | "accommodations" | "modifications";
export type CareProvision = ProvidedActivity | ProvidedAccommodation | ProvidedModification;

export type OtherStatus = { unsaveable: boolean; userFeedback: string };
export type OtherField = { increments: number; name: string; status: OtherStatus };
