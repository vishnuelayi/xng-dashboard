type RowMockData = {
  id: string;
  studentName: string;
  DOL: string;
  campus: string;
  service: string;
  oldestUposted: Date;
  unposted: number;
  submitted: number;
  unapproved: number;
  posted: number;
};

const postedSessionsMockData: RowMockData[] = [
  {
    id: "444",
    studentName: "John Doe",
    DOL: "Leader ISD",
    campus: "Campus 1",
    service: "Speech Therapy",
    oldestUposted: new Date("5/01/2022"),
    unposted: 0,
    submitted: 0,
    unapproved: 0,
    posted: 0,
  },
  {
    id: "123",
    studentName: "Jane Smith",
    DOL: "Leader ISD",
    campus: "Campus 2",
    service: "Occupational Therapy",
    oldestUposted: new Date("11/08/2020"),
    unposted: 0,
    submitted: 0,
    unapproved: 0,
    posted: 0,
  },
  {
    id: "321",
    studentName: "Mike Johnson",
    DOL: "Leader ISD",
    campus: "Campus 3",
    service: "Physical Therapy",
    oldestUposted: new Date("10/03/2021"),
    unposted: 0,
    submitted: 0,
    unapproved: 0,
    posted: 0,
  },
  // Add more unique data here
  {
    id: "432",
    studentName: "Sarah Johnson",
    DOL: "Leader ISD",
    campus: "Campus 4",
    service: "Behavioral Therapy",
    oldestUposted: new Date("10/04/2021"),
    unposted: 0,
    submitted: 0,
    unapproved: 0,
    posted: 0,
  },
  {
    id: "566",
    studentName: "Michael Brown",
    DOL: "Leader ISD",
    campus: "Campus 5",
    service: "Speech Therapy",
    oldestUposted: new Date("10/05/2021"),
    unposted: 0,
    submitted: 0,
    unapproved: 0,
    posted: 0,
  },
  {
    id: "789",
    studentName: "Emily Davis",
    DOL: "Leader ISD",
    campus: "Campus 6",
    service: "Occupational Therapy",
    oldestUposted: new Date("10/06/2021"),
    unposted: 0,
    submitted: 0,
    unapproved: 0,
    posted: 0,
  },
  {
    id: "654",
    studentName: "Alex Johnson",
    DOL: "Leader ISD",
    campus: "Campus 7",
    service: "Physical Therapy",
    oldestUposted: new Date("10/07/2021"),
    unposted: 0,
    submitted: 0,
    unapproved: 0,
    posted: 0,
  },
  {
    id: "987",
    studentName: "Olivia Smith",
    DOL: "Leader ISD",
    campus: "Campus 8cccccccccccccc dffffffffff",
    service: "Speech Therapy",
    oldestUposted: new Date("10/08/2021"),
    unposted: 0,
    submitted: 0,
    unapproved: 0,
    posted: 0,
  },
];

export default postedSessionsMockData;
