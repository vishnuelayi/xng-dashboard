import usePalette from "./usePalette";
import { SessionStatus } from "../session-sdk";

export type NotificationStatus = "Danger" | "Warning" | "Success" | "Info";

const useNotatorProgressColor = (status: NotificationStatus | SessionStatus) => {
  const palette = usePalette();
  switch (status) {
    // Gray
    case SessionStatus.NUMBER_0:
      return {
        color: palette.contrasts[0],
        color_2: palette.contrasts[0],
        bgcolor: palette.contrasts[3],
      };
    // Yellow
    case SessionStatus.NUMBER_1:
    case "Warning":
      return {
        color: palette.warning[1],
        color_2: palette.warning[0],
        bgcolor: palette.warning[3],
      };
    // Blue
    case SessionStatus.NUMBER_2:
    case "Info":
      return {
        color: palette.primary[2],
        color_2: palette.contrasts[0],
        bgcolor: palette.menu[3],
      };
    // Red
    case SessionStatus.NUMBER_3:
    case "Danger":
      return { color: palette.danger[1], color_2: palette.danger[1], bgcolor: palette.danger[3] };
    // Green
    case SessionStatus.NUMBER_4:
    case "Success":
      return {
        color: palette.success[4],
        color_2: palette.success[1],
        bgcolor: palette.success[3],
      };
    // Purple
    case SessionStatus.NUMBER_5:
      return {
        color: palette.secondary[4],
        color_2: palette.secondary[4],
        bgcolor: palette.secondary[3],
      };
    default:
      return {
        color: palette.contrasts[0],
        color_2: palette.contrasts[0],
        bgcolor: palette.contrasts[3],
      };
  }
};

export default useNotatorProgressColor;
