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
  ClientRef,
  CreateRecurrencePatternRequest,
  CreateRecurringSesssionRequest,
  DayOfWeek,
  Location,
  RecurrenceMode,
  Service as SessionSDKService,
} from "../../session-sdk";
import { CreateSessionRequest } from "../../session-sdk";
import { API_SESSIONS, API_STATESNAPSHOTS } from "../../api/api";
import { useXNGDispatch, useXNGSelector } from "../../context/store";
import { selectStateInUS } from "../../context/slices/stateInUsSlice";
import { selectLoggedInClientAssignment } from "../../context/slices/userProfileSlice";
import { placeholderForFutureLogErrorText } from "../../temp/errorText";
import { selectStudents } from "../../context/slices/studentsSlice";
import {
  SchedulerFieldValueRecurrence,
  SchedulerFieldValues,
  SchedulerFieldValueRecurrenceCustom,
  VALIDATION_SCHEMA,
} from "./types";
import {
  selectActingServiceProvider,
  selectActingServiceProviderType,
  selectDataEntryProvider,
} from "../../context/slices/dataEntryProvider";
import XNGCheckbox from "../../design/low-level/checkbox";
import { timezoneAdjustedStartOrEndTimes } from "../../utils/timeZones";
import { unpostedSessionsActions } from "../../context/slices/unpostedSessionsSlice";

export interface ISchedulerModal {
  open: boolean;
  startDate: Date;
  endDate: Date;
  onClose: () => void;
  studentCaseload: StudentRef[];
  onRequestRefreshSessions: () => void;
}
export function SchedulerModal(props: ISchedulerModal) {
  // REDUX SELECTORS
  const userStateInUS = useXNGSelector(selectStateInUS);
  const dispatch = useXNGDispatch();
  const loggedInClientAssignment = useXNGSelector(selectLoggedInClientAssignment);
  const actingServiceProvider = useXNGSelector(selectActingServiceProvider);
  const actingServiceProviderType = useXNGSelector(selectActingServiceProviderType);
  // LOCAL STATES
  const [modalOpen_CustomRecurrenceModal, setModalOpen_CustomRecurrenceModal] =
    useState<boolean>(false);

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
  const START: Dayjs = dayjs(props.startDate);
  const END: Dayjs = dayjs(props.endDate);
  const DEFAULT_RECURRING_DATE: Dayjs = dayjs(null);

  // STYLE CONSTANTS
  const ROW_SX = {};
  const GAP = getSizing(2);

  const sessionType = useWatch({ control, name: "sessionType" });

  // --------------- USEEFFECTS / API ---------------
  // SET DEFAULTS ON OPEN / CLOSE, CASELOAD CHANGE
  useEffect(() => {
    reset();
    setValue("studentList", new Array<StudentRef>());
    setValue("minutesDuration", END.diff(START, "minutes"));
  }, [props.studentCaseload, props.open]);

  const studentList = useWatch({ control, name: "studentList" }) || [];

  useEffect(() => {
    if (sessionType === "group") return;
    if (studentList.length > 1) {
      setValue("studentList", [studentList[0]]);
    }
  }, [sessionType]);
  // Set services based on user's date selection
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
  useEffect(() => {
    fetchAndSetServices();
  }, [watch("dateOccurs")]);

  // --------------- CUSTOM STATES FOR CUSTOM FORM ---------------
  const [selectedday_sunday, selectedday_setSunday] = useState<boolean>(false);
  const [selectedday_monday, selectedday_setMonday] = useState<boolean>(false);
  const [selectedday_tuesday, selectedday_setTuesday] = useState<boolean>(false);
  const [selectedday_wednesday, selectedday_setWednesday] = useState<boolean>(false);
  const [selectedday_thursday, selectedday_setThursday] = useState<boolean>(false);
  const [selectedday_friday, selectedday_setFriday] = useState<boolean>(false);
  const [selectedday_saturday, selectedday_setSaturday] = useState<boolean>(false);
  const [customRecurrenceRepeat, setCustomRecurrenceRepeat] = useState<number | null>(null);
  const [customRecurrenceRepeatEveryDuration, setCustomRecurrenceRepeatEveryDuration] = useState<
    "day" | "week" | "month"
  >("week");
  const [radio_onafter, setradio_onafter] = useState<"on" | "after">("on");
  const [includeNonSchoolDay, setIncludeNonSchoolDays] = useState(false);

  // --------------- STATE  OdbDATABASE INFO ---------------
  const [dbInfo_Services, setDbInfo_Services] = useState<ProfileSDKService[]>([]);

  // --------------- ONSUBMIT ---------------
  const onSubmit = (data: SchedulerFieldValues) => {
    postSessionToDB();
    props.onClose();

    async function postSessionToDB() {
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
          id: loggedInClientAssignment.client!.id!,
          name: loggedInClientAssignment.client!.name!,
        },
      };

      // is recurring
      if (data.recurrence === "none") {
        await API_SESSIONS.v1SessionsPost(
          loggedInClientAssignment.client!.id!,
          userStateInUS,
          createSessionRequest,
        );
      } else {
        let recurrencePattern: CreateRecurrencePatternRequest = {};
        const fiveMonthsFromTodayDate: string = dayjs(Date()).add(5, "month").format("YYYY-MM-DD");
        const includedDays: DayOfWeek[] = [];
        const startingDayOfWeek = data.dateOccurs.getDay();
        if (selectedday_sunday) includedDays.push(DayOfWeek.NUMBER_0);
        if (selectedday_monday) includedDays.push(DayOfWeek.NUMBER_1);
        if (selectedday_tuesday) includedDays.push(DayOfWeek.NUMBER_2);
        if (selectedday_wednesday) includedDays.push(DayOfWeek.NUMBER_3);
        if (selectedday_thursday) includedDays.push(DayOfWeek.NUMBER_4);
        if (selectedday_friday) includedDays.push(DayOfWeek.NUMBER_5);
        if (selectedday_saturday) includedDays.push(DayOfWeek.NUMBER_6);

        let recurrenceEndDate = undefined;
        let numberOfOccurrences = undefined;
        if (radio_onafter === "on") {
          recurrenceEndDate =
            dayjs(data.recurrenceCustom?.ends.onDate).format("YYYY-MM-DD") ??
            dayjs().add(5, "years").format("YYYY-MM-DD");
        } else {
          numberOfOccurrences = data.recurrenceCustom?.ends.afterOccurences;
        }

        let recurrenceMode;
        switch (data.recurrenceCustom?.repeatEveryDuration) {
          case "day":
            recurrenceMode = RecurrenceMode.NUMBER_0;
            break;
          case "week":
            recurrenceMode = RecurrenceMode.NUMBER_1;
            break;
          case "month":
            recurrenceMode = RecurrenceMode.NUMBER_2;
            break;
          default:
            recurrenceMode = RecurrenceMode.NUMBER_1;
            break;
        }

        recurrencePattern = {
          //TODO: We'll need to decide how long to run these for.
          endDate: recurrenceEndDate,
          endNumberOfOccurrences: numberOfOccurrences,
          includedDaysOfWeek: includedDays,
          mode: recurrenceMode,
          interval:
            data.recurrenceCustom?.repeatEveryIncrement! >= 1
              ? data.recurrenceCustom?.repeatEveryIncrement
              : 1,
          includeNonSchoolDay: includeNonSchoolDay,
        };
        const createRecurringSessionRequest: CreateRecurringSesssionRequest = {
          session: createSessionRequest,
          recurrencePattern: recurrencePattern,
        };

        await API_SESSIONS.v1SessionsRecurringSessionPost(
          loggedInClientAssignment.client!.id!,
          userStateInUS,
          createRecurringSessionRequest,
        );
      }

      // refresh sessions
      props.onRequestRefreshSessions();
      dispatch(unpostedSessionsActions.triggerRefetchUnpostedSessions());
    }
  };

  return (
    <>
      {dbInfo_Services.length !== 0 && (
        <>
          <Dialog
            open={modalOpen_CustomRecurrenceModal}
            onClose={() => {
              setModalOpen_CustomRecurrenceModal(false);
            }}
          >
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
                  value={customRecurrenceRepeat}
                />
                <XNGFormSelect
                  name="recurrenceCustom.repeatEveryDuration"
                  label=""
                  control={control}
                  items={["day", "week"]} // TODO: Add "month" option back once the backend is capable.
                  watch={watch}
                  setValue={setValue}
                  defaultValue={customRecurrenceRepeatEveryDuration}
                  getOptionLabel={(
                    i: SchedulerFieldValueRecurrenceCustom["repeatEveryDuration"],
                  ) => {
                    // capitalize and add plural
                    return i.charAt(0).toUpperCase() + i.substring(1) + "(s)";
                  }}
                  getOptionCallback={(
                    i: SchedulerFieldValueRecurrenceCustom["repeatEveryDuration"],
                  ) => {
                    switch (i) {
                      case "day":
                        setCustomRecurrenceRepeatEveryDuration("day");
                        break;
                      case "week":
                        setCustomRecurrenceRepeatEveryDuration("week");
                        break;
                      case "month":
                        setCustomRecurrenceRepeatEveryDuration("month");
                        break;
                    }
                  }}
                />
              </Box>
              <Box sx={{ display: "flex:", flexDirection: "column" }}>
                <Typography variant="body1">Repeat on: </Typography>
                <Box sx={{ display: "flex", gap: getSizing(0.5), justifyContent: "space-evenly" }}>
                  <DayClicker
                    selected={selectedday_sunday}
                    onClick={() => selectedday_setSunday(!selectedday_sunday)}
                  >
                    S
                  </DayClicker>
                  <DayClicker
                    selected={selectedday_monday}
                    onClick={() => selectedday_setMonday(!selectedday_monday)}
                  >
                    M
                  </DayClicker>
                  <DayClicker
                    selected={selectedday_tuesday}
                    onClick={() => selectedday_setTuesday(!selectedday_tuesday)}
                  >
                    T
                  </DayClicker>
                  <DayClicker
                    selected={selectedday_wednesday}
                    onClick={() => selectedday_setWednesday(!selectedday_wednesday)}
                  >
                    W
                  </DayClicker>
                  <DayClicker
                    selected={selectedday_thursday}
                    onClick={() => selectedday_setThursday(!selectedday_thursday)}
                  >
                    T
                  </DayClicker>
                  <DayClicker
                    selected={selectedday_friday}
                    onClick={() => selectedday_setFriday(!selectedday_friday)}
                  >
                    F
                  </DayClicker>
                  <DayClicker
                    selected={selectedday_saturday}
                    onClick={() => selectedday_setSaturday(!selectedday_saturday)}
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
                      defaultValue={DEFAULT_RECURRING_DATE}
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
                    checked={includeNonSchoolDay}
                    onToggle={() => {
                      setIncludeNonSchoolDays(!includeNonSchoolDay);
                    }}
                  />
                  <Typography variant="body1">Include Non-School Days </Typography>
                </Box>
              </Box>
              <Box sx={{ display: "flex", justifyContent: "flex-end", paddingTop: getSizing(2) }}>
                <XNGButton
                  onClick={() => {
                    setModalOpen_CustomRecurrenceModal(false);
                  }}
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
                <Typography variant="h6">New Session</Typography>
                <XNGClose onClick={() => props.onClose()} size="modal" />
              </Box>
              <Grid container spacing={GAP}>
                <Grid item xs={12}>
                  <XNGFormInput register={register} name="title" label="Title" control={control} />
                  <XNGErrorFeedback error={errors.title?.message} />
                </Grid>
              </Grid>
              <Grid container spacing={GAP}>
                <Grid item xs={6}>
                  <XNGFormSelect
                    watch={watch}
                    defaultValue={dbInfo_Services[0]}
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
                    defaultValue="group"
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
                      setValue("dateOccurs", e as unknown as Date);
                      setValue(
                        "startTime",
                        e!.toDate(),
                      );
                      setValue(
                        "endTime",
                        e!.toDate(),
                      );
                    }}
                  />
                  <XNGErrorFeedback error={errors.dateOccurs?.message} />
                </Grid>
                <Grid item xs={6} sx={{ display: "flex" }}>
                  <XNGFormSelect<SchedulerFieldValues, SchedulerFieldValueRecurrence>
                    watch={watch}
                    control={control}
                    name="recurrence"
                    items={[
                      "none",
                      "weekdays",
                      "weekly on startdate",
                      "daily",
                      // "monthly on startdate",  //TODO: Add this back when backend is capable.
                      "custom",
                    ]}
                    getOptionLabel={(i: SchedulerFieldValueRecurrence) => {
                      switch (i) {
                        case "none":
                          return "Not Recurring";
                        case "daily":
                          return "Daily";
                        case "weekdays":
                          return "Every Weekday (Monday to Friday)";
                        case "weekly on startdate":
                          return `Weekly on ${dayjs(props.startDate).format("dddd")}`;
                        case "monthly on startdate":
                          return `Monthly on day ${dayjs(props.startDate).format("d")}`;
                        case "custom":
                          return "Custom";
                      }
                    }}
                    getOptionCallback={(i: SchedulerFieldValueRecurrence) => {
                      selectedday_setMonday(false);
                      selectedday_setTuesday(false);
                      selectedday_setWednesday(false);
                      selectedday_setThursday(false);
                      selectedday_setFriday(false);
                      selectedday_setSaturday(false);
                      selectedday_setSunday(false);
                      setCustomRecurrenceRepeat(null);
                      switch (i) {
                        case "daily":
                          selectedday_setMonday(true);
                          selectedday_setTuesday(true);
                          selectedday_setWednesday(true);
                          selectedday_setThursday(true);
                          selectedday_setFriday(true);
                          selectedday_setSaturday(true);
                          selectedday_setSunday(true);
                          setCustomRecurrenceRepeat(1);
                          break;
                        case "weekdays":
                          selectedday_setMonday(true);
                          selectedday_setTuesday(true);
                          selectedday_setWednesday(true);
                          selectedday_setThursday(true);
                          selectedday_setFriday(true);
                          setCustomRecurrenceRepeat(1);
                          break;
                        case "weekly on startdate":
                          setCustomRecurrenceRepeat(1);
                          let test = dayjs(props.startDate).day();
                          switch (test) {
                            case 0:
                              selectedday_setSunday(true);
                              break;
                            case 1:
                              selectedday_setMonday(true);
                              break;
                            case 2:
                              selectedday_setTuesday(true);
                              break;
                            case 3:
                              selectedday_setWednesday(true);
                              break;
                            case 4:
                              selectedday_setThursday(true);
                              break;
                            case 5:
                              selectedday_setFriday(true);
                              break;
                            case 6:
                              selectedday_setSaturday(true);
                              break;
                          }
                          break;
                        case "monthly on startdate":
                          setCustomRecurrenceRepeat(1);
                          return `Monthly on day ${dayjs(props.startDate).format("d")}`;
                        default:
                          setCustomRecurrenceRepeat(null);
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
                    defaultValue={START}
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
                    defaultValue={END}
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
                    defaultValue="School"
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
                  options={props.studentCaseload}
                  getOptionLabel={(student) => {
                    const date = student.dateOfBirth?.toLocaleString();
                    const y = date?.slice(0, 4);
                    const m = date?.slice(5, 7);
                    const d = date?.slice(8, 10);
                    return (
                      student.firstName +
                      " " +
                      student.lastName +
                      " (" +
                      m +
                      "/" +
                      d +
                      "/" +
                      y +
                      ")"
                    ).toString();
                  }}
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
                Create
              </XNGButton>
            </Box>
          </Dialog>
        </>
      )}
    </>
  );
}

function XNGStudentButton(props: { student: StudentRef; onDelete: () => void }) {
  const s = props.student;
  const palette = usePalette();
  const date = s.dateOfBirth?.toLocaleString();
  const y = date?.slice(0, 4);
  const m = date?.slice(5, 7);
  const d = date?.slice(8, 10);

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
          {s.firstName + " " + s.lastName + " (" + m + "/" + d + "/" + y + ")"}
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
