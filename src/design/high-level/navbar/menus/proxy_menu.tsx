import { AppointingServiceProviderRef, UserResponse } from "../../../../profile-sdk";
import Box from "../../../components-dev/BoxExtended";
import XNGClose from "../../../low-level/button_close";
import { getSizing } from "../../../sizing";
import { Typography } from "@mui/material";
import { checkDecorationSVG } from "../../../svgs/checkDecorationSVG";
import { XNGUserCard_0 } from "./profile/UserCard";
import XNGButton from "../../../low-level/button";

interface ICurrentDataEntryProviderMenu {
  setShowMenu: (show: boolean) => void;
  currentDataEntryProvider: AppointingServiceProviderRef;
  user: UserResponse;
  onSignOut: () => void;
  onRemove: () => void;
  onBackToProfile: () => void;
}
export function CurrentDataEntryProviderMenu(props: ICurrentDataEntryProviderMenu) {
  const CAN_RENDER_CURRERNT_DEP: boolean = props.currentDataEntryProvider?.email !== undefined;

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        width: getSizing(45),
      }}
    >
      <Box
        sx={{
          display: "inline-flex",
          justifyContent: "space-between",
          marginLeft: getSizing(2),
        }}
      >
        <Typography sx={{ marginTop: getSizing(2) }} variant="overline">
          Currently signed in as:
        </Typography>
        <Box sx={{ marginRight: getSizing(1) }}>
          <XNGClose onClick={() => props.setShowMenu(false)} size="modal" />
        </Box>
      </Box>

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          width: "100%",
          paddingY: getSizing(2),
          marginLeft: getSizing(2),
        }}
      >
        {checkDecorationSVG}
        <Typography sx={{ marginLeft: getSizing(2) }} variant="h6">
          {props.currentDataEntryProvider.firstName} {props.currentDataEntryProvider.lastName}
        </Typography>
      </Box>
      <Typography
        sx={{
          marginLeft: getSizing(2),
        }}
        variant="overline"
      >
        DATA ENTRY PROVIDER
      </Typography>

      {CAN_RENDER_CURRERNT_DEP && (
        <XNGUserCard_0
          user={{
            email: props.currentDataEntryProvider?.email!,
            firstName: props.currentDataEntryProvider?.firstName!,
            lastName: props.currentDataEntryProvider?.lastName!,
          }}
          useActions={{
            onRemove: () => {
              props.onRemove();
            },
            onSignIn: () => {},
            onSignOut: () => {
              props.onSignOut();
            },
            signedIn: true,
          }}
        />
      )}

      <Typography
        sx={{
          marginLeft: getSizing(2),
        }}
        variant="overline"
      >
        MAIN ACCOUNT
      </Typography>
      <XNGUserCard_0
        user={{
          firstName: props.user?.firstName!,
          lastName: props.user?.lastName!,
          email: props.user?.emailAddress!,
        }}
      />

      <Box
        sx={{
          display: "inline-flex",
          justifyContent: "right",
          marginRight: getSizing(2),
          marginTop: getSizing(2),
        }}
      >
        <XNGButton onClick={() => props.onBackToProfile()}>Back to Profile</XNGButton>
      </Box>
    </Box>
  );
}
