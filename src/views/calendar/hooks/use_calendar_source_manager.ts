import { CalendarApi, EventSourceInput } from "fullcalendar";
import { useCalendarContext } from "../context/context";
import { useXNGSelector } from "../../../context/store";
import { selectStateInUS } from "../../../context/slices/stateInUsSlice";
import { selectClientID } from "../../../context/slices/loggedInClientSlice";
import { selectDataEntryProvider } from "../../../context/slices/dataEntryProvider";
import { useGetSessionsForUserAsApprover } from "./use_get_sessions_for_user_as_approver";
import { GetDayViewRequest, SessionDayViewCard } from "../../../session-sdk";
import { useEffect, useState } from "react";
import { NonSchoolDay } from "../../../profile-sdk";
import { API_CLIENTS, API_SESSIONS } from "../../../api/api";
import useEffectSkipMount from "../../../hooks/use_effect_after_mount";
import dayjs from "dayjs";
import { getUserTimeZone, timezoneAdjustedStartOrEndTimes } from "../../../utils/timeZones";

export function useCalendarSourceManager(props: { fcAPI?: CalendarApi; refreshConditions: any[] }) {
  const { fcAPI, refreshConditions } = props;

  // Context
  const calendarContext = useCalendarContext();
  const state = useXNGSelector(selectStateInUS);
  const loggedInClientId = useXNGSelector(selectClientID);
  const dataEntryProvider = useXNGSelector(selectDataEntryProvider);
  const userIsSignedInAsDEP = Boolean(dataEntryProvider);
  const getSessionsForUserAsApprover = useGetSessionsForUserAsApprover();

  // States
  const [sessions, setSessions] = useState<SessionDayViewCard[]>([]);
  const [nonSchoolDates, setNonSchoolDates] = useState<NonSchoolDay[]>([]);
  const [eventSourceInput, setEventSourceInput] = useState<EventSourceInput>([]);

  async function refreshNonSchoolDates() {
    const nonSchoolDates = await API_CLIENTS.v1ClientsIdNonSchoolDatesGet(loggedInClientId!, state);
    setNonSchoolDates(nonSchoolDates.nonSchoolDays!);
  }

  // step 1
  useEffectSkipMount(() => {
    refreshSessions(); // runs filter logic, sets sessions
    refreshNonSchoolDates();
  }, [...refreshConditions]);
  // step 2
  useEffect(() => {
    setEventSourceInputWithFiltersApplied();
  }, [sessions]);

  async function refreshSessions() {
    // 1. Build request body
    const requestBody: GetDayViewRequest = {
      startDate: dayjs(fcAPI?.view.activeStart)
        .subtract(1, "month")
        .toDate(),
      endDate: dayjs(fcAPI?.view.activeEnd)
        .add(1, "month")
        .toDate(),
      serviceProviderIds: getServiceProviderIDs(),
      serviceAreaIdFilters: calendarContext.calendarFilterState.selectedServiceAreas.map(
        (serviceArea) => serviceArea.id!,
      ),
      studentIdFilters: calendarContext.calendarFilterState.selectedStudents.map(
        (student) => student.id!,
      ),
      timeZone: getUserTimeZone(),
    };

    // 2. Initialize full selectable option lists for the filter UI
    const sessionsResponse = await API_SESSIONS.v1SessionsGetDayViewPost(state, requestBody);

    calendarContext.calendarFilterState.setFullServiceAreaList(
      sessionsResponse.filterOptions?.serviceAreas!,
    );
    calendarContext.calendarFilterState.setFullStudentList(
      sessionsResponse.filterOptions?.students!,
    );

    const isApprover = calendarContext.calendarFilterState.fullSelectableAssistantList.length > 0;
    if (isApprover) {
      setSessions(getSessionsForUserAsApprover(sessionsResponse.sessions!));
    } else {
      setSessions(sessionsResponse.sessions!);
    }

    // ( - Helpers -)
    function getServiceProviderIDs(): string[] {
      if (userIsSignedInAsDEP) {
        return [dataEntryProvider?.id!];
      } else {
        return calendarContext.calendarFilterState.selectedServiceProviderIDs;
      }
    }
  }

  function setEventSourceInputWithFiltersApplied() {
    function isFilteredByTitle(s: SessionDayViewCard): boolean {
      const a = s.title!.toLowerCase();
      const b = calendarContext.calendarFilterState.sessionName.toLowerCase();

      return a.includes(b);
    }

    const res: EventSourceInput = [];
    sessions.forEach((session) => {
      const shouldDisplay = isFilteredByTitle(session);

      if (shouldDisplay) {
        // Timezone adjustments
        const { timezoneAdjustedStartTime, timezoneAdjustedEndTime } =
          timezoneAdjustedStartOrEndTimes(state, "display", session?.startTime!, session?.endTime!);

        const fullCalendarEvent = {
          start: dayjs(timezoneAdjustedStartTime).toDate(),
          end: dayjs(timezoneAdjustedEndTime).toDate(),
          editable: session.status === 0 || session.status === 1 || session.status === 3,
          // slotEventOverlap:false,
          extendedProps: session,
        };

        res.push(fullCalendarEvent);
      }
    });

    nonSchoolDates.forEach((nonSchoolEvent) => {
      const fullCalendarEvent = {
        start: dayjs(nonSchoolEvent.startTime).toDate(),
        end: dayjs(nonSchoolEvent.endTime).toDate(),
        editable: false,
        extendedProps: nonSchoolEvent,
      };
      res.push(fullCalendarEvent);
    });
    setEventSourceInput(res);
  }

  return { eventSourceInput, refreshSessions };
}
