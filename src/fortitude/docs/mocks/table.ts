export interface StudentMergeExampleModel {
  id: string;
  lastNameFirstName: string;
  studentID: number;
  dateOfBirth: Date;
  createdBy: string;
  schoolName: string;
  gender: string;
  studentsAppearInSessions: boolean;
}

export const MOCK_TABLE_ROWS: StudentMergeExampleModel[] = [
  {
    id: "asd098f7-asdf98dsf0-a079z8vc7",
    lastNameFirstName: "Aldrin, Lily",
    studentID: 231654,
    dateOfBirth: new Date("11/01/2014"),
    createdBy: "Imported",
    schoolName: "American High School",
    gender: "F",
    studentsAppearInSessions: true,
  },
  {
    id: "gsdfg234-vbcvxbx3-a079z8vc7",
    lastNameFirstName: "Eriksen, Marshall",
    studentID: 231655,
    dateOfBirth: new Date("05/19/2014"),
    createdBy: "Imported",
    schoolName: "Minnesota Elementary",
    gender: "M",
    studentsAppearInSessions: true,
  },
  {
    id: "asd098f7-hgdsdvb-234dfczx",
    lastNameFirstName: "Mosby, Ted",
    studentID: 231656,
    dateOfBirth: new Date("04/25/2015"),
    createdBy: "Manual",
    schoolName: "New York Middle School",
    gender: "M",
    studentsAppearInSessions: true,
  },
  {
    id: "qwerwqer234-zxcvxcs3-41423134f",
    lastNameFirstName: "Scherbatsky, Robin",
    studentID: 231657,
    dateOfBirth: new Date("07/23/2014"),
    createdBy: "Manual",
    schoolName: "Canadian International School",
    gender: "F",
    studentsAppearInSessions: false,
  },
  {
    id: "123sadf-234234fs-53ggsdf34",
    lastNameFirstName: "Stinson, Barney",
    studentID: 231658,
    dateOfBirth: new Date("12/31/2014"),
    createdBy: "Imported",
    schoolName: "Manhattan Preparatory",
    gender: "M",
    studentsAppearInSessions: true,
  },
  {
    id: "234234234-123123123-a079z8vc7",
    lastNameFirstName: "McConnell, Tracy",
    studentID: 231659,
    dateOfBirth: new Date("09/13/2015"),
    createdBy: "Manual",
    schoolName: "Brooklyn High School",
    gender: "F",
    studentsAppearInSessions: false,
  },
  {
    id: "345sdf345-vcsadfx-345345",
    lastNameFirstName: "Singh, Ranjit",
    studentID: 231660,
    dateOfBirth: new Date("02/02/2014"),
    createdBy: "Imported",
    schoolName: "New York City College",
    gender: "M",
    studentsAppearInSessions: true,
  },
  {
    id: "23232323-vcxcxvwe1-asdhkadsfkh",
    lastNameFirstName: "Winterbottom, Patrice",
    studentID: 231661,
    dateOfBirth: new Date("06/17/2014"),
    createdBy: "Manual",
    schoolName: "Queens Kindergarten",
    gender: "F",
    studentsAppearInSessions: true,
  },
  {
    id: "356456456-asdf98dsf0-2134124d",
    lastNameFirstName: "MacLaren, Carl",
    studentID: 231662,
    dateOfBirth: new Date("03/05/2015"),
    createdBy: "Imported",
    schoolName: "Bronx Science School",
    gender: "M",
    studentsAppearInSessions: true,
  },
];
