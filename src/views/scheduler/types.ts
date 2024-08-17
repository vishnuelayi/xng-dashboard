import * as yup from "yup";
import { Service as ProfileSDKService, StudentRef } from "../../profile-sdk";

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
  // locationDescription: yup.string().required(ERROR),
  studentList: yup.array().min(1, "Must have at least one student in session"),
});

export type SchedulerFieldValueRecurrence =
  | "none"
  | "daily"
  | "weekdays"
  | "weekly on startdate"
  | "monthly on startdate"
  | "custom";

export type EditSessionSeriesFieldValueRecurrence =
  | "daily"
  | "weekdays"
  | "weekly on startdate"
  | "monthly on startdate"
  | "custom";

export type SchedulerFieldValueRecurrenceCustom = {
  repeatEveryIncrement: number;
  repeatEveryDuration: "day" | "week" | "month";
  repeatOn: {
    Sun: boolean;
    Mon: boolean;
    Tue: boolean;
    Wed: boolean;
    Thu: boolean;
    Fri: boolean;
    Sat: boolean;
  };
  ends: { onDate: Date; afterOccurences: number };
};

export interface SchedulerFieldValues {
  // referred to as service type on backend
  service: ProfileSDKService;
  sessionType: "group" | "individual";
  dateOccurs: Date;
  recurrence: SchedulerFieldValueRecurrence;
  recurrenceCustom?: SchedulerFieldValueRecurrenceCustom;
  startTime: Date;
  endTime: Date;
  minutesDuration: number;
  location: string;
  locationDescription: string;
  title: string;
  studentList: StudentRef[];
}
