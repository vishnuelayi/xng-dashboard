import { ReactComponent as ChatBubbles } from "./icons/chatBubbles.svg";
import { ReactComponent as Alert } from "./icons/alert.svg";
import { ReactComponent as Grid4X4 } from "./icons/grid4x4.svg";
import { ReactComponent as XLogs_X } from "./icons/xlogs_X.svg";
import { ReactComponent as Commander } from "./icons/commander.svg";
import { ReactComponent as Home } from "./icons/home.svg";
import { ReactComponent as HorizontalLines4 } from "./icons/horizontalLines4.svg";
import { ReactComponent as HorizontalLines3 } from "./icons/horizontalLines3.svg";
import { ReactComponent as Tools } from "./icons/tools.svg";
import { ReactComponent as Hierarchy } from "./icons/hierarchy.svg";
import { ReactComponent as Search } from "./icons/search.svg";
import { ReactComponent as Filter } from "./icons/filter.svg";
import { ReactComponent as Caret } from "./icons/caret.svg";
import { ReactComponent as CaretOutline } from "./icons/caret_outline.svg";
import { ReactComponent as Inbox } from "./icons/inbox.svg";
import { ReactComponent as PersonMultiple } from "./icons/person_multiple.svg";
import { ReactComponent as Bell } from "./icons/bell.svg";
import { ReactComponent as Close } from "./icons/close.svg";
import { ReactComponent as Person } from "./icons/person.svg";
import { ReactComponent as Help } from "./icons/help.svg";
import { ReactComponent as Phone } from "./icons/phone.svg";
import { ReactComponent as AlarmClock } from "./icons/alarm_clock.svg";
import { ReactComponent as Files } from "./icons/files.svg";
import { ReactComponent as Calendar } from "./icons/calendar.svg";
import { ReactComponent as SmallCheck } from "./icons/check_small.svg";
import { ReactComponent as PlusSign } from "./icons/add_sign.svg";
import { ReactComponent as Gear } from "./icons/gear.svg";
import { ReactComponent as Avatar } from "./icons/avatar.svg";
import { ReactComponent as Ellipse } from "./icons/ellipse.svg";
import { ReactComponent as Logout } from "./icons/logout.svg";
import { ReactComponent as Email } from "./icons/email.svg";
import { ReactComponent as LiveChat } from "./icons/livechat.svg";
import { ReactComponent as Pencil } from "./icons/pencil.svg";
import { ReactComponent as DocText } from "./icons/doctext.svg";
import { ReactComponent as DownChevron } from "./icons/ddown_chevorn.svg";
import { ReactComponent as Avatar2 } from "./icons/avatar2.svg";

import { ReactComponent as Refresh } from "./icons/refresh.svg";
import { ReactComponent as Folder } from "./icons/folder.svg";
import { ReactComponent as PhotoPlaceholder } from "./icons/photo_placeholder.svg";
import { ReactComponent as Excel } from "./icons/excel.svg";
import { ReactComponent as PDF } from "./icons/pdf.svg";
import { ReactComponent as Reading } from "./icons/reading.svg";
import { ReactComponent as DocumentList } from "./icons/document_list.svg";
import { ReactComponent as RightArrowSmall } from "./icons/right_arrow_small.svg";
import { ReactComponent as Print } from "./icons/print.svg";
import { ReactComponent as CSV } from "./icons/csv.svg";
import { ReactComponent as LoadingAnimated } from "./icons/loading_animated.svg";


import Box from "./components-dev/BoxExtended";

export const XNGICONS = {
  Alert: Alert,
  Files: Files,
  Calendar: Calendar,
  ChatBubbles: ChatBubbles,
  Grid4X4: Grid4X4,
  XLogs_X: XLogs_X,
  Commander: Commander,
  Home: Home,
  FourHorizontalLines: HorizontalLines4,
  ThreeHorizontalLines: HorizontalLines3,
  Tools: Tools,
  Hierarchy: Hierarchy,
  Hamburger: HorizontalLines3,
  Search: Search,
  Filter: Filter,
  Folder,
  Caret: Caret,
  CaretOutline: CaretOutline,
  Inbox: Inbox,
  People: PersonMultiple,
  PhotoPlaceholder: PhotoPlaceholder,
  Bell: Bell,
  Close: Close,
  Person: Person,
  Help: Help,
  Phone: Phone,
  AlarmClock: AlarmClock,
  SmallCheck: SmallCheck,
  PlusSign: PlusSign,
  Gear: Gear,
  Avatar: Avatar,
  Ellipse: Ellipse,
  Logout,
  Email,
  LiveChat,
  Pencil,
  DocText,
  DownChevron,
  Refresh,
  Avatar2,
  PDF,
  Excel,
  Reading,
  DocumentList,
  RightArrowSmall,
  Print,
  CSV,
  LoadingAnimated
};

export type XNGIconSize = "xl" | "lg" | "md" | "sm" | "xs" | "caret" | string;
function getSize(sz: XNGIconSize) {
  switch (sz) {
    case "xl":
      return "55px";
    case "lg":
      return "30px";
    case "md":
      return "22px";
    case "sm":
      return "20px";
    case "xs":
      return "14px";
    case "caret":
      return "8px";
    default:
      return sz;
  }
}
interface IXNGIcon {
  color?: string;
  size: XNGIconSize;
  i: JSX.Element;
  onClick?: any;
  disableRenderer?: boolean;
  left?: boolean;
  right?: boolean;
  up?: boolean;
  down?: boolean;
}
export function XNGIconRenderer(props: IXNGIcon) {
  const size = getSize(props.size);
  const dir = props.down ? 90 : props.left ? 180 : props.up ? 270 : 0;

  return (
    <Box
      sx={{
        display: "flex" + "!important",
        justifyContent: "center" + "!important",
        alignItems: "center" + "!important",
        minWidth: size + "!important",
        minHeight: size + "!important",
        transform: `rotate(${dir}deg)` + "!important",
        svg: {
          width: size + "!important",
          height: size + "!important",
          color: props.color,
          "*": props.disableRenderer
            ? {
                stroke: props.color + "!important",
              }
            : {
                stroke: props.color + "!important",
                strokeWidth: 0 + "!important",
                fill: props.color + "!important",
              },
        },
        maxWidth: size + "!important",
        maxHeight: size + "!important",
      }}
      onClick={props.onClick}
    >
      {props.i}
    </Box>
  );
}

export function getSxRecolorChildXNGIcons(color: string) {
  return {
    svg: {
      color: color + "!important",
      "*": {
        stroke: color + "!important",
        fill: color + "!important",
      },
    },
  };
}
