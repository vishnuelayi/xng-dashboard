import { useState } from "react";
import { ElectronicSignature } from "../../../profile-sdk";
import Box from "../../../design/components-dev/BoxExtended";
import XNGInput from "../../../design/low-level/input";
import XNGButton from "../../../design/low-level/button";
import { STATEMENT_ELECTRONIC_SIGNATURE_CONSENT } from "../../registration_flow/user_onboarding/statements";
import { Dialog, Typography } from "@mui/material";
import { getSizing } from "../../../design/sizing";
import dayjs from "dayjs";
import XNGClose from "../../../design/low-level/button_close";

function ElectronicSignatureModal(props: {
  electronicSignatureModalCheck: boolean;
  setElectronicSignatureModal: React.Dispatch<React.SetStateAction<boolean>>;
  fullName: string;
}) {
  return (
    <Dialog
      maxWidth="sm"
      open={props.electronicSignatureModalCheck}
      onClose={() => props.setElectronicSignatureModal(false)}
    >
      <Box sx={{ width: "100%", padding: getSizing(2) }}>
        <Box
          sx={{
            position: "absolute",
            top: "1rem",
            right: "1rem",
          }}
        >
          <XNGClose onClick={() => props.setElectronicSignatureModal(false)} />
        </Box>
        <Typography variant="h5">Electronic Signature Consent</Typography>
        <Box sx={{ paddingY: getSizing(2) }}>{STATEMENT_ELECTRONIC_SIGNATURE_CONSENT}</Box>
        <Box sx={{ marginBottom: getSizing(3), marginTop: getSizing(2) }}>
          <XNGInput placeholder="Full Name" disabled={true} defaultValue={props.fullName} />
        </Box>
        <Box sx={{ display: "flex", width: "100%", justifyContent: "flex-end" }}>
          <XNGButton
            onClick={() => {
              props.setElectronicSignatureModal(false);
            }}
            disabled
          >
            Agreed
          </XNGButton>
        </Box>
      </Box>
    </Dialog>
  );
}

export default ElectronicSignatureModal;
