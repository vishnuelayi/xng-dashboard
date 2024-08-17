import { IAssistantFilter } from "../views/calendar/types";
import dayjs from "dayjs";
import { makeid as generateFakeID } from "./getFakeID";
import { SessionStatus } from "../session-sdk";
import { StudentRef } from "../profile-sdk";

const names = [
  "My Support Session",
  "My Clever Session",
  "My Shivering Session",
  "My Loud Session",
  "My Lackadaisical Session",
  "My Hip Session",
];

export function getFakeTempAvatars(): IAssistantFilter[] {
  return [
    { firstName: "Steven", lastName: "Bennett", id: "vashwks" },
    { firstName: "Kelsay", lastName: "Blanco", id: "abcodjn8" },
    { firstName: "Jacob", lastName: "Jean", id: "3joldfas" },
    { firstName: "Paul", lastName: "Stokes", id: "tjk431u9" },
  ];
}

export function getFakeStudentProfiles(): StudentRef[] {
  return [
    getFakeStudentProfile("Steven", "Bennett"),
    getFakeStudentProfile("Kelsay", "Blanco"),
    getFakeStudentProfile("Jacob", "Jean"),
    getFakeStudentProfile("Paul", "Stokes"),
    getFakeStudentProfile("Y'Shua", "Stokes"),
  ];
}

export function getFakeStudentProfile(firstName: string, lastName: string): StudentRef {
  return { firstName, lastName, id: generateFakeID(12) };
}
