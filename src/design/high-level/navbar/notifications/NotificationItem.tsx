import { Typography } from "@mui/material";
import Box from "../../../components-dev/BoxExtended";
import { getSizing } from "../../../sizing";
import { Dayjs } from "dayjs";
import { Tooltip, IconButton } from "@mui/material";
import usePalette from "../../../../hooks/usePalette";
import XNGBadge from "../../../low-level/badge";
import XNGButton from "../../../low-level/button";
import { useState, useEffect } from "react";

export function NotificationItem(props: {
  text: string;
  date: Dayjs;
  unread: boolean;
  onYes?: () => void;
  onNo?: () => void;
  onRead: () => void;
  response?: string | null;
  requestingUser?: string;
  isLoading?: boolean;
}) {
  const [read, setRead] = useState<boolean>(props.unread);

  useEffect(() => {
    /**
     * HACK
     * There is sometimes a mismatch between the value of read and props.unread
     * from a previous render and the incoming props so we make sure they are the same here.
     * When a web socket server or something equivalent is eventually setup for notifications,
     * the front-end notification system should be re-evaluated and probably refactored
     */
    setRead(props.unread);
  }, [props.unread]);

  const palette = usePalette();
  const howLongAgo =
    props.date.fromNow().charAt(0).toLocaleUpperCase() + props.date.fromNow().substring(1);
  const notificationText = () => {
    if (!props.response) return props.text;
    if (props.response && !props.requestingUser) return props.text;
    if (props.response && props.requestingUser) {
      // HACK: This needs to be refactored later, notifications will probably change in the future
      const approvedOrDeniedRegex = /\b(granted|denied|allowed|approved)\b/g;
      const messageToRespondingUser = `You have ${props.response.match(approvedOrDeniedRegex)} ${
        props.requestingUser
      } access to your district.`;
      return messageToRespondingUser;
    }
  };
  return (
    <Box
      sx={{
        paddingY: getSizing(1),
        display: "flex",
        gap: getSizing(1),
        ":hover": { bgcolor: palette.contrasts[4], cursor: "pointer" },
      }}
      className="noselect"
    >
      <Box sx={{ width: getSizing(43), paddingLeft: getSizing(2) }}>
        <Typography variant="body2" sx={{ textAlign: "left" }}>
          {notificationText()}
          <Typography color={palette.contrasts[2]} variant="body2" sx={{ display: "inline" }}>
            {" " + howLongAgo}
          </Typography>
        </Typography>
        {!props.response && (
          <Box
            sx={{
              display: "flex",
              gap: getSizing(2),
              marginTop: props.onYes ? getSizing(2) : 0,
              marginBottom: getSizing(1),
            }}
          >
            {props.onNo && (
              <XNGButton onClick={() => props.onNo!()} variant="outline" disabled={props.isLoading}>
                No
              </XNGButton>
            )}
            {props.onYes && (
              <XNGButton onClick={() => props.onYes!()} disabled={props.isLoading}>
                Yes
              </XNGButton>
            )}
          </Box>
        )}
      </Box>
      {read && (
        <Box sx={{ width: getSizing(5), height: getSizing(5) }}>
          <Tooltip title="Mark as read">
            <IconButton
              onClick={() => {
                props.onRead();
                setRead(false);
              }}
              sx={{ padding: getSizing(1.5) }}
            >
              <XNGBadge status="Default" />
            </IconButton>
          </Tooltip>
        </Box>
      )}
    </Box>
  );
}
