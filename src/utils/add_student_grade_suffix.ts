import { Grade } from "../profile-sdk";

export function addStudentGradeSuffix(grade: Grade) {
  switch (grade) {
    case Grade.NUMBER_0:
      return "PreK";
    case Grade.NUMBER_1:
      return "Kindergarten";
    case Grade.NUMBER_2:
      return "1st";
    case Grade.NUMBER_3:
      return "2nd";
    case Grade.NUMBER_4:
      return "3rd";
    case Grade.NUMBER_5:
      return "4th";
    case Grade.NUMBER_6:
      return "5th";
    case Grade.NUMBER_7:
      return "6th";
    case Grade.NUMBER_8:
      return "7th";
    case Grade.NUMBER_9:
      return "8th";
    case Grade.NUMBER_10:
      return "9th";
    case Grade.NUMBER_11:
      return "10th";
    case Grade.NUMBER_12:
      return "11th";
    case Grade.NUMBER_13:
      return "12th";
    case Grade.NUMBER_14:
      return "Other";
  }
}
