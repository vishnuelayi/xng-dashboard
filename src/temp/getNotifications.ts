import dayjs from "dayjs";
import { INotification, NotificationType } from "../design/high-level/navbar/notification_types";

export async function getNotifications(): Promise<INotification[]> {
  return [
    {
      type: NotificationType.PlainText,
      date: dayjs(),
      unread: true,
      text: "John Smith has denied your access to their account.  You may attempt to request access again at any time.",
    },
    {
      type: NotificationType.AccessRequest,
      date: dayjs().subtract(1, "day"),
      unread: false,
      requester: "Jane Doe (jdoe@schoolisd.net)",
    },
    {
      type: NotificationType.DistrictAccessRequest,
      date: dayjs().subtract(2, "days"),
      unread: true,
      requester: "Jane Doe (jdoe@schoolisd.net)",
    },
  ];
}
