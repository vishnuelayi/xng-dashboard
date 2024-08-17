import { useNavigationBlocker } from "./hooks/use_navigation_blocker";
import usePalette from "../../../hooks/usePalette";
import { Typography } from "@mui/material";
import { XNGIconRenderer, XNGICONS } from "../../../design/icons";
import { DualActionModal } from "../dual_action";
import localStorageKeys from "../../../constants/localStorageKeys";

const CURRENT_SESSION_KEY = localStorageKeys.CURRENT_SESSION_KEY;

export default function BlockNavigationModal(props: {
  dirty: boolean;
  editedSession: any;
  session: any;
  setIsDirty: React.Dispatch<React.SetStateAction<boolean>>;
  bypass: boolean;
  confirmAction: () => void;
}) {
  const { editedSession, setIsDirty, dirty, bypass, confirmAction } = props;
  const palette = usePalette();

  const noop = () => {};
  const navigationBlocker = useNavigationBlocker(props.dirty);
  const comparison = JSON.stringify(editedSession) !== localStorage.getItem(CURRENT_SESSION_KEY);

  if (bypass && navigationBlocker.proceed) {
    navigationBlocker.proceed();
    localStorage.removeItem(editedSession.id!);
  }
  if (!bypass && comparison) {
    setIsDirty(true);
  } else {
    setIsDirty(false);
  }

  return (
    <DualActionModal
      open={dirty && navigationBlocker.state === "blocked"}
      onClose={navigationBlocker.reset || noop}
      onConfirm={() => {
        confirmAction();
        window.onbeforeunload = function () {};
        (navigationBlocker.proceed && navigationBlocker.proceed()) || noop();
      }}
      onReject={() => {
        localStorage.removeItem(editedSession.id!);
        window.onbeforeunload = function () {};
        (navigationBlocker.proceed && navigationBlocker.proceed()) || noop();
      }}
      injectContent={{
        header: "Attention",
        body: (
          <Typography variant="body1">
            You have not saved your changes. Would you like to save your progress before you leave
            this page?
          </Typography>
        ),
        noText: "No",
        yesText: "Yes",
        icon: <XNGIconRenderer color={palette.danger[4]} size="2rem" i={<XNGICONS.Alert />} />,
        buttonStyles: {
          yesButton: {
            width: "102px",
            padding: "8px",
            borderRadius: "3px",
          },
          noButton: {
            width: "102px",
            padding: "8px",
            borderRadius: "3px",
            ":hover": {
              bgcolor: palette.danger[1],
              color: "white",
            },
            bgcolor: palette.danger[4],
            color: "white",
          },
        },
      }}
    />
  );
}
