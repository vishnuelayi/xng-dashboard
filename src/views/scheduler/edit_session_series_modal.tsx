import dayjs, { Dayjs } from "dayjs";
import {
  Dialog,
  Typography,
  ButtonBase,
  Grid,
  RadioGroup,
  FormControlLabel,
  Radio,
} from "@mui/material";
import { useForm, useWatch } from "react-hook-form";
import Box from "../../design/components-dev/BoxExtended";
import { getSizing } from "../../design/sizing";
import { XNGClockInput as XNGFormClockInput } from "../../design/components-form/clock";
import { XNGFormInput } from "../../design/components-form/textfield";
import { XNGFormSelect } from "../../design/components-form/select";
import XNGButton from "../../design/low-level/button";
import XNGClose from "../../design/low-level/button_close";
import XNGFormDatePicker from "../../design/components-form/datepicker";
import usePalette from "../../hooks/usePalette";
import { useEffect, useState } from "react";
import { XNGSearch } from "../../design/low-level/input_search";
import { XNGICONS, XNGIconRenderer } from "../../design/icons";
import { yupResolver } from "@hookform/resolvers/yup";
import { XNGErrorFeedback } from "../../design/components-form/_error";
import { BORDER_RADIUSES } from "../../design/borderRadiuses";
import {
  Service as ProfileSDKService,
  ServicesByServiceProviderTypeResponse,
  StudentRef,
} from "../../profile-sdk";
import {
  CreateRecurrencePatternRequest,
  CreateRecurringSesssionRequest,
  DayOfWeek,
  GetSessionSeriesResponse,
  Location,
  RecurrenceMode,
  RecurrencePattern,
  Service as SessionSDKService,
} from "../../session-sdk";
import { CreateSessionRequest, EditSessionSeriesRequest, SessionResponse } from "../../session-sdk";
import { API_SESSIONS, API_STATESNAPSHOTS, API_SERVICEPROVIDERS } from "../../api/api";
import { useXNGSelector, useXNGDispatch } from "../../context/store";
import { selectStateInUS } from "../../context/slices/stateInUsSlice";
import { selectLoggedInClientAssignment, selectUser } from "../../context/slices/userProfileSlice";
import { placeholderForFutureLogErrorText } from "../../temp/errorText";
import { selectStudents } from "../../context/slices/studentsSlice";
import {
  selectClientID,
  selectServiceProviderProfile,
} from "../../context/slices/loggedInClientSlice";
import {
  SchedulerFieldValueRecurrence,
  SchedulerFieldValues,
  EditSessionSeriesFieldValueRecurrence,
  VALIDATION_SCHEMA,
} from "./types";
import {
  selectActingServiceProvider,
  selectActingServiceProviderType,
  selectDataEntryProvider,
} from "../../context/slices/dataEntryProvider";
import { providerNotFoundErrorActions } from "../../context/slices/providerNotFoundErrorSlice";
import sessionStorageKeys from "../../constants/sessionStorageKeys";
import { useLocation } from "react-router-dom";
import XNGCheckbox from "../../design/low-level/checkbox";
import { timezoneAdjustedStartOrEndTimes } from "../../utils/timeZones";
import { getUserTimeZone } from "../../utils/timeZones";

export interface IEditSessionSeriesModal {
  open: boolean;
  startDate: Date;
  endDate: Date;
  onClose: () => void;
  onRequestRefreshSessions?: () => void;
  editedSession?: SessionResponse;
  studentList?: StudentRef[];
}
export function EditSessionSeriesModal(props: IEditSessionSeriesModal) {
  // REDUX SELECTORS
  const userStateInUS = useXNGSelector(selectStateInUS);
  const user = useXNGSelector(selectUser);
  const loggedInClientAssignment = useXNGSelector(selectLoggedInClientAssignment);
  const loggedInClientId = useXNGSelector(selectClientID);
  const actingServiceProvider = useXNGSelector(selectActingServiceProvider);
  const actingServiceProviderType = useXNGSelector(selectActingServiceProviderType);
  // LOCAL STATES
  const [modalOpen_CustomRecurrenceModal, setModalOpen_CustomRecurrenceModal] =
    useState<boolean>(false);
  const [modalNeverOpened, setModalNeverOpened] = useState<boolean>(true);
  const [session, setSession] = useState<SessionResponse>({} as SessionResponse);
  const [studentCaseload, setStudentCaseload] = useState<StudentRef[]>([]);
  const [existingSessionRecurrencePattern, setExistingSessionRecurrencePattern] =
    useState<GetSessionSeriesResponse>({} as GetSessionSeriesResponse);
  const [dataLoaded, setDataLoaded] = useState<boolean>(false);

  const focusedDateKey = sessionStorageKeys.FOCUSED_DATE_KEY;
  const location = useLocation();
  const path = location.pathname.split("/")[1];
  const dispatch = useXNGDispatch();

  // REACT HOOK FORM
  const {
    handleSubmit,
    control,
    register,
    formState: { errors },
    watch,
    setValue,
    reset,
  } = useForm<SchedulerFieldValues>({ resolver: yupResolver(VALIDATION_SCHEMA) });

  // INITIAL VALUES
  const { timezoneAdjustedStartTime: START, timezoneAdjustedEndTime: END } =
    timezoneAdjustedStartOrEndTimes(
      userStateInUS,
      "display",
      dayjs(props.startDate),
      dayjs(props.endDate),
    );

  const DEFAULT_RECURRING_DATE: Dayjs = dayjs(null);

  // STYLE CONSTANTS
  const ROW_SX = {};
  const GAP = getSizing(2);

  // --------------- USEEFFECTS / API ---------------
  // SET DEFAULTS ON OPEN / CLOSE, CASELOAD CHANGE
  useEffect(() => {
    //reset();
    if (props.open) {
      //fetchAndSetSession(props.sessionId, props.seriesId, props.startDate);
      fetchAndSetStudentCaseload();
      fetchAndSetRecurrencePattern(props.editedSession?.seriesId);
      if (!location.pathname.includes("notator")) {
        sessionStorage.setItem(focusedDateKey, START.toISOString());
      }
    }

    const tempStudentList = props.editedSession?.studentJournalList?.map(
      (journal) => journal.student as StudentRef,
    );
    setValue("studentList", props.studentList || new Array<StudentRef>());
    setValue("minutesDuration", (END as Dayjs).diff(START, "minutes"));
    setSession(props.editedSession || ({} as SessionResponse));

    setDataLoaded(true);
  }, [props.open]);
  const studentList = useWatch({ control, name: "studentList" }) || [];
  // Set services based on user's date selection

  useEffect(() => {
    if (props.open) {
      fetchAndSetServices();
    }
  }, [props.open]);
  async function fetchAndSetServices() {
    const useThisDateForNow: Date = dayjs().toDate();

    const servicesByServiceProviderTypeResponse: ServicesByServiceProviderTypeResponse =
      await API_STATESNAPSHOTS.v1StateSnapshotsByDateServicesByServiceProviderTypeGet(
        userStateInUS,
        useThisDateForNow,
        actingServiceProviderType?.id,
      );

    if (servicesByServiceProviderTypeResponse.services) {
      setDbInfo_Services(servicesByServiceProviderTypeResponse.services);
    } else {
      throw new Error(placeholderForFutureLogErrorText);
    }
  }

  // --------------- CUSTOM STATES FOR CUSTOM FORM ---------------
  const [dayofWeekSelection, setDayOfWeekSelection] = useState([
    false,
    false,
    false,
    false,
    false,
    false,
    false,
  ]);
  const [customRecurrenceRepeat, setCustomRecurrenceRepeat] = useState<number | null>(null);
  const [radio_onafter, setradio_onafter] = useState<"on" | "after">("on");
  const [includeNonSchoolDays, setIncludeNonSchoolDays] = useState(false);

  // --------------- STATE  OdbDATABASE INFO ---------------
  const [dbInfo_Services, setDbInfo_Services] = useState<ProfileSDKService[]>([]);

  const handleDateCheckBoxChange = (index: number) => {
    const updatedSelection = [...dayofWeekSelection];
    //updatedSelection.splice(index, 1, !dayofWeekSelection[index]);
    updatedSelection[index] = !updatedSelection[index];
    setDayOfWeekSelection(updatedSelection);
  };

  // ---- DATABASE / API ----

  async function fetchAndSetRecurrencePattern(seriesID: string | undefined) {
    const serviceProviderId = actingServiceProvider?.id;
    if (!serviceProviderId) throw new Error(placeholderForFutureLogErrorText);
    const recurrenceResponse = await API_SESSIONS.v1SessionsSeriesSessionSeriesIdGet(
      serviceProviderId,
      seriesID!,
      userStateInUS,
    );

    setExistingSessionRecurrencePattern(recurrenceResponse);

    setradio_onafter(recurrenceResponse.recurrencePattern?.endDate ? "on" : "after");

    setDayOfWeekSelection([
      recurrenceResponse.recurrencePattern?.includedDaysOfWeek?.includes(DayOfWeek.NUMBER_0)
        ? true
        : false,
      recurrenceResponse.recurrencePattern?.includedDaysOfWeek?.includes(DayOfWeek.NUMBER_1)
        ? true
        : false,
      recurrenceResponse.recurrencePattern?.includedDaysOfWeek?.includes(DayOfWeek.NUMBER_2)
        ? true
        : false,
      recurrenceResponse.recurrencePattern?.includedDaysOfWeek?.includes(DayOfWeek.NUMBER_3)
        ? true
        : false,
      recurrenceResponse.recurrencePattern?.includedDaysOfWeek?.includes(DayOfWeek.NUMBER_4)
        ? true
        : false,
      recurrenceResponse.recurrencePattern?.includedDaysOfWeek?.includes(DayOfWeek.NUMBER_5)
        ? true
        : false,
      recurrenceResponse.recurrencePattern?.includedDaysOfWeek?.includes(DayOfWeek.NUMBER_6)
        ? true
        : false,
    ]);
    setIncludeNonSchoolDays(recurrenceResponse.recurrencePattern?.includeNonSchoolDay!);
  }

  async function fetchAndSetStudentCaseload() {
    if (!loggedInClientAssignment.serviceProviderProfile?.id || !loggedInClientId)
      throw new Error(placeholderForFutureLogErrorText);

    try {
      const serviceProviderProfile = await API_SERVICEPROVIDERS.v1ServiceProvidersIdGet(
        actingServiceProvider!.id!,
        loggedInClientId,
        userStateInUS,
      );

      const res = serviceProviderProfile.studentCaseload;
      if (!res) throw new Error(placeholderForFutureLogErrorText);
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

  // --------------- ONSUBMIT ---------------
  const onSubmit = (data: SchedulerFieldValues) => {
    editSessionSeries();
    props.onClose();

    async function editSessionSeries() {
      // date occurs does not actually create the session. TODO: REFACTOR this form to use starttime and endttime as the single source only.

      // Timezone adjustments
      const { timezoneAdjustedStartTime, timezoneAdjustedEndTime } =
        timezoneAdjustedStartOrEndTimes(userStateInUS, "data", data.startTime, data.endTime);

      const createSessionRequest: CreateSessionRequest = {
        title: data.title,
        service: {
          id: data.service.id,
          name: data.service.name,
          description: data.service.description,
          area: data.service.area,
          type: data.service.serviceType,
        }, //hdata.service as SessionSDKService, // Cast as because difference in fields, one field is a later feature
        groupSetting: data.sessionType === "group",
        meetingDetails: {
          date: dayjs(data.startTime).startOf("day").toDate(),
          startTime: timezoneAdjustedStartTime as Date,
          endTime: timezoneAdjustedEndTime as Date,
          location: { name: data.location, description: data.locationDescription } as Location, // Todo: ID later
        },
        serviceProvider: actingServiceProvider,
        studentIds: data.studentList.map((s) => {
          if (s.id) {
            return s.id;
          } else {
            throw new Error(placeholderForFutureLogErrorText);
          }
        }),
        client: {
          id: loggedInClientAssignment.client?.id,
          name: loggedInClientAssignment.client?.name,
        },
      };

      let componentRecurrencePattern: CreateRecurrencePatternRequest = {};
      const fiveMonthsFromTodayDate: string = dayjs(Date()).add(5, "month").format("YYYY-MM-DD");
      const includedDays: DayOfWeek[] = [
        DayOfWeek.NUMBER_0,
        DayOfWeek.NUMBER_1,
        DayOfWeek.NUMBER_2,
        DayOfWeek.NUMBER_3,
        DayOfWeek.NUMBER_4,
        DayOfWeek.NUMBER_5,
        DayOfWeek.NUMBER_6,
      ].filter((day, index) => dayofWeekSelection[index]);
      const startingDayOfWeek = data.dateOccurs.getDay();

      let recurrenceEndDate = undefined;
      let numberOfOccurrences = undefined;

      if (radio_onafter === "on") {
        const editDate =
          data.recurrenceCustom?.ends.onDate ??
          existingSessionRecurrencePattern.recurrencePattern?.endDate;
        recurrenceEndDate = dayjs(editDate).format("YYYY-MM-DD");
      } else {
        numberOfOccurrences =
          data.recurrenceCustom?.ends.afterOccurences ??
          existingSessionRecurrencePattern.recurrencePattern?.endNumberOfOccurrences;
      }

      componentRecurrencePattern = {
        //TODO: We'll need to decide how long to run these for.
        endDate: recurrenceEndDate,
        endNumberOfOccurrences: numberOfOccurrences,
        includedDaysOfWeek: includedDays,
        mode: existingSessionRecurrencePattern.recurrencePattern?.mode, // weekly
        interval:
          data.recurrenceCustom?.repeatEveryIncrement ??
          existingSessionRecurrencePattern.recurrencePattern?.interval,
        includeNonSchoolDay: includeNonSchoolDays,
      };

      const editRecurringSessionRequest: EditSessionSeriesRequest = {
        seriesId: props.editedSession?.seriesId || session.seriesId,
        recurrencePattern: modalNeverOpened
          ? existingSessionRecurrencePattern.recurrencePattern
          : componentRecurrencePattern,
        session: createSessionRequest,
        timezone: getUserTimeZone(),
      };

      await API_SESSIONS.v1SessionsEditSessionSeriesPost(
        editRecurringSessionRequest,
        userStateInUS,
      );

      // refresh sessions
      if (props.onRequestRefreshSessions) {
        props.onRequestRefreshSessions();
      }
    }
  };

  const defaultRecurrencePattern = (recurrencePattern: RecurrencePattern | undefined) => {
    if (!recurrencePattern) return "weekdays";
    return "custom";
  };

  const handleToggle = () => {
    let value = false;
    if (
      includeNonSchoolDays !=
      existingSessionRecurrencePattern.recurrencePattern?.includeNonSchoolDay
    ) {
      value = includeNonSchoolDays;
    } else {
      value = existingSessionRecurrencePattern.recurrencePattern.includeNonSchoolDay;
    }

    setIncludeNonSchoolDays(!value);
  };
  const getDefaultEndOnDate = (recurrencePattern: RecurrencePattern | undefined) => {
    if (!recurrencePattern) return DEFAULT_RECURRING_DATE;
    const { endDate } = recurrencePattern;

    if (endDate) return dayjs(endDate);
    return DEFAULT_RECURRING_DATE;
  };

  const getDefaultServiceValue = (session: SessionResponse) => {
    if (!session.service) return dbInfo_Services[0];
    return dbInfo_Services.find((service) => service.id === session.service?.id);
  };

  const getDefaultGroupValue = (session: SessionResponse) => {
    if (session?.groupSetting) return "group";
    return "individual";
  };
  const goodToRender = () => {
    return dataLoaded && dbInfo_Services.length !== 0;
    //&& existingSessionRecurrencePattern.recurrencePattern;
  };

  const handleCustomRecurrenceModalClose = () => {
    setModalOpen_CustomRecurrenceModal(false);
    setModalNeverOpened(false);
  };

  return (
    <>
      {goodToRender() ? (
        <>
          <Dialog open={modalOpen_CustomRecurrenceModal} onClose={handleCustomRecurrenceModalClose}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                padding: getSizing(5),
                gap: getSizing(1),
              }}
            >
              <Typography variant="h6">Custom Recurrence</Typography>
              <Box sx={{ display: "flex", gap: getSizing(1) }}>
                <Typography variant="body1">Repeat every </Typography>
                {/* todo with paul */}
                <XNGFormInput
                  register={register}
                  name="recurrenceCustom.repeatEveryIncrement"
                  label=""
                  control={control}
                  value={existingSessionRecurrencePattern.recurrencePattern?.interval}
                />
                <XNGFormSelect
                  name="recurrenceCustom.repeatEveryDuration"
                  label=""
                  control={control}
                  items={["week"]} // TODO: Add "day" and "month" options back once the backend is capable.
                  watch={watch}
                  setValue={setValue}
                  getOptionLabel={(i) => {
                    // capitalize and add plural
                    return i.charAt(0).toUpperCase() + i.substring(1) + "(s)";
                  }}
                />
              </Box>
              <Box sx={{ display: "flex:", flexDirection: "column" }}>
                <Typography variant="body1">Repeat on: </Typography>
                <Box sx={{ display: "flex", gap: getSizing(0.5), justifyContent: "space-evenly" }}>
                  <DayClicker
                    selected={dayofWeekSelection[0]}
                    onClick={() => handleDateCheckBoxChange(0)}
                  >
                    S
                  </DayClicker>
                  <DayClicker
                    selected={dayofWeekSelection[1]}
                    onClick={() => handleDateCheckBoxChange(1)}
                  >
                    M
                  </DayClicker>
                  <DayClicker
                    selected={dayofWeekSelection[2]}
                    onClick={() => handleDateCheckBoxChange(2)}
                  >
                    T
                  </DayClicker>
                  <DayClicker
                    selected={dayofWeekSelection[3]}
                    onClick={() => handleDateCheckBoxChange(3)}
                  >
                    W
                  </DayClicker>
                  <DayClicker
                    selected={dayofWeekSelection[4]}
                    onClick={() => handleDateCheckBoxChange(4)}
                  >
                    T
                  </DayClicker>
                  <DayClicker
                    selected={dayofWeekSelection[5]}
                    onClick={() => handleDateCheckBoxChange(5)}
                  >
                    F
                  </DayClicker>
                  <DayClicker
                    selected={dayofWeekSelection[6]}
                    onClick={() => handleDateCheckBoxChange(6)}
                  >
                    S
                  </DayClicker>
                </Box>
              </Box>
              <Box sx={{ display: "flex", flexDirection: "column", paddingTop: getSizing(1) }}>
                <Typography variant="body1">Ends: </Typography>

                <RadioGroup
                  aria-labelledby="demo-controlled-radio-buttons-group"
                  name="controlled-radio-buttons-group"
                  value={radio_onafter}
                  onChange={(e) => setradio_onafter(e.target.value as "on" | "after")}
                >
                  <Box sx={{ display: "flex" }}>
                    <FormControlLabel
                      sx={{ width: getSizing(12) }}
                      value="on"
                      control={<Radio />}
                      label="On"
                    />
                    <XNGFormDatePicker
                      name="recurrenceCustom.ends.onDate"
                      label=""
                      control={control}
                      defaultValue={getDefaultEndOnDate(
                        existingSessionRecurrencePattern.recurrencePattern,
                      )}
                      disabled={radio_onafter !== "on"}
                    />
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <FormControlLabel
                      sx={{ width: getSizing(12) }}
                      value="after"
                      control={<Radio />}
                      label="After"
                    />
                    <XNGFormInput
                      register={register}
                      name="recurrenceCustom.ends.afterOccurences"
                      label=""
                      control={control}
                      disabled={radio_onafter !== "after"}
                      value={
                        existingSessionRecurrencePattern.recurrencePattern?.endNumberOfOccurrences
                      }
                    />
                    <Typography
                      className="noselect"
                      sx={{ marginLeft: getSizing(1) }}
                      variant="body1"
                    >
                      Occurrences
                    </Typography>
                  </Box>
                </RadioGroup>

                <Box sx={{ display: "flex", alignItems: "center", gap: getSizing(1) }}>
                  <XNGCheckbox
                    checked={includeNonSchoolDays}
                    onToggle={() => {
                      setIncludeNonSchoolDays(!includeNonSchoolDays);
                    }}
                  />
                  <Typography variant="body1">Include Non-School Days </Typography>
                </Box>
              </Box>
              <Box sx={{ display: "flex", justifyContent: "flex-end", paddingTop: getSizing(2) }}>
                <XNGButton
                  onClick={handleCustomRecurrenceModalClose}
                  sx={{ paddingX: getSizing(2) }}
                >
                  Done
                </XNGButton>
              </Box>
            </Box>
          </Dialog>
          <Dialog open={props.open} onClose={() => props.onClose()} fullWidth maxWidth={"sm"}>
            <Box
              component="form"
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: getSizing(2),
                width: "100%",
                padding: getSizing(2),
              }}
            >
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography variant="h6">Edit Session Series</Typography>
                <XNGClose onClick={() => props.onClose()} size="modal" />
              </Box>
              <Grid container spacing={GAP}>
                <Grid item xs={12}>
                  <XNGFormInput
                    register={register}
                    name="title"
                    label="Title"
                    control={control}
                    value={watch("title") || session.title!}
                    onAfterChange={(e) => {
                      setValue("title", e.target.value);
                    }}
                  />
                  <XNGErrorFeedback error={errors.title?.message} />
                </Grid>
              </Grid>
              <Grid container spacing={GAP}>
                <Grid item xs={6}>
                  <XNGFormSelect
                    watch={watch}
                    defaultValue={getDefaultServiceValue(session)}
                    control={control}
                    name="service"
                    items={dbInfo_Services}
                    getOptionLabel={(i) => i?.name ?? "Error"}
                    label="Service"
                    setValue={setValue}
                  />
                  <XNGErrorFeedback error={errors.service?.message} />
                </Grid>
                <Grid item xs={6}>
                  <XNGFormSelect<SchedulerFieldValues, "group" | "individual">
                    watch={watch}
                    defaultValue={getDefaultGroupValue(session)}
                    control={control}
                    name="sessionType"
                    items={["group", "individual"]}
                    getOptionLabel={(i) => i.charAt(0).toLocaleUpperCase() + i.substring(1)}
                    label="Session Type"
                    setValue={setValue}
                  />
                  <XNGErrorFeedback error={errors.sessionType?.message} />
                </Grid>
              </Grid>
              <Grid container spacing={GAP}>
                <Grid item xs={6}>
                  <XNGFormDatePicker
                    defaultValue={START}
                    control={control}
                    name="dateOccurs"
                    label="Date"
                    watch={watch}
                    onAfterChange={(e: Dayjs | null) => {
                      const day = e!.get("date");
                      const month = e!.get("month");
                      const year = e!.get("year");
                      setValue("dateOccurs", e as unknown as Date);
                      setValue(
                        "startTime",
                        dayjs(watch("startTime")).date(day).month(month).year(year).toDate(),
                      );
                      setValue(
                        "endTime",
                        dayjs(watch("endTime")).date(day).month(month).year(year).toDate(),
                      );
                    }}
                  />
                  <XNGErrorFeedback error={errors.dateOccurs?.message} />
                </Grid>
                <Grid item xs={6} sx={{ display: "flex" }}>
                  <XNGFormSelect<SchedulerFieldValues, EditSessionSeriesFieldValueRecurrence>
                    watch={watch}
                    control={control}
                    name="recurrence"
                    defaultValue={defaultRecurrencePattern(
                      existingSessionRecurrencePattern?.recurrencePattern,
                    )}
                    items={[
                      "weekdays",
                      "weekly on startdate",
                      "daily",
                      // "monthly on startdate",  //TODO: Add this back when backend is capable.
                      "custom",
                    ]}
                    getOptionLabel={(i: EditSessionSeriesFieldValueRecurrence) => {
                      switch (i) {
                        case "daily":
                          return "Daily";
                        case "weekdays":
                          return "Every Weekday (Monday to Friday)";
                        case "weekly on startdate":
                          return `Weekly on ${dayjs(
                            existingSessionRecurrencePattern.recurrencePattern?.startDate ||
                              props.startDate,
                          ).format("dddd")}`;
                        case "monthly on startdate":
                          return `Monthly on day ${dayjs(
                            existingSessionRecurrencePattern.recurrencePattern?.startDate ||
                              props.startDate,
                          ).format("d")}`;
                        case "custom":
                          return "Custom";
                      }
                    }}
                    getOptionCallback={(i: SchedulerFieldValueRecurrence) => {
                      //setDayOfWeekSelection([false, false, false, false, false, false, false])
                      setCustomRecurrenceRepeat(null);
                      switch (i) {
                        case "daily":
                          setDayOfWeekSelection([true, true, true, true, true, true, true]);
                          setCustomRecurrenceRepeat(1);
                          break;
                        case "weekdays":
                          setDayOfWeekSelection([false, true, true, true, true, true, false]);
                          setCustomRecurrenceRepeat(1);
                          break;
                        case "weekly on startdate":
                          setCustomRecurrenceRepeat(1);
                          let test = dayjs(
                            existingSessionRecurrencePattern.recurrencePattern?.startDate ||
                              props.startDate,
                          ).day();
                          switch (test) {
                            case 0:
                              setDayOfWeekSelection([
                                true,
                                false,
                                false,
                                false,
                                false,
                                false,
                                false,
                              ]);
                              break;
                            case 1:
                              setDayOfWeekSelection([
                                false,
                                true,
                                false,
                                false,
                                false,
                                false,
                                false,
                              ]);
                              break;
                            case 2:
                              setDayOfWeekSelection([
                                false,
                                false,
                                true,
                                false,
                                false,
                                false,
                                false,
                              ]);
                              break;
                            case 3:
                              setDayOfWeekSelection([
                                false,
                                false,
                                false,
                                true,
                                false,
                                false,
                                false,
                              ]);
                              break;
                            case 4:
                              setDayOfWeekSelection([
                                false,
                                false,
                                false,
                                false,
                                true,
                                false,
                                false,
                              ]);
                              break;
                            case 5:
                              setDayOfWeekSelection([
                                false,
                                false,
                                false,
                                false,
                                false,
                                true,
                                false,
                              ]);
                              break;
                            case 6:
                              setDayOfWeekSelection([
                                false,
                                false,
                                false,
                                false,
                                false,
                                false,
                                true,
                              ]);
                              break;
                          }
                          break;
                        case "monthly on startdate":
                          setCustomRecurrenceRepeat(1);
                          return `Monthly on day ${dayjs(
                            existingSessionRecurrencePattern.recurrencePattern?.startDate ||
                              props.startDate,
                          ).format("d")}`;
                        default:
                          setCustomRecurrenceRepeat(null);
                          break;
                      }
                      if (i != "none") setModalOpen_CustomRecurrenceModal(true);
                    }}
                    label="Recurrence"
                    setValue={setValue}
                    useError={{ message: errors.recurrence?.message }}
                  />
                </Grid>
              </Grid>
              <Grid container spacing={GAP}>
                <Grid item xs={4}>
                  <XNGFormClockInput
                    label="Start Time"
                    name="startTime"
                    defaultValue={START as Dayjs}
                    control={control}
                    watch={watch}
                    onAfterChange={() => {
                      setValue(
                        "endTime",
                        dayjs(watch("startTime")).add(watch("minutesDuration"), "minutes").toDate(),
                      );
                    }}
                  />
                  <XNGErrorFeedback error={errors.startTime?.message} />
                </Grid>
                <Grid item xs={4}>
                  <XNGFormClockInput
                    defaultValue={END as Dayjs}
                    watch={watch}
                    control={control}
                    label="End Time"
                    name="endTime"
                    onAfterChange={(e) => {
                      setValue(
                        "minutesDuration",
                        dayjs(watch("endTime")).diff(watch("startTime"), "minutes"),
                      );
                    }}
                  />
                  <XNGErrorFeedback error={errors.endTime?.message} />
                </Grid>
                <Grid item xs={4}>
                  <XNGFormInput<number, SchedulerFieldValues>
                    value={
                      dayjs(watch("endTime")).diff(watch("startTime"), "minutes") ||
                      dayjs(props.endDate).diff(props.startDate, "minutes")
                    }
                    register={register}
                    name="minutesDuration"
                    label="Duration"
                    control={control}
                    onAfterChange={() => {
                      setValue(
                        "endTime",
                        dayjs(watch("startTime")).add(watch("minutesDuration"), "minutes").toDate(),
                      );
                    }}
                  />
                  <XNGErrorFeedback error={errors.minutesDuration?.message} />
                </Grid>
              </Grid>
              <Grid container spacing={GAP}>
                <Grid item xs={4}>
                  <XNGFormSelect
                    watch={watch}
                    defaultValue={
                      props.editedSession?.meetingDetails?.location?.name ||
                      session.meetingDetails?.location?.name ||
                      "School"
                    }
                    control={control}
                    name="location"
                    items={[
                      "School",
                      "Telehealth - Virtual",
                      "Telehealth - Audio",
                      "Office",
                      "Home",
                      "Community",
                    ]}
                    getOptionLabel={(i) => i}
                    label="Location"
                    setValue={setValue}
                  />
                  <XNGErrorFeedback error={errors.location?.message} />
                </Grid>
                <Grid item xs={8}>
                  <XNGFormInput
                    value={
                      props.editedSession?.meetingDetails?.location?.description ||
                      session.meetingDetails?.location?.description
                    }
                    register={register}
                    name="locationDescription"
                    label="Location Description"
                    control={control}
                  />
                  <XNGErrorFeedback error={errors.locationDescription?.message} />
                </Grid>
              </Grid>
              <Box>
                <XNGSearch<StudentRef>
                  options={studentCaseload}
                  getOptionLabel={(student) =>
                    (student.firstName + " " + student.lastName).toString()
                  }
                  onSelect={(s: StudentRef) => {
                    const alreadyHasStudent =
                      studentList.find((student) => student.id === s.id) !== undefined;
                    if (alreadyHasStudent) return;
                    if (watch("sessionType") === "individual") {
                      setValue("studentList", [s]);
                    } else {
                      setValue("studentList", [...studentList, s]);
                    }
                  }}
                  label="Type student name..."
                />
                {studentList && (
                  <Box
                    sx={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      marginTop: getSizing(2),
                    }}
                  >
                    {studentList.map((s: StudentRef, i: number) => {
                      return (
                        <XNGStudentButton
                          key={i}
                          student={s}
                          onDelete={() =>
                            setValue(
                              "studentList",
                              studentList.filter((student) => student.id !== s.id),
                            )
                          }
                        />
                      );
                    })}
                  </Box>
                )}
                <XNGErrorFeedback error={errors.studentList?.message} />
              </Box>
              <XNGButton
                size="large"
                onClick={() => {
                  handleSubmit(onSubmit)();
                }}
                fullWidth
              >
                Edit
              </XNGButton>
            </Box>
          </Dialog>
        </>
      ) : null}
    </>
  );
}

function XNGStudentButton(props: { student: StudentRef; onDelete: () => void }) {
  const s = props.student;
  const palette = usePalette();

  return (
    <ButtonBase
      sx={{
        height: getSizing(4),
        display: "flex",
        alignItems: "center",
        paddingX: getSizing(1),
        justifyContent: "space-between",
        borderRadius: BORDER_RADIUSES[0],
      }}
    >
      <Box sx={{ display: "flex", gap: getSizing(1), alignItems: "center" }}>
        <XNGIconRenderer i={<XNGICONS.Person />} size="sm" />
        <Typography color={palette.contrasts[1]} variant="body1">
          {s.firstName + " " + s.lastName}
        </Typography>
      </Box>
      <XNGClose onClick={() => props.onDelete()} size="modal" />
    </ButtonBase>
  );
}

function DayClicker(props: { children: React.ReactNode; selected: boolean; onClick: () => void }) {
  const palette = usePalette();

  return (
    <ButtonBase
      className="noselect"
      onClick={() => props.onClick()}
      sx={{
        borderRadius: 999,
        border: props.selected ? "none" : "1px solid " + palette.contrasts[2],
        width: getSizing(5),
        height: getSizing(5),
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        cursor: "pointer",
        bgcolor: props.selected ? palette.primary[2] : palette.contrasts[5],
        color: props.selected ? palette.contrasts[5] : palette.contrasts[0],
      }}
    >
      <Typography variant="body2">{props.children}</Typography>
    </ButtonBase>
  );
}
