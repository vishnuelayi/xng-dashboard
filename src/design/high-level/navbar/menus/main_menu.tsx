import { XNGICONS, XNGIconRenderer } from "../../../icons";
import VerticalTabs from "../../../low-level/tabs_vertical";
import { getSizing } from "../../../sizing";
import { Typography } from "@mui/material";
import { useState } from "react";
import { XNGStandardTab } from "../../../types/xngStandardTab";
import { XNGSlideView } from "../../../components-dev/slide_view";
import { SingleActionModal } from "../../../modal_templates/single_action";
import ProfileSlideContent from "./profile/_profile_menu";
import ContactUsSlideContent from "./contact_us/_contact_menu";
import ConfirmModal from "../../../modal_templates/confirm";
import HelpSlideContent from "./help/_help_menu";
import UnpostedSessionsSlideContent from "../../../../views/unposted_sessions/containers/navProfileMenu/unposted_session_slide_content";
import Box from "../../../components-dev/BoxExtended";
import { useXNGSelector } from "../../../../context/store";
import usePalette from "../../../../hooks/usePalette";
import logoutRedirect from "../../../../utils/logout_redirect";

enum SlideView {
  _DEFAULT,
  MyProfileView,
  UnpostedSessions,
  ContactUs,
  Help,
  Logout,
}

function MainMenuContent(props: { onClose: () => void }) {
  // STATES
  const [slideInView, setSlideInView] = useState<SlideView>(SlideView._DEFAULT);
  const [comingSoonOpen, setComingSoonOpen] = useState<boolean>(false);
  const [confirmLogoutOpen, setConfirmLogoutOpen] = useState<boolean>(false);

  // HOOKS
  const slides = useGenerateSlides({
    setSlideInView: setSlideInView,
    onSetComingSoonOpen: () => setComingSoonOpen(true),
    onRequestLogout: () => setConfirmLogoutOpen(true),
    onClose: props.onClose
  });

  return (
    <>
      {/* MODALS */}
      <SingleActionModal
        open={comingSoonOpen}
        onClose={() => setComingSoonOpen(false)}
        useTemplate="coming soon"
      />
      <ConfirmModal
        open={confirmLogoutOpen}
        onClose={() => setConfirmLogoutOpen(false)}
        onConfirm={() => {
          logoutRedirect()
        }}
        injectContent={{
          titleText: "Log out of X Logs",
          body: (
            <Typography variant="body1">
              You are about to log out of X Logs and will have to sign back in. Do you want to
              continue?
            </Typography>
          ),
          noText: "No, take me back",
          yesText: "Yes, log out",
        }}
      />

      {/* DOM HIERARCHY */}
      <XNGSlideView
        slides={slides}
        currentSlideID={slideInView}
        onDefaultCurrentSlideID={() => setSlideInView(0)}
        useBackButtons
      />
    </>
  );
}

export default MainMenuContent;

function useGenerateSlides(props: {
  setSlideInView: (i: number) => void;
  onSetComingSoonOpen: () => void;
  onRequestLogout: () => void;
  onClose: () => void;
}) {
  const { setSlideInView, onSetComingSoonOpen, onClose } = props;

  const unpostedSessionsCountResponse  = useXNGSelector(state => state.unpostedSessionsSlice.unpostedSessionsCountResponse);
  const palette = usePalette();
  // Create tabs for default slide
  const defaultSlideTabs: XNGStandardTab[] = [
    {
      icon: <XNGIconRenderer size="md" i={<XNGICONS.Person />} />,
      label: "My Profile",
      onClick: () => setSlideInView(SlideView.MyProfileView),
    },
    {
      icon: <XNGIconRenderer size="md" i={<XNGICONS.AlarmClock />} />,
      label: (
        <Typography variant="body2">
          Un-Posted Sessions <Box sx={{ color: palette.primary[2] }} component={"span"}>{unpostedSessionsCountResponse?.totalUnpostedCount && `(${unpostedSessionsCountResponse?.totalUnpostedCount})`}</Box>
          {/* {unpostedSessionsCount > 0 && (
            <Typography display="inline" variant="body2">
              {" (" + unpostedSessionsCount + ")"}
            </Typography>
          )} */}
        </Typography>
      ),
      onClick: () => {
        setSlideInView(SlideView.UnpostedSessions);
      },
    },
    {
      icon: <XNGIconRenderer size="md" i={<XNGICONS.Phone />} />,
      label: "Contact Us",
      onClick: () => {
        // window.open(
        //   "https://static.zdassets.com/web_widget/latest/liveChat.html?v=10#key=msbsconnect.zendesk.com",
        //   "_blank"
        // );
        setSlideInView(SlideView.ContactUs);
      },
    },
    {
      icon: <XNGIconRenderer size="md" i={<XNGICONS.Help />} />,
      label: "Help",
      onClick: () => {
        // ON CLICK SHOW ISSUE COLLECTOR POP UP
        // raiseAbugBtn?.click();
        setSlideInView(SlideView.Help);
      },
    },
    {
      icon: <XNGIconRenderer size="md" i={<XNGICONS.Logout />} />,
      label: "Log out",
      onClick: () => props.onRequestLogout(),
    },
  ];

  // Finally, return
  return [
    {
      id: SlideView._DEFAULT,
      content: <VerticalTabs displayCarets minWidth={getSizing(45)} tabs={defaultSlideTabs} />,
    },
    {
      id: SlideView.MyProfileView,
      content: <ProfileSlideContent />,
    },
    {
      id: SlideView.UnpostedSessions,
      content: <UnpostedSessionsSlideContent unpostedSessionsCount={unpostedSessionsCountResponse} onClose={onClose}/>,
    },
    {
      id: SlideView.ContactUs,
      content: <ContactUsSlideContent />,
    },
    {
      id: SlideView.Help,
      content: (
        <>
          <HelpSlideContent />
        </>
      ),
    },
  ];
}
