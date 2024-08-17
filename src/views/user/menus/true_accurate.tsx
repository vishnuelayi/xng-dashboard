import { ElectronicSignature } from "../../../profile-sdk";
import Box from "../../../design/components-dev/BoxExtended";
import XNGButton from "../../../design/low-level/button";
import { STATEMENT_TRUE_AND_ACCURATE_DATA_AUTHORIZATION } from "../../registration_flow/user_onboarding/statements";
import { Dialog, Typography } from "@mui/material";
import { getSizing } from "../../../design/sizing";
import dayjs from "dayjs";
import XNGClose from "../../../design/low-level/button_close";

function TrueAndAccurateModal(props: {
  trueAndAccurateModalCheck: boolean;
  setTrueAndAccurateModal: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  return (
    <Dialog
      maxWidth="sm"
      open={props.trueAndAccurateModalCheck}
      onClose={() => props.setTrueAndAccurateModal(false)}
    >
      <Box sx={{ width: "100%", padding: getSizing(2) }}>
        <Box
          sx={{
            position: "absolute",
            top: "1rem",
            right: "1rem",
          }}
        >
          <XNGClose onClick={() => props.setTrueAndAccurateModal(false)} />
        </Box>
        <Typography variant="h5">True & Accurate Data Authorization</Typography>
        <Box sx={{ paddingY: getSizing(2) }}>{STATEMENT_TRUE_AND_ACCURATE_DATA_AUTHORIZATION}</Box>
        <Box sx={{ marginBottom: getSizing(3), marginTop: getSizing(2) }}></Box>
        <Box sx={{ display: "flex", width: "100%", justifyContent: "flex-end" }}>
          <XNGButton
            onClick={() => {
              props.setTrueAndAccurateModal(false);
            }}
            disabled
          >
            Confirmed
          </XNGButton>
        </Box>
      </Box>
    </Dialog>
  );
}

export default TrueAndAccurateModal;
