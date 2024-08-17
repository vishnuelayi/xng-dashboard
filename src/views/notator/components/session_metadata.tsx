import { useState, useEffect } from "react";
import usePalette from "../../../hooks/usePalette";
import { useForm } from "react-hook-form";
import { SxProps, Typography, Dialog, Grid } from "@mui/material";
import { getSizing } from "../../../design/sizing";
import XNGHyperlink from "../../../design/low-level/hyperlink";
import { XNGClockInput as XNGFormClockInput } from "../../../design/components-form/clock";
import { XNGFormInput } from "../../../design/components-form/textfield";
import { XNGFormSelect } from "../../../design/components-form/select";
import XNGButton from "../../../design/low-level/button";
import XNGClose from "../../../design/low-level/button_close";
import XNGFormDatePicker from "../../../design/components-form/datepicker";
import { XNGErrorFeedback } from "../../../design/components-form/_error";
import dayjs, { Dayjs } from "dayjs";
import { JustDay_FORMATTER } from "../../../design/date_format";
import Box from "../../../design/components-dev/BoxExtended";
import IfElseBox from "../../../design/components-dev/if_else_box";
import { SessionResponse, UpdateSessionRequest, Location } from "../../../session-sdk";
import { API_SESSIONS, API_STATESNAPSHOTS } from "../../../api/api";
import {
  Service as ProfileSDKService,
  ServicesByServiceProviderTypeResponse,
} from "../../../profile-sdk";
import useNotatorProgressColor from "../../../hooks/useNotatorProgressColor";
import { useXNGSelector } from "../../../context/store";
import { selectStateInUS } from "../../../context/slices/stateInUsSlice";
import { selectActingServiceProviderType } from "../../../context/slices/dataEntryProvider";
import { EditSessionMetadataFieldValues, VALIDATION_SCHEMA } from "../types/types";
import { yupResolver } from "@hookform/resolvers/yup";
import { placeholderForFutureLogErrorText } from "../../../temp/errorText";
import { notatorLanguageConstants } from "../logic/language";
import { timezoneAdjustedStartOrEndTimes } from "../../../utils/timeZones";
import { useNotatorTools } from "../tools";
import { produce } from "immer"

function SessionMetadataEditor(props: { editedSession: SessionResponse, saveSession: (freshSession: SessionResponse) => Promise<SessionResponse> }) {
  // HOOKS

  const { color } = useNotatorProgressColor(
    props.editedSession.status !== undefined ? props.editedSession.status : "Info",
  );
  // STATES
  const [schedulerModalOpen, setSchedulerModalOpen] = useState(false);
  const userStateInUS = useXNGSelector(selectStateInUS);

  // CONSTANTS
  const METADATA_ROW: SxProps = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    minHeight: getSizing(4),
    maxHeight: getSizing(4),
  };

  // Timezone Adjustments
  const { timezoneAdjustedStartTime: START, timezoneAdjustedEndTime: END } =
    timezoneAdjustedStartOrEndTimes(
      userStateInUS,
      "display",
      dayjs(props.editedSession.meetingDetails?.startTime),
      dayjs(props.editedSession.meetingDetails?.endTime),
    );

  return (
    <Box sx={{ display: "flex", marginLeft: getSizing(5), width: "100%", maxWidth: getSizing(47) }}>
      <EditSessionMetadataModal
        open={schedulerModalOpen}
        startDate={props.editedSession.meetingDetails?.startTime!}
        endDate={props.editedSession.meetingDetails?.endTime!}
        onClose={() => setSchedulerModalOpen(false)}
        editedSession={props.editedSession}
        saveSession={props.saveSession}
      />
      <Box name="left" sx={{ minWidth: getSizing(5), paddingTop: getSizing(1) }}>
        <Box
          sx={{
            width: "20px",
            height: "20px",
            border: [2, 5].includes(props.editedSession.status!) ? "1px solid white" : "none",
            borderRadius: 999,
            bgcolor: color,
          }}
        />
      </Box>
      <Box name="right" sx={{ minWidth: getSizing(34), width: "100%" }}>
        <Box sx={METADATA_ROW}>
          <Typography variant="h6">{props.editedSession.title}</Typography>
          <XNGHyperlink
            onClick={() => {
              if (props.editedSession.status !== 4 && props.editedSession.status !== 5) {
                setSchedulerModalOpen(true);
              }
            }}
            color="white"
          >
            Edit
          </XNGHyperlink>
        </Box>
        <Box sx={METADATA_ROW}>
          <Typography variant="body2">{props.editedSession.service?.name}</Typography>
          <Typography variant="body2">
            {dayjs(props.editedSession.meetingDetails?.date).format(JustDay_FORMATTER)}
          </Typography>
        </Box>
        <Box sx={METADATA_ROW}>
          <Typography variant="body2">
            at {props.editedSession.meetingDetails?.location?.name} -{" "}
            {props.editedSession.meetingDetails?.location?.description}
          </Typography>
          <Typography variant="body2">
            {dayjs(START).format("hh:mm A")}-{dayjs(END).format("hh:mm A")}
          </Typography>
        </Box>
        <Box sx={METADATA_ROW}>
          <Typography variant="body2">
            {props.editedSession.groupSetting
              ? notatorLanguageConstants.inAGroupSetting
              : notatorLanguageConstants.notInAGroupSetting}
          </Typography>
          <Typography variant="body2">{dayjs(END).diff(START, "minutes")} minutes</Typography>
        </Box>
      </Box>
    </Box>
  );
}

interface IEditSessionMetadataModal {
  open: boolean;
  startDate: Date;
  endDate: Date;
  onClose: () => void;
  editedSession?: SessionResponse;
  saveSession: (freshSession: SessionResponse) => Promise<SessionResponse>
}

function EditSessionMetadataModal(props: IEditSessionMetadataModal) {
  const { draftSession, setDraftSession } = useNotatorTools();
  const [title, setTitle] = useState(props.editedSession?.title);

  // REDUX SELECTORS
  const userStateInUS = useXNGSelector(selectStateInUS);
  const actingServiceProviderType = useXNGSelector(selectActingServiceProviderType);

  // --------------- STATE  OdbDATABASE INFO ---------------
  const [dbInfo_Services, setDbInfo_Services] = useState<ProfileSDKService[]>([]);

  // REACT HOOK FORM
  const {
    handleSubmit,
    control,
    register,
    formState: { errors },
    watch,
    setValue,
    reset,
  } = useForm<EditSessionMetadataFieldValues>({ resolver: yupResolver(VALIDATION_SCHEMA) });

  // INITIAL VALUES
  const { timezoneAdjustedStartTime: START, timezoneAdjustedEndTime: END } =
    timezoneAdjustedStartOrEndTimes(
      userStateInUS,
      "display",
      dayjs(props.startDate),
      dayjs(props.endDate),
    );

  // STYLE CONSTANTS
  const GAP = getSizing(2);

  // --------------- USEEFFECTS / API ---------------
  // SET DEFAULTS ON OPEN / CLOSE, CASELOAD CHANGE
  useEffect(() => {
    reset();
    fetchAndSetServices();
  }, [props.open]);

  // Set services based on user's date selection
  async function fetchAndSetServices() {
    const useThisDateForNow: Date = dayjs().toDate();

    const servicesByServiceProviderTypeResponse: ServicesByServiceProviderTypeResponse =
      await API_STATESNAPSHOTS.v1StateSnapshotsByDateServicesByServiceProviderTypeGet(
        userStateInUS,
        useThisDateForNow,
        actingServiceProviderType!.id,
      );

    if (servicesByServiceProviderTypeResponse.services) {
      setDbInfo_Services(servicesByServiceProviderTypeResponse.services);
    } else {
      throw new Error(placeholderForFutureLogErrorText);
    }
  }

  const getDefaultServiceValue = (session: SessionResponse) => {
    if (!session.service) return dbInfo_Services[0];
    return dbInfo_Services.find((service) => service.id === session.service?.id);
  };

  const onEditSubmit = async (data: EditSessionMetadataFieldValues) => {
    // Timezone adjustments
    const { timezoneAdjustedStartTime, timezoneAdjustedEndTime } = timezoneAdjustedStartOrEndTimes(
      userStateInUS,
      "data",
      data.startTime,
      data.endTime,
    );

    const updateSessionRequest: UpdateSessionRequest = {
      id: props.editedSession!.id,
      title: data.title,
      service: {
        id: data.service.id,
        name: data.service.name,
        description: data.service.description,
        area: data.service.area,
        type: data.service.serviceType,
      },
      groupSetting: data.sessionType === "group",
      meetingDetails: {
        date: dayjs(data.startTime).startOf("day").toDate(),
        startTime: timezoneAdjustedStartTime as Date,
        endTime: timezoneAdjustedEndTime as Date,
        location: { name: data.location, description: data.locationDescription } as Location, // Todo: ID later
      },
      studentJournalList: props.editedSession!.studentJournalList?.map((item) => ({
        ...item,
        studentAttendanceRecord: {
          ...item.studentAttendanceRecord,
          arrivalTime: timezoneAdjustedStartTime as Date,
          departureTime: timezoneAdjustedEndTime as Date,
        },
      })),
    };

    const updatedSession = produce(props.editedSession || {}, draft => {
      draft = Object.assign(draft, updateSessionRequest)
    })

    setDraftSession(updatedSession);
    props.saveSession(updatedSession)

    props.onClose();
  };

  return (
    <>
      {dbInfo_Services.length !== 0 && (
        <Dialog
          open={props.open}
          onClose={() => {
            setTitle(props.editedSession?.title);
            props.onClose();
          }}
          fullWidth
          maxWidth={"sm"}
        >
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
              <Typography variant="h6">{"Edit Today's Session"}</Typography>
              <XNGClose
                onClick={() => {
                  setTitle(props.editedSession?.title);
                  props.onClose();
                }}
                size="modal"
              />
            </Box>
            <Grid container spacing={GAP}>
              <Grid item xs={12}>
                <XNGFormInput
                  register={register}
                  name="title"
                  label="Title"
                  control={control}
                  value={title}
                  onAfterChange={(e) => {
                    setTitle(e.target.value);
                  }}
                />
                <XNGErrorFeedback error={errors.title?.message} />
              </Grid>
            </Grid>
            <Grid container spacing={GAP}>
              <Grid item xs={6}>
                <XNGFormSelect
                  watch={watch}
                  defaultValue={getDefaultServiceValue(props.editedSession!)}
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
                <XNGFormSelect<EditSessionMetadataFieldValues, "group" | "individual">
                  watch={watch}
                  defaultValue={props.editedSession?.groupSetting ? "group" : "individual"}
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
              <Grid item xs={12}>
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
                <XNGFormInput<number, EditSessionMetadataFieldValues>
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
              <Grid item xs={12}>
                <XNGFormSelect
                  watch={watch}
                  defaultValue={props.editedSession?.meetingDetails?.location?.name || "School"}
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
            </Grid>
            <XNGButton
              size="large"
              onClick={() => {
                handleSubmit(onEditSubmit)();
              }}
              fullWidth
            >
              {"Edit"}
            </XNGButton>
          </Box>
        </Dialog>
      )}
    </>
  );
}

export default SessionMetadataEditor;
