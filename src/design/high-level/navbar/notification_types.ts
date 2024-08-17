import { Dayjs } from "dayjs";

export enum NotificationType {
  AccessRequest,
  PlainText,
  DistrictAccessRequest,
}
export interface INotification {
  type: NotificationType;
  date: Dayjs;
  unread: boolean;
  text?: string;
  requester?: string;
}
