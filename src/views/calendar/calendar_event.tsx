import dayjs from "dayjs";
import weekday from "dayjs/plugin/weekday";
import Box from "../../design/components-dev/BoxExtended";
import { Typography, IconButton, useTheme } from "@mui/material";
import Tooltip, { TooltipProps, tooltipClasses } from "@mui/material/Tooltip";
import XNGNotification from "../../design/low-level/notification";
import { getSizing } from "../../design/sizing";
import { SessionDayViewCard, SessionResponse, StudentRef } from "../../session-sdk";
import { ROUTES_XLOGS } from "../../constants/URLs";
import { useEffect, useState, useContext } from "react";
import { XNGMenuAnchorBox } from "../../design/components-dev/xng_menu";
import { XNGIconRenderer, XNGICONS } from "../../design/icons";
import { placeholderForFutureLogErrorText } from "../../temp/errorText";
import { API_SESSIONS } from "../../api/api";
import { useXNGDispatch, useXNGSelector } from "../../context/store";
import { selectStateInUS } from "../../context/slices/stateInUsSlice";
import usePalette from "../../hooks/usePalette";
import { EventContentArg } from "@fullcalendar/core";
import { EditSessionSeriesModal } from "../scheduler/edit_session_series_modal";
import { MWDContext } from "./calendar";
import { styled } from "@mui/system";
/** @jsxImportSource @emotion/react */
import { DeleteSessionModal } from "../modals/delete_session";
import { Link } from "react-router-dom";
import { getUserTimeZone, timezoneAdjustedStartOrEndTimes } from "../../utils/timeZones";
import { unpostedSessionsActions } from "../../context/slices/unpostedSessionsSlice";
import { SessionEllipsisMenu } from "../../components/session_ellipsis_menu";
import { selectUser } from "../../context/slices/userProfileSlice";
import useNotatorProgressColor from "../../hooks/useNotatorProgressColor";
import { selectServiceProviderProfile } from "../../context/slices/loggedInClientSlice";
dayjs.extend(weekday);

export function FullCalendarEvent(props: { event: EventContentArg; onReloadCalendar: () => void }) {
  const length = dayjs(props.event.event.end).diff(props.event.event.start, "minutes");
  // const session: SessionResponse = props.event.event._def.extendedProps as SessionResponse;
  const session: SessionDayViewCard = props.event.event._def.extendedProps as SessionDayViewCard;
  const tiny = Math.abs(length) <= 30;

  const [ellipseOpen, setEllipseOpen] = useState<boolean>(false);
  const [ellipseAnchorEl, setEllipseAnchorEl] = useState<HTMLElement | null>(null);
  const [showDeleteSession, setDeleteSessionModalOpen] = useState<boolean>(false);
  const [showEditSessionSeries, setEditSessionSeriesModalOpen] = useState<boolean>(false);
  const [sessionResponse, setSessionResponse] = useState<SessionResponse | undefined>(undefined);
  const dispatch = useXNGDispatch();

  const palette = usePalette();
  const theme = useTheme();

  const state = useXNGSelector(selectStateInUS);
  const mwd = useContext(MWDContext);

  const isNonSchoolDay = props.event.event.extendedProps.hasOwnProperty("type");

  // Timezone adjustments
  const { timezoneAdjustedStartTime, timezoneAdjustedEndTime } = timezoneAdjustedStartOrEndTimes(
    state,
    "display",
    session?.startTime!,
    session?.endTime!,
  );

  useEffect(() => {
    if (ellipseOpen) {
      getSession();
    }
  }, [ellipseOpen]);

  async function deleteSession() {
    if (session.id === undefined) throw Error(placeholderForFutureLogErrorText);
    const serviceProviderId = session.serviceProvider?.id;
    const sessionDate = dayjs(session.startTime);
    await API_SESSIONS.v1SessionsDelete(
      serviceProviderId!,
      state,
      session.id,
      session.seriesId,
      sessionDate.toDate(),
    );
    props.onReloadCalendar();
    dispatch(unpostedSessionsActions.triggerRefetchUnpostedSessions());
  }

  async function getSession() {
    if (session.id === undefined) throw Error(placeholderForFutureLogErrorText);
    const serviceProviderId = session.serviceProvider?.id;
    const sessionDate = dayjs(session.startTime);
    const response = await API_SESSIONS.v1SessionsGet(
      serviceProviderId!,
      state,
      session.id,
      session.seriesId,
      sessionDate.toDate(),
      getUserTimeZone(),
    );
    setSessionResponse(response);
  }

  async function deleteMultipleSessions(idsToDelete: string[], datesToDelete: string[]) {
    let deleteRequests = idsToDelete.join(", ");
    let datesDeleteRequests = datesToDelete.join(", ");
    if (session.seriesId === undefined) throw Error(placeholderForFutureLogErrorText);
    const serviceProviderId = session.serviceProvider?.id;
    const seriesId = session.seriesId;
    const deleteResponse = await API_SESSIONS.v1SessionsDeleteManyDeleteDelete(
      serviceProviderId!,
      state,
      deleteRequests,
      datesDeleteRequests,
      seriesId,
    );
    props.onReloadCalendar();
    dispatch(unpostedSessionsActions.triggerRefetchUnpostedSessions());
  }

  async function deleteSeries() {
    if (session.seriesId === undefined) throw Error(placeholderForFutureLogErrorText);
    const serviceProviderId = session.serviceProvider?.id;
    const deleteResponse = await API_SESSIONS.v1SessionsDeleteRecurringSessionDelete(
      session.seriesId,
      serviceProviderId!,
      state,
    );
    props.onReloadCalendar();
    dispatch(unpostedSessionsActions.triggerRefetchUnpostedSessions());
  }

  const StyledLink = styled(Link)(({ theme }) => ({
    textDecoration: "none",
    color: "#4B4B4B",
    height: mwd === "Day" || mwd === "Week" ? "100%" : "unset",
    width: "100%",
  }));

  const StyledTooltip = styled(({ className, color, ...props }: TooltipProps) => (
    <Tooltip {...props} classes={{ popper: className }} />
  ))(({ color }) => ({
    [`& .${tooltipClasses.tooltip}`]: {
      backgroundColor: color,
      color: "black",
    },
    [`& .${tooltipClasses.tooltipArrow}`]: {
      backgroundColor: color,
    },
    [`& .${tooltipClasses.arrow}`]: {
      "&:before": {
        border: `1px solid ${color}`,
      },
      color,
    },
    zIndex: 9999,
  }));

  function StudentIconBadge(props: {
    numberOfStudents: number;
    color: "primary" | "success" | "danger";
  }) {
    return (
      <Box
        sx={{
          display: "flex",
          width: getSizing(2.2),
          height: getSizing(2.2),
          justifyContent: "center",
          alignItems: "center",
          borderRadius: 999,
          bgcolor: palette[props.color][2],
          color: palette.contrasts[5],
        }}
      >
        <Typography variant="body2">{props.numberOfStudents}</Typography>
      </Box>
    );
  }

  function StudentAttendanceIcon(props: {
    title: string;
    studentList: StudentRef[] | undefined;
    color: "primary" | "success" | "danger";
  }) {
    return (
      <StyledTooltip
        color="#D5E2E6F2"
        title={
          <Box
            sx={{
              width: getSizing(40),
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Typography variant="body1">{props.title}</Typography>
            {props.studentList?.map((student, index) => (
              <Typography key={index} variant="body2">
                {student.firstName + " " + student.lastName}
              </Typography>
            ))}
          </Box>
        }
        placement="top-start"
        arrow
        disableInteractive
      >
        <div css={{ display: "flex" }}>
          <XNGIconRenderer size="md" i={<XNGICONS.Person />} />
          <StudentIconBadge numberOfStudents={props.studentList?.length!} color={props.color} />
        </div>
      </StyledTooltip>
    );
  }

  const { palette: muiPalette } = useTheme();
  const { bgcolor: statusColor } = useNotatorProgressColor(session.status ?? "Success");
  const serviceProvider = useXNGSelector(selectServiceProviderProfile);

  return (
    <>
      {/* MODALS */}
      <DeleteSessionModal
        setDeleteSession={setDeleteSessionModalOpen}
        showDeleteSession={showDeleteSession}
        deleteSession={deleteSession}
        deleteMultipleSessions={deleteMultipleSessions}
        deleteSeries={deleteSeries}
        seriesId={session.seriesId}
        providerId={session.serviceProvider?.id}
        state={state}
      />

      <EditSessionSeriesModal
        open={showEditSessionSeries}
        startDate={session.startTime!}
        endDate={session.endTime!}
        onClose={() => setEditSessionSeriesModalOpen(false)}
        onRequestRefreshSessions={() => props.onReloadCalendar()}
        editedSession={sessionResponse}
        studentList={sessionResponse?.studentJournalList?.map(
          (journal) => journal.student as StudentRef,
        )}
      />

      <SessionEllipsisMenu
        open={ellipseOpen}
        anchorEl={ellipseAnchorEl}
        onClose={() => setEllipseOpen(false)}
        onDeleteSessionClick={() => setDeleteSessionModalOpen(true)}
        onEditSessionSeriesClick={() => setEditSessionSeriesModalOpen(true)}
        contentDependencies={{
          sessionIsRecurring: Boolean(session.seriesId),
          isUsersOwnSession: session.serviceProvider?.id! === serviceProvider?.id!,
        }}
      />

      {/* DOM HIERARCHY */}
      <Box
        sx={{
          width: "100%",
          height: tiny ? "max-content" : "100%",
          maxHeight: tiny ? "60px" : "auto",
          overflow: "hidden",
          cursor: "pointer",
          position: "relative",
          display: "flex",
          alignItems: "center",
          flexWrap: "wrap",
          "&:hover": {
            cursor: "auto !important",
          },
          pointerEvents: isNonSchoolDay ? "none" : "auto",
        }}
      >
        <StyledLink
          to={
            ROUTES_XLOGS.notator +
            "/" +
            session.id +
            "?serviceProviderId=" +
            session?.serviceProvider?.id +
            "&seriesId=" +
            session.seriesId +
            "&date=" +
            session.startTime
          }
        >
          <Box
            sx={{
              display: "flex",
              width: mwd === "Day" ? "100%" : getSizing(1000),
              height: "100%",
            }}
          >
            <XNGNotification
              fullHeight
              size="compact"
              useBadge
              status={session.status}
              view={mwd === "Day" ? "day" : undefined}
              nonSchoolDay={isNonSchoolDay}
            >
              <StyledTooltip
                color="#D5E2E6F2"
                title={
                  <Box
                    sx={{
                      width: getSizing(40),
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <Typography variant="body1">{session.title}</Typography>
                    <Typography variant="body2">{session.service?.name}</Typography>
                    <Typography variant="body2">
                      {dayjs(timezoneAdjustedStartTime).format("dddd, MMMM D | h:mm a") +
                        " - " +
                        dayjs(timezoneAdjustedEndTime).format("h:mm a")}
                    </Typography>
                    <Box sx={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
                      <Typography sx={{ marginRight: getSizing(5) }} variant="body2">
                        {length} minutes
                      </Typography>
                    </Box>
                  </Box>
                }
                placement="top-start"
                disableInteractive
                arrow
              >
                <div
                  css={{
                    width: "100%",
                    height: "max-content",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    paddingRight: 20,
                    flexWrap: "wrap",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      mr: 2,
                      justifyContent: "space-between",
                      alignItems: "center",
                      width: "100%",
                      [theme.breakpoints.down("md")]: {
                        flexDirection: mwd === "Day" ? "column" : "row",
                      },
                    }}
                  >
                    <Typography
                      color={palette.contrasts[0]}
                      variant={tiny && mwd === "Day" ? "subtitle1" : "body2"}
                      sx={{
                        display: "flex",
                        width: "100%",
                        textAlign: "left",
                      }}
                    >
                      <Box
                        component="span"
                        sx={{
                          maxWidth: mwd === "Day" ? "unset" : "calc((100vw / 7) - 3.3rem)",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {session.title}
                      </Box>
                      {mwd === "Day" && (
                        <span
                          css={{
                            display: "inline-block",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                            flexGrow: 1,
                            width: "100px",
                            [theme.breakpoints.down("sm")]: {
                              display: "none",
                            },
                          }}
                        >
                          &nbsp;|&nbsp;
                          {dayjs(timezoneAdjustedStartTime).format("h:mm A")}
                          &nbsp;-&nbsp;
                          {dayjs(timezoneAdjustedEndTime).format("h:mm A")}
                          &nbsp;|&nbsp;
                          {session.duration}
                          &nbsp;|&nbsp;
                          {session.service?.name}
                        </span>
                      )}
                    </Typography>
                  </Box>
                  {mwd === "Day" && (
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "flex-end",
                        [theme.breakpoints.down("md")]: {
                          justifyContent: "flex-start",
                          mt: 1,
                        },
                        [theme.breakpoints.down("sm")]: {
                          display: "none",
                        },
                        mt: 0.5,
                        gap: 4,
                      }}
                    >
                      <StudentAttendanceIcon
                        title="Students in Session"
                        studentList={session.totalStudents}
                        color="primary"
                      />
                      <Box
                        sx={{
                          display: "flex",
                          [theme.breakpoints.down("md")]: {
                            display: "none",
                          },
                          gap: 4,
                        }}
                      >
                        <StudentAttendanceIcon
                          title="Present Students"
                          studentList={session.presentStudents}
                          color="success"
                        />
                        <StudentAttendanceIcon
                          title="Absent Students"
                          studentList={session.absentStudents}
                          color="danger"
                        />
                      </Box>
                    </Box>
                  )}
                </div>
              </StyledTooltip>
            </XNGNotification>
          </Box>
        </StyledLink>
        <Box
          sx={{
            position: "absolute",
            right: 0,
            mr: 0.5,
            cursor: "pointer",
          }}
        >
          {session.status !== 4 && session.status !== 5 && !isNonSchoolDay && (
            <XNGMenuAnchorBox
              onClickSetAnchorEl={(el) => setEllipseAnchorEl(el)}
              onClickSetOpen={() => setEllipseOpen(true)}
              sx={{ display: "block" }}
            >
              <IconButton sx={{ width: "1.5rem", height: "1.5rem" }}>
                <XNGIconRenderer
                  color={muiPalette.getContrastText(statusColor)}
                  size="xs"
                  i={<XNGICONS.Ellipse />}
                  down
                />
              </IconButton>
            </XNGMenuAnchorBox>
          )}
        </Box>
      </Box>
    </>
  );
}
