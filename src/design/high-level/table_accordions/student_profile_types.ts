import { Dayjs } from "dayjs";
import { BadgeStatus } from "../../low-level/badge_types";

export type StudentProfileRow = {
  studentStatus: BadgeStatus;
  firstName: string;
  lastName: string;
  dob: string;
  grade: number;
  campus: string;
  planOfCare: string;
  studentID: string;
  planOfCareStart: string;
  planOfCareEnd: string;
  progress: number;
};
