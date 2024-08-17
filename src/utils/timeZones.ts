import dayjs, { Dayjs } from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);
/**
 * Some of these functions are not used but may be helpful in the future.
 * We may also want to adjust some of the functions later,
 * or make a hook for dealing with timezones and daylight savings.
 */

export const timeZones: {
  [key: string]: string;
} = {
  NH: "America/New_York",
  TX: "America/Chicago",
};

export function userAndDistrictTimeZoneMatch(stateInUS: string) {
  const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  return userTimeZone === timeZones[stateInUS];
}

export function timezoneAdjustedStartOrEndTimes(
  state: string,
  type: string,
  startTime: Date | Dayjs,
  endTime: Date | Dayjs,
) {
  let timezoneAdjustedStartTime = startTime;
  let timezoneAdjustedEndTime = endTime;

  const NHAdjusment = type === "data" ? "subtract" : "add";
  const TXAdjusment = type === "data" ? "add" : "subtract";
  if (!userAndDistrictTimeZoneMatch(state)) {
    if (state === "NH") {
      timezoneAdjustedStartTime = dayjs(startTime)[NHAdjusment](1, "hour");
      timezoneAdjustedEndTime = dayjs(endTime)[NHAdjusment](1, "hour");
    }
    if (state === "TX") {
      timezoneAdjustedStartTime = dayjs(startTime)[TXAdjusment](1, "hour");
      timezoneAdjustedEndTime = dayjs(endTime)[TXAdjusment](1, "hour");
    }
    if (type === "data") {
      timezoneAdjustedStartTime = (timezoneAdjustedStartTime as Dayjs).toDate();
      timezoneAdjustedEndTime = (timezoneAdjustedEndTime as Dayjs).toDate();
    }
  }
  return { timezoneAdjustedStartTime, timezoneAdjustedEndTime };
}

// https://stackoverflow.com/questions/73576351/how-do-you-get-the-dst-time-adjustment-from-a-timezone

export function toIso(date: Date, timeZone: string) {
  return new Date(date).toLocaleString("sv", { timeZone }).replace(" ", "T").replace(",", ".");
}

export function isDST(d: Date) {
  let jan = new Date(d.getFullYear(), 0, 1).getTimezoneOffset();
  let jul = new Date(d.getFullYear(), 6, 1).getTimezoneOffset();
  return Math.max(jan, jul) !== d.getTimezoneOffset();
}

export function getUTCOffset(
  year: number,
  month: number,
  day: number,
  hour: number,
  minute: number,
  second: number,
  timeZone: string,
) {
  const date =
    [year, month, day].map((e) => (e + "").padStart(2, "0")).join("-") +
    "T" +
    [hour, minute, second].map((e) => (e + "").padStart(2, "0")).join(":");
  const dt = Date.parse(date + "Z");
  for (let offsetMinutes = -900; offsetMinutes <= 900; offsetMinutes += 15) {
    const test = new Date(dt - offsetMinutes * 60000);
    if (date === toIso(test, timeZone)) {
      return offsetMinutes;
    }
  }
}

export function getDSTDetails(zone: string, year: number) {
  const jan = getUTCOffset(year, 1, 1, 0, 0, 0, zone);
  const jul = getUTCOffset(year, 7, 1, 0, 0, 0, zone);
  if (jan === jul) return { zone, year, standardOffsetMinutes: Math.min(jan!, jul!) };
  return {
    zone,
    year,
    standardOffsetMinutes: Math.min(jan!, jul!),
    dstOffsetMinutes: Math.max(jan!, jul!),
    dstChangeMinutes: Math.abs(jan! - jul!),
  };
}

export function getUserTimeZone() {
  return dayjs.tz.guess();
}

export function getUserTimeZoneByState(state: string) {
  let timezoneId = getUserTimeZone();
  timezoneId = state === "NH" ? timeZones["NH"] : timezoneId; //New Hampshire is in the Eastern Timezone, so we force new hampshire users to use the eastern timezone, texas users will use timezone based on their location
  return timezoneId;
}