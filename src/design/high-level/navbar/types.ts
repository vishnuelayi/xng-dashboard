import { Dayjs } from "dayjs";
import { NotificationType } from "../../../profile-sdk";

export interface INotification {
  id: string;
  message?: string;
  created?: Date;
  read?: Date;
  partitionKey: string;
  type: NotificationType;
  response: {
    message: string;
  };
  requestingUser: {
    firstName: string;
    lastName: string;
  };
}

// My Profile
export interface User {
  userID: string;
  firstName: string;
  lastName: string;
  email: string;
  campus: string;
}
export interface IMyProfile {
  account: User;
  dataEntryProviders: User[];
}

// Unposted Sessions
export interface IUnpostedSession {
  provider: User;
  campus: string[];
  studentIDs: string[];
  date: Dayjs;
  sessionID: string;
}
