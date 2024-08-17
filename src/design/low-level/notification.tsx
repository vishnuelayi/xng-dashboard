import useNotatorProgressColor from "../../hooks/useNotatorProgressColor";
import { SessionStatus } from "../../session-sdk";
import { BORDER_RADIUSES } from "../borderRadiuses";
import Box from "../components-dev/BoxExtended";
import { getSizing } from "../sizing";

export type NotificationStatus = "Danger" | "Warning" | "Success" | "Info";
export type NotificationSize = "compact" | "default";

interface IXNGNotification {
  children?: React.ReactNode;
  status?: NotificationStatus | SessionStatus;
  size?: NotificationSize;
  useBadge?: boolean;
  fullHeight?: boolean;
  view?: "day";
  nonSchoolDay?: boolean;
}

function XNGNotification(props: IXNGNotification) {
  const { color, color_2, bgcolor } = useNotatorProgressColor(
    props.status !== undefined ? props.status : "Info",
  );

  return (
    <Box
      sx={{
        borderRadius: BORDER_RADIUSES[0],
        bgcolor: props.nonSchoolDay ? "#B6B6B6" : bgcolor,
        color: color_2,
        minHeight: props.fullHeight ? "100%" : props.size === "compact" ? "unset" : getSizing(5),
        height:
          props.size === "compact" && props.view !== "day"
            ? props.fullHeight
              ? getSizing(2)
              : 0
            : props.view === "day"
            ? "max-content"
            : "min-content",
        overflow: "hidden",
        display: "flex",
        paddingX: getSizing(1),
        paddingY: getSizing(1),
        width: props.view === "day" ? "100vw" : "100%",
        maxWidth: props.view === "day" ? "unset" : "1366px",
        textAlign: "center",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Box
        sx={{
          minWidth: "8px",
          minHeight: "8px",
          borderRadius: 999,
          bgcolor: props.nonSchoolDay ? "#757575" : color_2,
          marginRight: getSizing(1),
        }}
      />
      <Box sx={{ display: "flex", width: "100%" }}>{props.children}</Box>
    </Box>
  );
}

export default XNGNotification;
