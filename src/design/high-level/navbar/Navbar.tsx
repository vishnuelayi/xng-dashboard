import { useState, useEffect, useMemo } from "react";
import usePalette from "../../../hooks/usePalette";
import Box from "../../components-dev/BoxExtended";
import { XNGStandardTab } from "../../types/xngStandardTab";
import { ReactComponent as XLogsLogoSvg } from "../../svgs/logo.svg";
import TransparentTabs from "../../low-level/tabs_transparent";
import { IconButton, Typography, useTheme } from "@mui/material";
import DropdownIndicator from "../../low-level/dropdown_indicator";
import { XNGMenu, XNGMenuAnchorBox } from "../../components-dev/xng_menu";
import { XNGICONS, XNGIconRenderer } from "../../icons";
import MediaQueryBox from "../../components-dev/MediaQueryBox";
import { ROUTES_XLOGS } from "../../../constants/URLs";
import { useNavigate } from "react-router";
import { getSizing } from "../../sizing";
import { BOX_SHADOWS } from "../../styles/boxShadow";
import NotificationsMenu from "./menus/notifications_menu";
import MainMenuContent from "./menus/main_menu";
import { INotification } from "./types";
import { selectClientID } from "../../../context/slices/loggedInClientSlice";
import {
  selectLoggedInClientAssignment,
  selectUser,
  setUserResponse,
} from "../../../context/slices/userProfileSlice";
import { placeholderForFutureLogErrorText } from "../../../temp/errorText";
import { selectStateInUS } from "../../../context/slices/stateInUsSlice";
import { XNGNonformSelect } from "../../low-level/form_select";
import { breakpointUtils } from "../../../utils/breakpointUtils";
import XNGAvatar from "../../low-level/avatar";
import { useXNGDispatch, useXNGSelector } from "../../../context/store";
import { ClientRef, PatchClientAssignmentRequest, PatchUserRequest } from "../../../profile-sdk";
import { API_USERS } from "../../../api/api";
import {
  selectDataEntryProvider,
  setDataEntryProvider,
} from "../../../context/slices/dataEntryProvider";
import { CurrentDataEntryProviderMenu } from "./menus/proxy_menu";
import REPORTS_VIEWS_HEADER_TITLE from "../../../views/reports/constants/reports_views_header_title";
import { isLoggedInUserCookieExpired } from "../../../utils/cookies";
import usePath from "../../../hooks/use_path";
import useUnpostedSessionsCountApi from "../../../views/unposted_sessions/hooks/api/useUnpostedSessionsCountApi";
import logoutRedirect from "../../../utils/logout_redirect";
import ZINDEX_LAYERS from "../../../constants/zIndexLayers";
import produce from "immer"

export const NAVBAR_HEIGHT = getSizing(8);

function Navbar() {
  // REDUX SELECTORS
  const dataEntryProvider = useXNGSelector(selectDataEntryProvider);
  const reportingActive = useXNGSelector((state) => state.featureFlags.flags["ReportingActive"]);
  const loggedInClientAssignment = useXNGSelector(selectLoggedInClientAssignment);
  const isAdminUser =
    loggedInClientAssignment.isDelegatedAdmin || loggedInClientAssignment.isExecutiveAdmin;

  // HOOKS
  const palette = usePalette();
  const dispatch = useXNGDispatch();
  const selectedTabIndex = useSelectedTabIndexBasedOnPath();

  // SELECTORS
  const loggedInClientId = useXNGSelector(selectClientID);
  const userProfile = useXNGSelector(selectUser);
  const state = useXNGSelector(selectStateInUS);

  // MENUS STATES
  const [myProfileOpen, setMainMenuOpen] = useState<boolean>(false);
  const [myProfileAnchorEl, setMyProfileAnchorEl] = useState<HTMLElement | null>(null);
  const [notificationsAnchorEl, setNotificationsAnchorEl] = useState<HTMLElement | null>(null);
  const [notificationsOpen, setNotificationsOpen] = useState<boolean>(false);
  const [dataEntryProviderOpen, setDataEntryProviderOpen] = useState<boolean>(false);
  const [dataEntryProviderAnchorEl, setActingServiceProviderAnchorEl] =
    useState<HTMLElement | null>(null);

  const refetchUnpostedSessions = useXNGSelector(
    (state) => state.unpostedSessionsSlice.refetchUnpostedSessions,
  );
  useUnpostedSessionsCountApi(state, userProfile?.id, loggedInClientId, refetchUnpostedSessions);

  //
  const firstNameInitial = dataEntryProvider?.firstName?.charAt(0) ?? "";
  const lastNameInitial = dataEntryProvider?.lastName?.charAt(0) ?? "";
  const actingServiceProviderInitials = firstNameInitial + lastNameInitial;

  // API - NOTIFICATIONS //
  // -- State
  const [notifications, setNotifications] = useState<INotification[]>([]);
  // -- API Request
  async function fetchAndSetNotifications() {
    if (isLoggedInUserCookieExpired()) {
      logoutRedirect();
    }

    // console.log("BEGINNING FETCH NOTIFICATIONS")
    const userServiceProviderId = loggedInClientAssignment?.serviceProviderProfile?.id;
    // console.log("userServiceProviderId: ", userServiceProviderId);
    const userId = userProfile?.id;
    // console.log("userId: ", userId);
    var districtIds;
    if (loggedInClientAssignment.isExecutiveAdmin || loggedInClientAssignment.isDelegatedAdmin) {
      // TODO: We'll need to update this to send all districtIds that the user is authorized in for this client.
      districtIds = loggedInClientAssignment?.authorizedDistricts?.map((ad) => ad.id).join(",");
    }
    // console.log("districtIds: ", districtIds);
    if (userServiceProviderId === undefined) throw Error(placeholderForFutureLogErrorText);
    if (userId === undefined) throw Error(placeholderForFutureLogErrorText);
    if (loggedInClientId === undefined) throw Error(placeholderForFutureLogErrorText);

    const response = await API_USERS.v1UsersNotificationsGet(
      userId,
      userServiceProviderId,
      loggedInClientId,
      state,
      districtIds,
    );
    const notifications: INotification[] = [];
    response.districtAccessRequestNotifications?.forEach((dar) =>
      notifications.push(dar as INotification),
    );
    response.serviceProviderNotifications?.forEach((spn) =>
      notifications.push(spn as INotification),
    );
    response.userNotifications?.forEach((un) => notifications.push(un as INotification));
    // console.log(notifications);
    setNotifications(notifications);
  }
  // -- Polling System
  useEffect(() => {
    fetchAndSetNotifications();
    const interval = setInterval(() => {
      fetchAndSetNotifications();
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const reFetchUserOnNotificationUpdate = async () => {
      //re-fetch user response in order to update redux user slice with latest updated properties
      const userResponse = await API_USERS.v1UsersIdGet(userProfile?.id || "", state);
      if (JSON.stringify(userResponse) !== JSON.stringify(userProfile)) {
        dispatch(setUserResponse(userResponse));
        if (process.env.REACT_APP_BRANCH === "local") console.log("Updated user profile");
        // console.log("Updated user profile")
      }
    };

    reFetchUserOnNotificationUpdate();
  }, [notifications]);

  // -- reorganize later
  const [unreadNotificationsCount, setUnreadNotificationsCount] = useState<number>(0);
  useEffect(() => {
    setUnreadNotificationsCount(
      notifications.filter((n: INotification) => n.read === undefined || n.read === null).length,
    );
  }, [notifications]);

  async function removeProviderFromProxyCaseload(serviceProviderId: string) {
    const proxyCaseload = loggedInClientAssignment.appointingServiceProviders;
    proxyCaseload?.splice(
      proxyCaseload.findIndex((sp) => sp.id === serviceProviderId),
      1,
    );
    const request: PatchClientAssignmentRequest = {
      appointingServiceProviders: proxyCaseload,
    };
    const response = await API_USERS.v1UsersIdClientAssignmentsClientIdPatch(
      userProfile!.id!,
      loggedInClientId!,
      state,
      request,
    );
    setUserResponse(response);
  }

  // REORGANIZE LATER
  const stateInUs = useXNGSelector(selectStateInUS);
  const navigate = useNavigate();
  const [clientReferences, setClientReferences] = useState<ClientRef[]>([]);
  useEffect(() => {
    fetchAndSetClientReferences();

    async function fetchAndSetClientReferences() {
      try {
        const res: ClientRef[] = [];
        userProfile!.clientAssignments!.forEach((ca) => {
          if (ca!.authorizedDistricts!.length > 0) {
            res.push(ca.client as ClientRef);
          }
        });

        setClientReferences(res);
      } catch (e) {
        throw new Error(placeholderForFutureLogErrorText);
      }
    }
  }, []);

  // TODO: Review this logic with Paul. Should we even read 'isSuperAdmin' or this an abstraction of
  // the user's assigned multiple roles as readable from the `loggedInClientAssignment`?
  const isSuperAdmin = userProfile?.isSuperAdmin;
  const isMSBAdmin = userProfile?.isMsbAdmin;
  const shouldShowAdminTab = useMemo(
    () =>
      loggedInClientAssignment.isDelegatedAdmin ||
      loggedInClientAssignment.isExecutiveAdmin ||
      userProfile?.isSuperAdmin ||
      userProfile?.isMsbAdmin,
    [isSuperAdmin, isMSBAdmin, userProfile],
  );

  const tabs = useMemo(() => {
    let res: XNGStandardTab[] = [
      {
        label: "calendar",
        navTo: ROUTES_XLOGS.calendar,
      },
      {
        label: "students",
        navTo: ROUTES_XLOGS._students.manager,
      },
    ];

    if (reportingActive) {
      res.push({
        label: "reports",
        navTo: ROUTES_XLOGS.reports.index + REPORTS_VIEWS_HEADER_TITLE.staticReports,
        target: "_blank",
      });
    }

    if (shouldShowAdminTab) {
      res.push({
        label: "admin",
        navTo: ROUTES_XLOGS._admin.userApproval,
      });
    }

    return res;
  }, [isAdminUser, shouldShowAdminTab, reportingActive]);

  // DOM HIERARCHY
  return (
    <>
      {/* MENUS */}

      <XNGMenu
        anchorEl={notificationsAnchorEl}
        open={notificationsOpen}
        onClose={() => setNotificationsOpen(false)}
        content={
          <NotificationsMenu
            notifications={notifications}
            onClose={() => setNotificationsOpen(false)}
            fetchAndSetNotifications={fetchAndSetNotifications}
          />
        }
      />
      <XNGMenu
        anchorEl={myProfileAnchorEl}
        open={myProfileOpen}
        onClose={() => setMainMenuOpen(false)}
        content={<MainMenuContent onClose={() => setMainMenuOpen(false)} />}
      />
      <XNGMenu
        anchorEl={dataEntryProviderAnchorEl}
        open={dataEntryProviderOpen}
        onClose={() => setDataEntryProviderOpen(false)}
        content={
          <CurrentDataEntryProviderMenu
            setShowMenu={(show) => setDataEntryProviderOpen(show)}
            currentDataEntryProvider={dataEntryProvider ?? {}}
            user={userProfile!}
            onSignOut={() => {
              dispatch(setDataEntryProvider(null));
              setDataEntryProviderOpen(false);
            }}
            onRemove={() => removeProviderFromProxyCaseload(dataEntryProvider!.id!)}
            onBackToProfile={() => {
              dispatch(setDataEntryProvider(null));
              setDataEntryProviderOpen(false);
            }}
          />
        }
      />

      {/* DOM */}
      <Box
        sx={{
          display: "flex",
          width: "100%",
          minHeight: NAVBAR_HEIGHT,
          ...BOX_SHADOWS[0],
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: getSizing(1),
            minWidth: breakpointUtils.greaterThan("sm") ? getSizing(40) : getSizing(10),
          }}
        >
          <XLogsLogo />

          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              paddingTop: getSizing(0.5),
            }}
          >
            {clientReferences[0] !== undefined && (
              <XNGNonformSelect<ClientRef>
                items={clientReferences}
                label=""
                onSelect={(clientRef: ClientRef) => {
                  changeLoggedInClientIDAndRefresh();

                  async function changeLoggedInClientIDAndRefresh() {
                    if (!userProfile) throw new Error(placeholderForFutureLogErrorText);
                    if (!userProfile.id) throw new Error(placeholderForFutureLogErrorText);
                    
                    const patchUserRequest: PatchUserRequest = produce(userProfile, (draft) => {
                      draft.loggedInClientId = clientRef.id;
                    })

                    await API_USERS.v1UsersIdPatch(userProfile.id, stateInUs, patchUserRequest);
                    navigate(0);
                  }
                }}
                getOptionLabel={(i) => i.name}
                defaultValue={
                  clientReferences.find((c) => c.id === userProfile?.loggedInClientId) ??
                  clientReferences[0]
                }
                variant="minimal"
              />
            )}
          </Box>
        </Box>
        <VerticalDivider />
        <TransparentTabs
          useDropdownBreakpoint={{
            breakpoint: 1200,
            selectedValue: selectedTabIndex,
          }}
          value={selectedTabIndex}
          tabs={tabs}
        />

        <Box
          sx={{
            marginLeft: "auto",
            display: "flex",
            height: "100%",
            alignItems: "center",
            paddingRight: getSizing(1),
            gap: getSizing(1),
          }}
        >
          <XNGMenuAnchorBox
            onClickSetAnchorEl={(el) => setNotificationsAnchorEl(el)}
            onClickSetOpen={() => setNotificationsOpen(true)}
            sx={{ display: "block" }}
          >
            <IconButton>
              {unreadNotificationsCount > 0 && (
                <NotificationsBellBadge>{unreadNotificationsCount}</NotificationsBellBadge>
              )}

              <XNGIconRenderer i={<XNGICONS.Bell />} color={palette.contrasts[1]} size="md" />
            </IconButton>
          </XNGMenuAnchorBox>

          {dataEntryProvider && (
            <XNGMenuAnchorBox
              onClickSetAnchorEl={(el) => setActingServiceProviderAnchorEl(el)}
              onClickSetOpen={() => setDataEntryProviderOpen(true)}
              sx={{
                display: "flex",
                alignItems: "center",
                gap: getSizing(1),
                cursor: "pointer",
                padding: getSizing(1),
              }}
            >
              <XNGAvatar useCheckDecoration text={actingServiceProviderInitials} />
              <DropdownIndicator open={dataEntryProviderOpen} />
            </XNGMenuAnchorBox>
          )}
          <XNGMenuAnchorBox
            onClickSetAnchorEl={(el) => setMyProfileAnchorEl(el)}
            onClickSetOpen={() => setMainMenuOpen(true)}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: getSizing(1),
              cursor: "pointer",
              padding: getSizing(1),
            }}
          >
            <XNGAvatar
              variant="outline"
              text={userProfile!.firstName![0]! + userProfile!.lastName![0]!}
            />
            <DropdownIndicator open={myProfileOpen} />
          </XNGMenuAnchorBox>
        </Box>
      </Box>
    </>
  );
}

function VerticalDivider() {
  const palette = usePalette();

  return (
    <Box
      sx={{
        height: "100%",
        alignItems: "center",
        display: "flex",
        marginX: getSizing(3),
      }}
    >
      <Box sx={{ width: "1px", height: "50%", bgcolor: palette.contrasts[3] }} />
    </Box>
  );
}

export default Navbar;

function useSelectedTabIndexBasedOnPath() {
  const path = usePath();

  const [selectedTab, setSelectedTab] = useState<number>(0);

  useEffect(() => {
    const tabPathSegment = path[2];
    switch (tabPathSegment) {
      case "calendar":
        setSelectedTab(0);
        break;
      case "students":
        setSelectedTab(1);
        break;
      case "reports":
        setSelectedTab(2);
        break;
      case "admin":
        setSelectedTab(3);
        break;
    }
  }, [path]);

  return selectedTab;
}

function NotificationsBellBadge(props: Readonly<{ children: React.ReactNode }>) {
  const palette = usePalette();

  return (
    <Box
      sx={{
        position: "absolute",
        top: -3,
        right: -3,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 999,
        bgcolor: palette.danger[2],
        color: palette.contrasts[5],
        px: ".4rem",
        zIndex: 10,
      }}
    >
      <Typography variant="subtitle1">{props.children}</Typography>
    </Box>
  );
}

function XLogsLogo() {
  const theme = useTheme();

  return (
    <>
      <MediaQueryBox
        sx={{ display: "flex", alignItems: "center" }}
        showIf={theme.breakpoints.down("md")}
      >
        <XNGICONS.XLogs_X />
      </MediaQueryBox>
      <MediaQueryBox
        sx={{
          minWidth: "140px",
          maxWidth: "280px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
        showIf={theme.breakpoints.up("md")}
      >
        <XLogsLogoSvg />
      </MediaQueryBox>
    </>
  );
}
