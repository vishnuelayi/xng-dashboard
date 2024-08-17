import { DocumentationType, Gender, LikelyDuplicateStudent } from "@xng/reporting";

export const ROWS: LikelyDuplicateStudent[] = [
  {
    id: "asd098f7-asdf98dsf0-a079z8vc7",
    firstName: "Lily",
    lastName: "Aldrin",
    studentId: "231654",
    dateOfBirth: new Date("11/01/2014"),
    documentationType: DocumentationType.NUMBER_0,
    schoolName: "American High School",
    gender: Gender.NUMBER_0,
  },
  {
    id: "asd098f7-asdf98dsf0-a079z8vc7",
    firstName: "Lily",
    lastName: "Aldrin",
    studentId: "231654",
    dateOfBirth: new Date("11/01/2014"),
    documentationType: DocumentationType.NUMBER_0,
    schoolName: "American High School",
    gender: Gender.NUMBER_0,
  },
];
