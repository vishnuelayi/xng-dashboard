import { SessionResponse } from "../session-sdk";
import dayjs from "dayjs";

const getSessionEndDate = (session: SessionResponse) => {
  if (session.meetingDetails?.date && session.meetingDetails?.endTime) {
    const today = dayjs();
    const sessionEndDate = new Date(session.meetingDetails.date);
    sessionEndDate.setHours(new Date(session.meetingDetails.endTime).getHours());
    sessionEndDate.setMinutes(new Date(session.meetingDetails.endTime).getMinutes());
    let hour = sessionEndDate.getHours();
    let minute = sessionEndDate.getMinutes();

    const suffix = hour >= 12 ? "PM" : "AM";
    hour = hour % 12;
    hour = hour ? hour : 12;
    const time = hour + ":" + (String(minute).length > 1 ? minute : "0" + minute) + suffix;

    if (today.isSame(sessionEndDate) || today.isAfter(sessionEndDate)) {
      return { canPost: true, message: `${sessionEndDate.toDateString()} at ${time}` };
    } else {
      return { canPost: false, message: `${sessionEndDate.toDateString()} at ${time}` };
    }

    // return `${sessionEndDate.toDateString()} at ${time}`;

    // const today = dayjs();
    // console.log("SESSION TIME: ", dayjs(editedSession.meetingDetails?.date.toString()));
    // console.log("SESSION TIME No format: ", new Date(editedSession.meetingDetails?.date));
    // console.log("SESSION TIME: ", dayjs(new Date(editedSession.meetingDetails?.date).toDateString() + editedSession.meetingDetails.endTime));
    // console.log("TODAY: ", today);
    // console.log("SESSION END TIME: ", sessionEndDate);
    // console.log("DIFFERENCE: ", today.isSame(sessionEndDate) || today.isAfter(sessionEndDate))
  } else {
    return { canPost: false, message: "After Session date" };
  }
};
export default getSessionEndDate;
