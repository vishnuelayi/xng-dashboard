import { useState, useRef, useEffect, useMemo, createContext } from "react";
import interactionPlugin from "@fullcalendar/interaction";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import { MutableRef } from "preact/hooks";
import dayjs, { Dayjs } from "dayjs";
import weekday from "dayjs/plugin/weekday";
import { getSizing } from "../../design/sizing";
import { RootState, useXNGDispatch, useXNGSelector } from "../../context/store";
import { MWD } from "./types";
import usePalette from "../../hooks/usePalette";
import { placeholderForFutureLogErrorText } from "../../temp/errorText";
import { FullCalendarEvent } from "./calendar_event";
import { SchedulerModal } from "../scheduler/scheduler";
import { PatchSessionSeriesTimeRequest } from "../../session-sdk";
import { API_SERVICEPROVIDERS, API_SESSIONS } from "../../api/api";
import { StudentRef } from "../../profile-sdk";
import { selectStateInUS } from "../../context/slices/stateInUsSlice";
import { selectLoggedInClientAssignment } from "../../context/slices/userProfileSlice";
import { selectClientID } from "../../context/slices/loggedInClientSlice";
import { selectActingServiceProvider } from "../../context/slices/dataEntryProvider";
import { providerNotFoundErrorActions } from "../../context/slices/providerNotFoundErrorSlice";
import { DragAndDropEditSessionSeriesModal } from "./components/drag_and_drop_session_series_modal";
import { DateSelectArg, EventChangeArg, EventContentArg } from "@fullcalendar/core";
import sessionStorageKeys from "../../constants/sessionStorageKeys";
import { getUserTimeZone } from "../../utils/timeZones";
import { ACTION_SetCalendarViewMode } from "../../context/slices/calendarViewModeSlice";
import { Box } from "@mui/material";
import { CalendarHeader, LegacyCalendarHeaderState } from "./calendar_header";
import { useCalendarContext } from "./context/context";
import { useCalendarSourceManager } from "./hooks/use_calendar_source_manager";
import { cookieExists, extractCookieValue } from "../../utils/cookies";
import { useNavigate } from "react-router";
dayjs.extend(weekday);

export const MWDContext = createContext<string>("");

/**
 * Component responsible for rendering the Calendar page, one of the most viewed pages on X Logs. Its codebase
 * is in need of modularization, so for all future developers working on this page feel free to isolate chunks
 * of code into separate modules through the use of hooks, functions, etc. and place them in separate files.
 */
function XLogsCalendar() {
  const navigate = useNavigate();

  // this is needed when logged in as another user so they cant get back to the admin tabs and crash the app before the redux store is re-populated
  useEffect(() => {
    if (cookieExists("requireUserRefresh")) {
      const refresh = extractCookieValue("requireUserRefresh");
      if (refresh === "true") {
        document.cookie = `requireUserRefresh=''; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/xlogs;`;
        document.cookie = `requireUserRefresh=''; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/xlogs/admin;`;
        navigate(0);
      }
    }
  }, []);
  const state = useXNGSelector(selectStateInUS);
  const loggedInClientId = useXNGSelector(selectClientID);
  const userClientAssignment = useXNGSelector(selectLoggedInClientAssignment);
  const actingServiceProvider = useXNGSelector(selectActingServiceProvider);
  const loggedInClientAssignment = useXNGSelector(selectLoggedInClientAssignment);

  /**
   * The user is currently acting as their own service provider, and not a provider in their caseload.
   */
  const userIsSelfDocumenting =
    loggedInClientAssignment.serviceProviderProfile?.id === actingServiceProvider?.id;
  const [serviceProviderIDs, setServiceProviderIDs] = useState<string[]>([]);

  const focusedDateKey = sessionStorageKeys.FOCUSED_DATE_KEY;

  useEffect(() => {
    if (!sessionStorage.getItem(focusedDateKey)) {
      sessionStorage.setItem(focusedDateKey, new Date().toISOString());
    }
  }, [sessionStorage.getItem(focusedDateKey)]);

  useEffect(() => {
    const serviceProviderIds: string[] = [];

    // If the user is acting as one of their data entry providers:
    serviceProviderIDs.push(actingServiceProvider!.id!);

    if (userClientAssignment.isApprover && userIsSelfDocumenting) {
      // Only the approver will ever see sessions for more than one provider at a time.
      const approverCaseloadServiceProviders = userClientAssignment.supervisedServiceProviders;

      // for each appointing provider, add their id to the list of service provider ids.
      approverCaseloadServiceProviders?.forEach((element) => {
        serviceProviderIds.push(element.id?.toString() as string);
      });
    }

    setServiceProviderIDs(serviceProviderIds);
  }, [actingServiceProvider]);

  // -------------- STATES --------------
  // view state

  const calendarViewMode: MWD = useXNGSelector(
    (state: RootState) => state.calendarViewModeSlice.calendarViewMode,
  );

  const [mwd, setMWD] = useState<MWD>(calendarViewMode);
  const [focusedDate, setFocusedDate] = useState<Dayjs>(
    sessionStorage.getItem(focusedDateKey)
      ? dayjs(sessionStorage.getItem(focusedDateKey))
      : dayjs(),
  );

  const [studentCaseload, setStudentCaseload] = useState<StudentRef[]>([]);

  // modals
  const [modal_scheduler, setmodal_scheduler] = useState<boolean>(false);
  const [modal_scheduler_selecteddate, setmodal_scheduler_selecteddate] = useState<Date>();
  const [modal_scheduler_enddate, setmodal_scheduler_enddate] = useState<Date>();

  const [editSeriesModalOpen, setEditSeriesModalOpen] = useState<boolean>(false);
  const [selectedEventArg, setSelectedEventArg] = useState<EventChangeArg | null>(null);
  const dispatch = useXNGDispatch();

  const calendarContext = useCalendarContext();

  useEffect(() => {
    // populate student caseload
    fetchAndSetStudentCaseload();

    async function fetchAndSetStudentCaseload() {
      if (!userClientAssignment.serviceProviderProfile?.id || !loggedInClientId)
        throw new Error(placeholderForFutureLogErrorText);

      try {
        const serviceProviderProfile = await API_SERVICEPROVIDERS.v1ServiceProvidersIdGet(
          actingServiceProvider!.id!,
          loggedInClientId,
          state,
        );

        const res = serviceProviderProfile.studentCaseload;
        if (!res) throw new Error(placeholderForFutureLogErrorText);

        res.sort((a, b) => {
          if (a?.lastName! > b?.lastName!) return 1;
          if (a?.lastName! < b?.lastName!) return -1;
          return 0;
        });

        setStudentCaseload(res);
      } catch (err) {
        dispatch(
          providerNotFoundErrorActions.ACTION_ShowProviderNotFound({
            show: true,
            errorMsg: (err as Error).message,
          }),
        );
      }
    }
  }, [actingServiceProvider]);

  // -------------- STATE LISTENERS (useEffects) --------------

  useEffect(() => {
    fcAPI?.gotoDate(focusedDate.toDate());
  }, [focusedDate]);
  useEffect(() => {
    dispatch(ACTION_SetCalendarViewMode(mwd));
    switch (mwd) {
      case "Month":
        fcAPI?.changeView("dayGridMonth");
        return;
      case "Week":
        fcAPI?.changeView("timeGridWeek");
        return;
      case "Day":
        fcAPI?.changeView("timeGridDay");
        return;
    }
  }, [mwd]);

  // -------------- XNG CALLBACKS --------------
  function handleOpenScheduler(start?: Date, end?: Date) {
    setmodal_scheduler(true);

    const startParameterIsValid = Boolean(start);
    const userClickedFromMonthView = dayjs(end).diff(start, "minutes") === 1440;

    if (startParameterIsValid) {
      if (userClickedFromMonthView) {
        setmodal_scheduler_selecteddate(dayjs(start).add(8, "hours").toDate());
        setmodal_scheduler_enddate(dayjs(start).add(9, "hours").toDate());
      } else {
        setmodal_scheduler_selecteddate(start);
        setmodal_scheduler_enddate(end);
      }
    }
  }

  // -------------- FULL CALENDAR INTERFACE --------------
  const fullCalendarRef: MutableRef<FullCalendar | null> = useRef(null);
  const fcAPI = useMemo(() => {
    if (fullCalendarRef.current) {
      return fullCalendarRef.current.getApi();
    }
  }, [fullCalendarRef.current]);

  const { refreshSessions, eventSourceInput } = useCalendarSourceManager({
    fcAPI,
    refreshConditions: [
      focusedDate,
      ...calendarContext.calendarFilterState.filtersDependencyArraySpreadable,
      serviceProviderIDs,
      studentCaseload,
    ],
  });

  // EVENT HANDLERS
  function handleCellClick(dArg: DateSelectArg) {
    fcAPI?.unselect();
    handleOpenScheduler(dArg.start, dArg.end);
  }

  async function handleFCEventDragOrResize(eventArg: EventChangeArg) {
    const event = eventArg.event;
    if (event.start != null && event.end != null) {
      const start = event.start;
      const end = event.end;
      const sessionId = event._def.extendedProps.id;
      const serviceProviderId = event._def.extendedProps.serviceProvider.id;

      const request: PatchSessionSeriesTimeRequest = {
        newStartTime: start,
        newEndTime: end,
        sessionId: sessionId,
        originalDate: dayjs(event._def.extendedProps.date).toDate(),
        seriesId: event._def.extendedProps.seriesId,
        timezone: getUserTimeZone(),
      };
      await API_SESSIONS.v1SessionsUpdateTimePatch(serviceProviderId, state, request);
      refreshSessions();
    }
  }

  const palette = usePalette();

  // -------------- DOM COMPONENTS & HIERARCHY --------------

  /**
   * In order to modularize the calendar header into its own component and streamline its memoized dependencies, we are going to
   * encapsulate all of its previously dependent state. We will phase this out with time.
   *
   * ### NOTE: This is closed off to any additions! In the instance of needing modifications, consider removing the field from this type.
   *
   * For more information:
   * This is effectively a way to drill down previous dependencies as part of a progressive Calendar refinement. This is not an
   * antipattern considering that it will stay the same. For all developers who need to add new state to the calendar module,
   * do so in other ways: consider passing a state and callback, or perhaps even build the foundation for a new CalendarHeader context.
   */
  const calendarHeaderState: LegacyCalendarHeaderState = {
    focusedDate,
    setFocusedDate,
    setMWD,
  };

  const memoizedHeader = useMemo(
    () => <CalendarHeader legacyState={calendarHeaderState} onCreateClick={handleOpenScheduler} />,
    [calendarHeaderState],
  );

  const memoizedCalendar = useMemo(() => {
    return (
      <Box
        sx={{
          ".fc-header-toolbar": { display: "none" },
          ".fc-day-today": { bgcolor: "transparent!important" },
          height: "100%",
          ".fc-theme-standard": {
            height: "100%",
          },
          // remove white border
          ".fc-timegrid-event-harness-inset .fc-timegrid-event, .fc-timegrid-event.fc-event-mirror, .fc-timegrid-more-link":
            {
              boxShadow: "none",
            },
          ".fc-popover-body": {
            bgcolor: palette.contrasts[5],
          },
          ".fc-timegrid-more-link": {
            height: getSizing(4),
          },
          // remove gray border when hovering
          ".fc-daygrid-dot-event:hover": {
            background: "none",
          },
          ".fc-daygrid-dot-event": { cursor: "default" },
          a: {
            textDecoration: "none",
            color: palette.contrasts[1],
          },
          ".fc .fc-day-today .fc-daygrid-day-number": {
            color: palette.contrasts[5],
            backgroundColor: "#206A7E",
            borderRadius: "99px",
            width: "25px",
            height: "25px",
            flexShrink: 0,
            lineHeight: "18px",
            mt: "1px",
            textAlign: "center",
            mb: "3px",
          },
          ".fc .fc-more-popover .fc-popover-body": {
            width: "20rem",
            maxHeight: "95%",
            overflowY: "auto",
          },
          ".fc .fc-more-popover": {
            transition: "top .5s ease",
            maxHeight: "100%",
            display: "flex",
            flexDirection: "column",
          },
        }}
      >
        <FullCalendar
          // Ref for interfacing
          ref={fullCalendarRef}
          // Event configuration
          eventColor={"transparent"}
          eventBackgroundColor="transparent"
          eventBorderColor="transparent"
          events={eventSourceInput}
          initialDate={focusedDate.toDate()}
          eventContent={(event: EventContentArg) => {
            return <FullCalendarEvent onReloadCalendar={() => refreshSessions()} event={event} />;
          }}
          // Callbacks
          select={(dArg: DateSelectArg) => handleCellClick(dArg)}
          eventChange={(eventArg: EventChangeArg) => {
            if (eventArg.event._def.extendedProps.seriesId) {
              setSelectedEventArg(eventArg);
              setEditSeriesModalOpen(true);
            } else {
              handleFCEventDragOrResize(eventArg);
            }
          }}
          // eventClick={(e) => navigate(ROUTES_XLOGS.notator + "/" + e.event._def.extendedProps.id)}
          // Stock UI Configurations
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          headerToolbar={{
            left: "",
            center: "",
            right: "",
          }}
          initialView={mwd === "Month" ? `dayGrid${mwd}` : `timeGrid${mwd}`}
          selectable={true}
          editable={true}
          dayMaxEvents={true}
          allDaySlot={false}
          nowIndicator={true}
          scrollTime={"7:00"}
          contentHeight={"100%"}
          selectMirror={true}
          slotEventOverlap={false}
          dayMaxEventRows={true}
          slotDuration={"00:15"}
          eventMaxStack={3}
          // Fix day events overflow: Rerender on load
          rerenderDelay={0}
          eventMinHeight={60}
          eventShortHeight={60}
          moreLinkClick={({ allSegs }) => {
            const checkMorePopover = () => {
              // Get the fullcalendar more popover element.
              const popoverEl = document.querySelector(".fc-more-popover") as HTMLDivElement;

              // If popoverEl is null, retrieve it again. We perform this action because we cannot fully customize the fullcalendar more popover.
              if (!popoverEl) {
                setTimeout(() => checkMorePopover());
                return;
              }

              // This is a mutation callback when events are added to the more popover.
              const callback: MutationCallback = (_, observer) => {
                // Get the bounding client rect of the more popover.
                const rect = popoverEl.getBoundingClientRect();

                if (rect.top + rect.height > window.innerHeight) {
                  // If the screen cuts off the more popover, adjust the top style of the more popover.
                  (popoverEl as HTMLDivElement).style.top = `${
                    parseInt((popoverEl as HTMLDivElement).style.top) -
                    (rect.top + rect.height - window.innerHeight) -
                    20
                  }px`;
                }

                if (
                  popoverEl.querySelectorAll(".fc-daygrid-event-harness").length === allSegs.length
                ) {
                  // If all events are added to the more popover, disconnect the observer.
                  observer.disconnect();
                }
              };

              // Create an observer to detect events added to the more popover and start observing.
              const observer = new MutationObserver(callback);
              const config: MutationObserverInit = { childList: true, subtree: true };
              observer.observe(popoverEl, config);
            };

            checkMorePopover();
          }}
        />
      </Box>
    );
  }, [eventSourceInput]);

  // DOM HIERARCHY
  return (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      {modal_scheduler_selecteddate && modal_scheduler_enddate && (
        <SchedulerModal
          onRequestRefreshSessions={() => refreshSessions()}
          open={modal_scheduler}
          startDate={modal_scheduler_selecteddate}
          endDate={modal_scheduler_enddate}
          onClose={() => setmodal_scheduler(false)}
          studentCaseload={studentCaseload}
        />
      )}

      <Box
        sx={{
          paddingX: getSizing(5),
          paddingTop: getSizing(4),
          paddingBottom: getSizing(12),
          height: getSizing(10),
          backgroundColor: palette.primary[1],
        }}
      >
        {memoizedHeader}

        <DragAndDropEditSessionSeriesModal
          open={editSeriesModalOpen}
          calendarEvent={selectedEventArg?.event}
          handleClose={() => setEditSeriesModalOpen(false)}
          refreshSessions={() => refreshSessions()}
          state={state}
          actingServiceProvider={actingServiceProvider!}
          loggedInClientAssignment={loggedInClientAssignment}
        />
      </Box>
      <MWDContext.Provider value={mwd}>{memoizedCalendar}</MWDContext.Provider>
    </Box>
  );
}

export default XLogsCalendar;
