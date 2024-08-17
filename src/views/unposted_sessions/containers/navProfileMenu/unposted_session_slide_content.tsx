import { Stack, Typography } from "@mui/material";
import { MainMenuV1 } from "../../../../design/high-level/navbar/menus/_main_menu_components";
import { XNGICONS, XNGIconRenderer } from "../../../../design/icons";
import usePalette from "../../../../hooks/usePalette";
import { useNavigate } from "react-router";
import { ROUTES_XLOGS } from "../../../../constants/URLs";
import { GetUnpostedSessionCountResponse } from "../../../../session-sdk";
import React from "react";
import { useXNGDispatch, useXNGSelector } from "../../../../context/store";
import { selectLoggedInClientAssignment } from "../../../../context/slices/userProfileSlice";
import { selectServiceProviderProfile } from "../../../../context/slices/loggedInClientSlice";
import { unpostedSessionsActions } from "../../../../context/slices/unpostedSessionsSlice";

type Props = {
  unpostedSessionsCount: GetUnpostedSessionCountResponse | undefined;
  onClose: () => void;
};

/**
 * Renders the content of the unposted sessions slide in the navigation menu.
 * @returns JSX element that displays the unposted sessions slide content.
 */
const UnpostedSessionsSlideContent = (props: Props) => {
  const palette = usePalette();
  const navigate = useNavigate();
  const dispatch = useXNGDispatch();
  const { onClose } = props;

  const myUnpostedCount = props.unpostedSessionsCount?.myUnpostedCount;
  const assistantUnpostedCount = props.unpostedSessionsCount?.assistantUnpostedCount;
  const dataEntryUnpostedCount = props.unpostedSessionsCount?.dataEntryUnpostedCount;

  const serviceProvider = useXNGSelector(selectServiceProviderProfile);
  const appointingServiceProviders = useXNGSelector(selectLoggedInClientAssignment)
    ?.appointingServiceProviders; //providers you're posting on behalf of as a DEC
  const supervisedServiceProviders = useXNGSelector(selectLoggedInClientAssignment)
    ?.supervisedServiceProviders; //providers documenting on your behalf as Assistants

  //   const appointingServiceProvidersIds = React.useMemo(
  //     () => appointingServiceProviders?.map((provider) => provider?.id),
  //     [appointingServiceProviders],
  //   );
  //   const supervisedServiceProvidersIds = React.useMemo(
  //     () => supervisedServiceProviders?.map((provider) => provider?.id),
  //     [supervisedServiceProviders],
  //   );

  const getMainMenuTextColor = (count: number | undefined) => {
    if (count && count > 0) {
      return palette.danger[4];
    }
    return palette.primary[1];
  };

  const getMainMenuTextIcon = (count: number | undefined): React.ReactNode => {
    if (count && count > 0) {
      return <XNGIconRenderer size="lg" i={<XNGICONS.AlarmClock />} color={palette.danger[4]} />;
    }
    return <XNGIconRenderer size="md" i={<XNGICONS.SmallCheck />} color={palette.primary[1]} />;
  };

  return (
    <Stack>
      {/* Header */}
      <MainMenuV1.HeaderTypography>Unposted Sessions</MainMenuV1.HeaderTypography>

      {/* My Sessions */}
      <MainMenuV1.IconButton
        onClick={() => {
          dispatch(
            unpostedSessionsActions.setSelectedUnpostedFilterFromMainMenu({
              filter:{
                providers: [
                    {
                      id: serviceProvider?.id || "",
                      name: `${serviceProvider?.firstName} ${serviceProvider?.lastName}`,
                    },
                  ],
              },
              fromMainMenu: true,
            }),
          );
          navigate(ROUTES_XLOGS.unposted_sessions.home);
          onClose();
        }}
        overline="MY SESSIONS"
        i={getMainMenuTextIcon(myUnpostedCount)}
      >
        <Typography
          variant="body1"
          sx={{ textDecoration: "underline", fontWeight: 700 }}
          color={getMainMenuTextColor(myUnpostedCount)}
        >
          {myUnpostedCount || 0} Sessions due
        </Typography>
      </MainMenuV1.IconButton>

      {/* My Assistant Sessions */}
      <MainMenuV1.IconButton
        onClick={() => {
          dispatch(
            unpostedSessionsActions.setSelectedUnpostedFilterFromMainMenu({
              filter:{
                providers:
                supervisedServiceProviders?.map((provider) => {
                  return {
                    id: provider?.id || "",
                    name: `${provider?.firstName} ${provider?.lastName}`,
                  };
                }) || [],  
            },
            fromMainMenu: true,
            }),
          );
          navigate(ROUTES_XLOGS.unposted_sessions.home);
          onClose();
        }}
        overline="MY ASSISTANT SESSIONS"
        i={getMainMenuTextIcon(assistantUnpostedCount)}
      >
        <Typography
          variant="body1"
          sx={{ textDecoration: "underline", fontWeight: 700 }}
          color={getMainMenuTextColor(assistantUnpostedCount)}
        >
          {assistantUnpostedCount || 0} Sessions due
        </Typography>
      </MainMenuV1.IconButton>

      {/* My Data Entry Sessions */}
      <MainMenuV1.IconButton
        onClick={() => {
          //  { state: { ids:appointingServiceProvidersIds} }
          dispatch(
            unpostedSessionsActions.setSelectedUnpostedFilterFromMainMenu({
              filter:{
                providers:
                appointingServiceProviders?.map((provider) => {
                  return {
                    id: provider?.id || "",
                    name: `${provider?.firstName} ${provider?.lastName}`,
                  };
                }) || [],
              },
              fromMainMenu: true,
            }),
          );
          navigate(ROUTES_XLOGS.unposted_sessions.home);
          onClose();
        }}
        overline="MY DATA ENTRY SESSIONS"
        i={getMainMenuTextIcon(dataEntryUnpostedCount)}
      >
        <Typography
          variant="body1"
          sx={{ textDecoration: "underline", fontWeight: 700 }}
          color={getMainMenuTextColor(dataEntryUnpostedCount)}
        >
          {dataEntryUnpostedCount || 0} Sessions due
        </Typography>
      </MainMenuV1.IconButton>
    </Stack>
  );
};

export default UnpostedSessionsSlideContent;
