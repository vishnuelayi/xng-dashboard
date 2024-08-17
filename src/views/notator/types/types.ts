import * as yup from "yup";
import { Service as ProfileSDKService } from "../../../profile-sdk";

export enum NotatorTab {
  "Attendance",
  "Session Times",
  "Activities",
  "Accommodations",
  "Modifications",
  "Goals/Objectives",
  "Observations",
}

export interface NotatorTabSelection {
  current: NotatorTab;
  previous: NotatorTab;
}

// ---- VIEWPORT BEHAVIOR ----

export type DictGoalObjectiveStateByStudentIndex = {
  [i: number]: boolean[];
};

export interface IViewportBehavior {
  goalObjectiveDropdownStateByStudentIndex: DictGoalObjectiveStateByStudentIndex;
}

export type FutureTabs = {
  section: number;
  include: boolean;
};

const ERROR = "Entry is required";
export const VALIDATION_SCHEMA = yup.object().shape({
  title: yup.string().required(ERROR),
  sessionType: yup.string().required(ERROR),
  dateOccurs: yup.date().required(ERROR),
  startTime: yup.date().required(ERROR),
  endTime: yup.date().required(ERROR),
  minutesDuration: yup
    .number()
    .typeError("Entry is not a number")
    .required(ERROR)
    .min(1, "Duration must be over 0"),
  location: yup.string().required(ERROR),
});

export interface EditSessionMetadataFieldValues {
  // referred to as service type on backend
  service: ProfileSDKService;
  sessionType: "group" | "individual";
  dateOccurs: Date;
  startTime: Date;
  endTime: Date;
  minutesDuration: number;
  location: string;
  locationDescription: string;
  title: string;
}
