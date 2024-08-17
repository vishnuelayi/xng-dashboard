import React, { useState, useEffect } from "react";
import dayjs, { Dayjs } from "dayjs";
import { EventImpl } from "@fullcalendar/core/internal";
import Box from "../../../design/components-dev/BoxExtended";
import { Typography, Dialog, RadioGroup, FormControlLabel, Radio } from "@mui/material";
import { getSizing } from "../../../design/sizing";
import XNGClose from "../../../design/low-level/button_close";
import XNGButton from "../../../design/low-level/button";
import { API_SESSIONS } from "../../../api/api";
import { ServiceProviderRef, ClientAssignment } from "../../../profile-sdk";
import {
  SessionResponse,
  PatchSessionsSeriesDateRequest,
  PatchSessionSeriesTimeRequest,
} from "../../../session-sdk";
import { placeholderForFutureLogErrorText } from "../../../temp/errorText";
import { getUserTimeZone } from "../../../utils/timeZones";

interface IDragAndDropEditSessionSeriesModal {
  open: boolean;
  handleClose: (arg: boolean) => void;
  calendarEvent: EventImpl | undefined;
  refreshSessions: () => void;
  state: string;
  actingServiceProvider: ServiceProviderRef;
  loggedInClientAssignment: ClientAssignment;
}

export function DragAndDropEditSessionSeriesModal(props: IDragAndDropEditSessionSeriesModal) {
  const {
    open,
    handleClose,
    calendarEvent,
    refreshSessions,
    state,
    actingServiceProvider,
    loggedInClientAssignment,
  } = props;
  const [selection, setSelection] = useState<"single" | "all">("single");
  const [session, setSession] = useState<SessionResponse>({} as SessionResponse);
  useEffect(() => {
    if (open) {
      fetchAndSetSession(
        calendarEvent?._def.extendedProps.id,
        calendarEvent?._def.extendedProps.seriesId,
        calendarEvent?._def.extendedProps.date,
      );
    }
  }, [open]);
  async function fetchAndSetSession(sessionID: string, seriesId: string, sessionDate: Date) {
    const serviceProviderId = actingServiceProvider?.id;
    const sessionDateDayjs = dayjs(sessionDate);
    if (!serviceProviderId) throw new Error(placeholderForFutureLogErrorText);
    const sessionResponse = await API_SESSIONS.v1SessionsGet(
      serviceProviderId,
      state,
      sessionID,
      seriesId,
      sessionDateDayjs.toDate(),
      getUserTimeZone()
    );

    setSession(sessionResponse);
  }
  const handleSubmit = async (eventArg: EventImpl | undefined, option: "single" | "all") => {
    const event = eventArg;
    if (option === "single" && event?.start != null && event?.end != null) {
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
      handleClose(false);
      refreshSessions();
    }
    if (option === "all" && event?.start != null && event?.end != null) {
      const start = dayjs(event.start);
      const end = dayjs(event.end);
      const sessionId = event._def.extendedProps.id;
      const serviceProviderId = event._def.extendedProps.serviceProvider.id;
      const originalDate = dayjs(event._def.extendedProps.date);
      const patchSessionSeriesRequest: PatchSessionsSeriesDateRequest = {
        newStartDate: start.toDate(),
        newEndDate: end.toDate(),
        originalDate: originalDate.toDate(),
        sessionId: sessionId,
        seriesId: event._def.extendedProps.seriesId,
        timeZone: getUserTimeZone(),
      };

      await API_SESSIONS.v1SessionsUpdateSeriesTimePut(
        serviceProviderId,
        state,
        patchSessionSeriesRequest,
      );
      handleClose(false);
      refreshSessions();
    }
    return;
  };

  return (
    <Dialog open={open} onClose={() => handleClose(false)} fullWidth maxWidth={"sm"}>
      <Box
        component="form"
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: getSizing(2),
          width: "100%",
          padding: getSizing(4),
        }}
      >
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography variant="h6">Edit Recurring Event Schedule:</Typography>
          <XNGClose onClick={() => handleClose(false)} size="modal" />
        </Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            padding: getSizing(1),
            gap: getSizing(1),
          }}
        >
          <RadioGroup
            aria-labelledby="demo-controlled-radio-buttons-group"
            name="controlled-radio-buttons-group"
            value={selection}
            onChange={(e) => setSelection(e.target.value as "single" | "all")}
          >
            <FormControlLabel
              sx={{ pt: getSizing(1) }}
              value="single"
              control={<Radio />}
              label="This Session Only"
            />
            <FormControlLabel
              sx={{ pt: getSizing(1) }}
              value="all"
              control={<Radio />}
              label="This Session and Following Sessions"
            />
          </RadioGroup>
          <Box sx={{ display: "flex", justifyContent: "flex-end", paddingTop: getSizing(2) }}>
            <XNGButton
              onClick={() => {
                handleSubmit(calendarEvent, selection);
              }}
              sx={{ paddingX: getSizing(2) }}
            >
              Save
            </XNGButton>
          </Box>
        </Box>
      </Box>
    </Dialog>
  );
}
