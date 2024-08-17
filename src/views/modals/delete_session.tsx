import React, { useState } from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getSizing } from "../../design/sizing";
import Box from "../../design/components-dev/BoxExtended";
import usePalette from "../../hooks/usePalette";
import { Dialog, Typography } from "@mui/material";
import { placeholderForFutureLogErrorText } from "../../temp/errorText";
import XNGButton from "../../design/low-level/button";
import dayjs from "dayjs";
import { SessionDateCard } from "../../session-sdk";
import { API_SESSIONS } from "../../api/api";
import XNGCheckbox from "../../design/low-level/checkbox";
import XNGCard from "../../design/low-level/card";

// Attention: Anyone modifying this component on a future problem, please refactor to use IOC; the `onAction` pattern instead of directly passing functions
export function DeleteSessionModal(props: {
  setDeleteSession: React.Dispatch<React.SetStateAction<boolean>>;
  showDeleteSession: boolean;
  deleteSession: Function;
  deleteMultipleSessions: Function;
  deleteSeries: Function;
  seriesId: string | undefined;
  state: string;
  providerId: string | undefined;
}) {
  const palette = usePalette();
  const navigate = useNavigate();
  const [sessionInThisSeries, setSessionsInThisSeries] = useState<SessionDateCard[]>([]);
  const [sessionsToDelete, setSessionsToDelete] = useState<SessionDateCard[]>([]);

  async function fetchAndSetAllSessionsInSeries() {
    const getSessions = await API_SESSIONS.v1SessionsGetAllMutableStatusSessionsInSeriesGet(
      props.seriesId!,
      props.providerId!,
      props.state,
    );
    if (getSessions.sessionDateCards === undefined) throw Error(placeholderForFutureLogErrorText);
    setSessionsInThisSeries(getSessions.sessionDateCards);
  }

  function handleDelete() {
    if (sessionsToDelete.length === sessionInThisSeries.length) {
      props.deleteSeries();
      navigate("/xlogs/calendar");
    } else if (sessionsToDelete.length > 0) {
      let idsToDelete: string[] = [];
      let datesToDelete: string[] = [];
      sessionsToDelete.map((session) => {
        idsToDelete.push(session.id!);
        datesToDelete.push(session.sessionDate!);
      });

      props.deleteMultipleSessions(idsToDelete, datesToDelete);
      navigate("/xlogs/calendar");
    } else {
      return;
    }
  }

  function handleSelectAll() {
    if (sessionInThisSeries.length === sessionsToDelete.length) {
      setSessionsToDelete([]);
    } else {
      setSessionsToDelete([...sessionInThisSeries]);
    }
  }

  function handleSelectSession(session: SessionDateCard) {
    let index = sessionsToDelete.findIndex((s) => s === session);
    if (index === -1) {
      let temp = sessionsToDelete;
      temp.push(session);
      setSessionsToDelete([...temp]);
    } else {
      let temp = sessionsToDelete;
      temp.splice(index, 1);
      setSessionsToDelete([...temp]);
    }
  }

  useEffect(() => {
    if ((props.showDeleteSession && props.seriesId != null) || undefined) {
      fetchAndSetAllSessionsInSeries();
    }
  }, [props.showDeleteSession]);

  return (
    <>
      {props.seriesId === undefined || props.seriesId === null ? (
        <Dialog
          className="noselect"
          onClose={() => {
            props.setDeleteSession(false);
          }}
          open={props.showDeleteSession}
        >
          <Box
            sx={{
              display: "flex",
              paddingBlock: getSizing(5),
              paddingTop: getSizing(3),
              paddingX: getSizing(2),
              gap: getSizing(3),
              flexDirection: "column",
            }}
          >
            <Typography variant="h5">Delete Session</Typography>
            <Typography variant="body1">
              Please confirm that you would like to delete this session
            </Typography>
            <XNGButton
              variant="filled"
              sx={{
                bgcolor: palette.danger[1],
                ":hover": { bgcolor: palette.danger[2] },
              }}
              onClick={() => props.deleteSession()}
            >
              DELETE
            </XNGButton>
          </Box>
        </Dialog>
      ) : (
        <Dialog
          className="noselect"
          onClose={() => {
            props.setDeleteSession(false);
          }}
          open={props.showDeleteSession}
        >
          <Box
            sx={{
              display: "flex",
              paddingBlock: getSizing(5),
              paddingTop: getSizing(3),
              paddingX: getSizing(2),
              gap: getSizing(3),
              flexDirection: "column",
            }}
          >
            <Typography variant="h5">Delete Session</Typography>
            <Typography variant="body1">
              Please select the session(s) you would like to remove from this series.
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", gap: getSizing(1) }}>
              <XNGCheckbox
                checked={sessionsToDelete.length === sessionInThisSeries.length}
                onToggle={() => {
                  handleSelectAll();
                }}
              />
              <Typography variant="body1">Select All </Typography>
            </Box>
            <XNGCard sx={{ maxHeight: getSizing(50), overflowY: "scroll" }}>
              {sessionInThisSeries?.length > 0
                ? sessionInThisSeries.map((session) => {
                    return (
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: getSizing(1),
                          paddingTop: getSizing(1),
                        }}
                      >
                        <XNGCheckbox
                          checked={sessionsToDelete.includes(session)}
                          onToggle={() => {
                            handleSelectSession(session);
                          }}
                        />
                        <Typography variant="body1">
                          {dayjs(session.sessionDate).format("MM/DD/YYYY")}
                        </Typography>
                      </Box>
                    );
                  })
                : null}
            </XNGCard>
            <XNGButton
              variant="filled"
              sx={{
                bgcolor: palette.danger[1],
                ":hover": { bgcolor: palette.danger[2] },
              }}
              onClick={() => handleDelete()}
            >
              DELETE
            </XNGButton>
          </Box>
        </Dialog>
      )}
    </>
  );
}
