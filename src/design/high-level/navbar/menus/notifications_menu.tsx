import { FormControl, Select, Typography } from "@mui/material";
import Box from "../../../components-dev/BoxExtended";
import { getSizing } from "../../../sizing";
import XNGToggle from "../../../low-level/button_toggle";
import XNGClose from "../../../low-level/button_close";
// import { DistrictAccessRequest } from "./notification_types";
import isToday from "dayjs/plugin/isToday";
import isYesterday from "dayjs/plugin/isYesterday";
import relativeTime from "dayjs/plugin/relativeTime";
import dayjs from "dayjs";
import { useState } from "react";
import { INotification } from "../types";
import {
  DistrictAccessRequest,
  NotificationResponseType,
  NotificationType,
  ProxyPostAccessRequest,
  RespondToRequestForAccessToPost,
  RespondToRequestForDistrictAccessRequest,
  RoleAssignments,
  UserRef,
} from "../../../../profile-sdk";
import { API_USERS } from "../../../../api/api";
import { useXNGSelector } from "../../../../context/store";
import { selectClientID } from "../../../../context/slices/loggedInClientSlice";
import { selectStateInUS } from "../../../../context/slices/stateInUsSlice";
import {
  selectLoggedInClientAssignment,
  selectUser,
} from "../../../../context/slices/userProfileSlice";
import { XLogsRoleStrings } from "../../../../context/types/xlogsrole";
import XNGSelect from "../../../low-level/dropdown";
import { NotificationItem } from "../notifications/NotificationItem";
import { ApproveDistrictAccessModal } from "../notifications/ApproveDistrictAccessModal";
import { ConstructRoleAssignmentsFromXLogsRoleEnumOrString } from "../../../../utils/xlogs_role_mapper";
dayjs.extend(isToday);
dayjs.extend(isYesterday);
dayjs.extend(relativeTime);

interface INotificationsMenu {
  notifications: INotification[];
  onClose: () => void;
  fetchAndSetNotifications: () => Promise<void>;
}

function NotificationsMenu(props: INotificationsMenu) {
  const [showOnlyUnread, setShowOnlyUnread] = useState<boolean>(false);

  return (
    <Box sx={{ width: getSizing(50) }}>
      <Header
        showOnlyUnread={showOnlyUnread}
        onToggleShowOnlyUnread={() => setShowOnlyUnread(!showOnlyUnread)}
        onClose={() => props.onClose()}
      />
      <Content
        showOnlyUnread={showOnlyUnread}
        notifications={props.notifications}
        fetchAndSetNotifications={props.fetchAndSetNotifications}
      />
    </Box>
  );
}

interface IHeader {
  onToggleShowOnlyUnread: () => void;
  showOnlyUnread: boolean;
  onClose: () => void;
}
function Header(props: IHeader) {
  return (
    <Box
      name="Header"
      sx={{
        display: "flex",
        justifyContent: "space-between",
        paddingLeft: getSizing(2),
        paddingRight: getSizing(1),
        paddingY: getSizing(0.5),
      }}
    >
      <Box name="Header | LEFT" sx={{ display: "flex", alignItems: "center" }}>
        <Typography variant="h6" className="noselect">
          Notifications
        </Typography>
      </Box>
      <Box name="Header | RIGHT" sx={{ display: "flex", alignItems: "center" }}>
        <Typography variant="body2" className="noselect">
          Show Only Unread
        </Typography>
        <XNGToggle value={props.showOnlyUnread} onToggle={() => props.onToggleShowOnlyUnread()} />
        <XNGClose onClick={() => props.onClose()} size="modal" />
      </Box>
    </Box>
  );
}

function Content(props: {
  notifications: INotification[];
  showOnlyUnread: boolean;
  fetchAndSetNotifications: () => Promise<void>;
}) {
  // SELECTORS
  const loggedInClientId = useXNGSelector(selectClientID);
  const state = useXNGSelector(selectStateInUS);
  const loggedInClientAssignment = useXNGSelector(selectLoggedInClientAssignment);
  const serviceProviderOfUser = loggedInClientAssignment.serviceProviderProfile;
  const userProfile = useXNGSelector(selectUser);

  // STATE
  const [showApproveDistrictAccessModal, setShowApproveDistrictAccessModal] =
    useState<boolean>(false);
  const [selectedDistrictAccessRequest, setSelectedDistrictAccessRequest] =
    useState<DistrictAccessRequest>();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  async function responseYesToProxyAccessRequest(notification: ProxyPostAccessRequest) {
    const request: RespondToRequestForAccessToPost = {
      notificationId: notification.id,
      message: `${serviceProviderOfUser?.firstName} ${serviceProviderOfUser?.lastName} has allowed access to post in their account.`,
      responseType: NotificationResponseType.NUMBER_0,
      //HACK: The sdk needs to be updated to take in the requestedServiceProviderId, and RespondingServiceProvider, but for now the
      // requestingUserId, and the RespondingUser fields of the request are used as if they're the service provider, so we'll incorrectly
      // fill the user fields with the user's serviceProvider info.
      //"207be8f0-6343-492d-9c84-0fef51b635d4"
      requestedUserId: notification.requestingUser?.id,
      respondingUser: { ...notification.notifiedServiceProvider, hasGrantedAccessToPost: true },
    };
    await API_USERS.v1UsersRequestProxyAccessToPostRespondPost(loggedInClientId!, state, request);
  }

  async function onYesClickOfProxyAccessRequest(notification: ProxyPostAccessRequest) {
    await responseYesToProxyAccessRequest(notification);
    await markNotificationAsRead(notification.id!, notification.partitionKey!, state);
    await props.fetchAndSetNotifications();
    setIsLoading(false);
  }

  async function responseNoToProxyAccessRequest(notificationId: string) {
    const request: RespondToRequestForAccessToPost = {
      notificationId: notificationId,
      message: `${serviceProviderOfUser?.firstName} ${serviceProviderOfUser?.lastName} has denied your access to post in their account.
      You may attempt to request access again at any time.`,
      responseType: NotificationResponseType.NUMBER_1,
      //HACK: The sdk needs to be updated to take in the requestedServiceProviderId, and RespondingServiceProvider, but for now the
      // requestingUserId, and the RespondingUser fields of the request are used as if they're the service provider, so we'll incorrectly
      // fill the user fields with the user's serviceProvider info.
      requestedUserId: serviceProviderOfUser?.id,
      respondingUser: serviceProviderOfUser,
    };
    await API_USERS.v1UsersRequestProxyAccessToPostRespondPost(loggedInClientId!, state, request);
  }

  async function onNoClickOfProxyAccessRequest(notification: DistrictAccessRequest) {
    await responseNoToProxyAccessRequest(notification.id!);
    await markNotificationAsRead(notification.id!, notification.partitionKey!, state);
    await props.fetchAndSetNotifications();
    setIsLoading(false);
  }

  async function onYesClickOfDistrictAccessRequest(notification: DistrictAccessRequest) {
    // console.log("Yes clicked!");
    setSelectedDistrictAccessRequest(notification);
    setShowApproveDistrictAccessModal(true);
    await markNotificationAsRead(notification.id!, notification.partitionKey!, state);
    await props.fetchAndSetNotifications();
  }

  async function respondYesToDistrictAccessRequest(
    notification: DistrictAccessRequest,
    role: XLogsRoleStrings,
  ) {
    // console.log("YES");
    const district = notification.requestedDistrictAssignment?.district;
    const request: RespondToRequestForDistrictAccessRequest = {
      districtId: district?.id,
      clientId: loggedInClientId,
      message: `You have been granted access to ${district?.name}.`,
      notificationId: notification.id!,
      respondingUser: {
        email: userProfile?.emailAddress,
        firstName: userProfile?.firstName,
        lastName: userProfile?.lastName,
        id: userProfile?.id,
      } as UserRef,
      responseType: NotificationResponseType.NUMBER_0,
      roleAssignments: ConstructRoleAssignmentsFromXLogsRoleEnumOrString(role),
    };
    await API_USERS.v1UsersRequestAccessToDistrictRespondPost(state, request);
  }

  async function respondNoToDistrictAccessRequest(
    notification: DistrictAccessRequest,
    role: XLogsRoleStrings,
  ) {
    // console.log("NO");
    const district = notification.requestedDistrictAssignment?.district;
    const request: RespondToRequestForDistrictAccessRequest = {
      districtId: district?.id,
      clientId: loggedInClientId,
      message: `You have been denied access to ${district?.name}.`,
      notificationId: notification.id!,
      respondingUser: {
        email: userProfile?.emailAddress,
        firstName: userProfile?.firstName,
        lastName: userProfile?.lastName,
        id: userProfile?.id,
      } as UserRef,
      responseType: NotificationResponseType.NUMBER_1,
      roleAssignments: ConstructRoleAssignmentsFromXLogsRoleEnumOrString(role),
    };
    await API_USERS.v1UsersRequestAccessToDistrictRespondPost(state, request);
  }

  async function onNoClickOfDistrictAccessRequest(notification: DistrictAccessRequest) {
    await respondNoToDistrictAccessRequest(notification, "Service Provider - Autonomous");
    await markNotificationAsRead(notification.id!, notification.partitionKey!, state);
    await props.fetchAndSetNotifications();
  }

  async function markNotificationAsRead(notificationId: string, partionKey: string, state: string) {
    await API_USERS.v1UsersNotificationsNotificationIdReadPatch(notificationId, partionKey, state);
    await props.fetchAndSetNotifications();
  }
  // RENDERER SWITCH CASE
  function renderNotificationItem(n: INotification, i: number): JSX.Element {
    // console.log("Rendering Notification: ", n);
    switch (n.type) {
      case NotificationType.NUMBER_0: // Proxy Access to Post Request
        return (
          <NotificationItem
            key={i}
            text={n.message ?? ""}
            date={dayjs(n.created)}
            unread={n.read === undefined || n.read === null}
            onYes={() => {
              onYesClickOfProxyAccessRequest(n);
              setIsLoading(true);
            }}
            onNo={() => {
              onNoClickOfProxyAccessRequest(n);
              setIsLoading(true);
            }}
            onRead={() => markNotificationAsRead(n.id, n.partitionKey, state)}
            response={n.response?.message}
            isLoading={isLoading}
          />
        );
      case NotificationType.NUMBER_2: // District Access Request
        return (
          <NotificationItem
            key={i}
            text={n.message ?? ""}
            date={dayjs(n.created)}
            unread={n.read === undefined || n.read === null}
            onYes={() => onYesClickOfDistrictAccessRequest(n)}
            onNo={() => {
              onNoClickOfDistrictAccessRequest(n);
              setIsLoading(true);
            }}
            onRead={() => markNotificationAsRead(n.id, n.partitionKey, state)}
            response={n.response?.message}
            requestingUser={`${n.requestingUser.firstName} ${n.requestingUser.lastName}`}
            isLoading={isLoading}
          />
        );
      case NotificationType.NUMBER_3 || NotificationType.NUMBER_4 || NotificationType.NUMBER_5:
        return (
          <NotificationItem
            key={i}
            text={n.message ?? ""}
            date={dayjs(n.created)}
            unread={n.read === undefined || n.read === null}
            onRead={() => markNotificationAsRead(n.id, n.partitionKey, state)}
          />
        );
      default:
        return (
          <NotificationItem
            key={i}
            text={n.message ?? ""}
            date={dayjs(n.created)}
            unread={n.read === undefined || n.read === null}
            onRead={() => markNotificationAsRead(n.id, n.partitionKey, state)}
          />
        );
    }
  }

  // NOTIFICATION ARRAYS (Today, Yesterday, Older)
  const TWO_DAYS_AGO = dayjs().subtract(2, "days");
  // console.log('notifications', props.notifications)
  const todayNotifications = props.notifications
    .filter(
      (n: INotification) =>
        dayjs(n.created).isToday() &&
        (props.showOnlyUnread ? n.read === undefined || n.read === null : true),
    )
    .reverse();
  // console.log("Today's Notifications: ", todayNotifications);

  const yesterdayNotifications = props.notifications
    .filter(
      (n: INotification) =>
        dayjs(n.created).isYesterday() &&
        (props.showOnlyUnread ? n.read === undefined || n.read === null : true),
    )
    .reverse();
  // console.log("Yesterday's Notifications: ", yesterdayNotifications);

  const olderNotifications = props.notifications
    .filter(
      (n: INotification) =>
        dayjs(n.created).isBefore(TWO_DAYS_AGO) &&
        (props.showOnlyUnread ? n.read === undefined || n.read === null : true),
    )
    .reverse();
  // console.log("Older Notifications: ", olderNotifications);
  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          paddingBottom: getSizing(2),
          maxHeight: "80vh",
          overflow: "auto",
        }}
      >
        <Typography
          display={todayNotifications.length > 0 ? "inline-block" : "none"}
          sx={{ marginTop: getSizing(1), marginLeft: getSizing(2) }}
          variant="overline"
          className="noselect"
        >
          TODAY
        </Typography>
        {todayNotifications.map((n: INotification, i) => renderNotificationItem(n, i))}
        <Typography
          display={yesterdayNotifications.length > 0 ? "inline-block" : "none"}
          sx={{ marginTop: getSizing(1), marginLeft: getSizing(2) }}
          variant="overline"
          className="noselect"
        >
          YESTERDAY
        </Typography>
        {yesterdayNotifications.map((n: INotification, i) => renderNotificationItem(n, i))}
        <Typography
          display={olderNotifications.length > 0 ? "inline-block" : "none"}
          sx={{ marginTop: getSizing(1), marginLeft: getSizing(2) }}
          variant="overline"
          className="noselect"
        >
          OLDER
        </Typography>
        {olderNotifications.map((n: INotification, i) => renderNotificationItem(n, i))}
      </Box>
      <ApproveDistrictAccessModal
        handleDone={(role: XLogsRoleStrings) => {
          respondYesToDistrictAccessRequest(selectedDistrictAccessRequest!, role);
          props.fetchAndSetNotifications();
        }}
        districtAccessRequest={selectedDistrictAccessRequest}
        setShowApproveDistrictAccessModal={(show: boolean) =>
          setShowApproveDistrictAccessModal(show)
        }
        showApproveDistrictAccessModal={showApproveDistrictAccessModal}
      />
    </>
  );
}

export default NotificationsMenu;
