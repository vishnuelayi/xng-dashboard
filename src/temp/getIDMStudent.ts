import dayjs, { Dayjs } from "dayjs";

export function getIDMStudent(): any {
  return {
    studentStatus: "Success",
    firstName: "Jacob",
    lastName: "Jean",
    dob: dayjs(),
    grade: 0,
    studentID: "0",
    campus: "Marine School",
    planOfCare: "IEP",
    planOfCareStart: dayjs(),
    planOfCareEnd: dayjs(),
    progress: 0.5,
  };
}
