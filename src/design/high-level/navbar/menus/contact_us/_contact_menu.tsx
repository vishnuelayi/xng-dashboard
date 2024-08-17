import Box from "../../../../components-dev/BoxExtended";
import { getSizing } from "../../../../sizing";
import { Typography } from "@mui/material";
import { XNGICONS, XNGIconRenderer } from "../../../../icons";
import { MainMenuV1 } from "../_main_menu_components";
import React from "react";
import useZohodeskChatbox from "../../../../hooks/use_zohodesk_chatbox";

export default function ContactUsSlideContent() {
  const zohoDeskChatbox = useZohodeskChatbox();

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: getSizing(1),
      }}
    >
      <MainMenuV1.HeaderTypography>Contact Us</MainMenuV1.HeaderTypography>

      <MainMenuV1.IconButton
        href="tel:+17372201813;ext=1813"
        overline="Phone"
        i={<XNGIconRenderer size="md" i={<XNGICONS.Phone />} />}
      >
        <Typography variant="body1">+1 (737) 220-1813 (Ext 1813)</Typography>
      </MainMenuV1.IconButton>

      <MainMenuV1.IconButton
        onClick={() => {
          zohoDeskChatbox.show();
        }}
        overline="Live Chat"
        i={<XNGIconRenderer size="md" i={<XNGICONS.LiveChat />} />}
      >
        <Typography variant="body1">
          Click <a>here</a> to chat with one of our agents!
        </Typography>
      </MainMenuV1.IconButton>

      <MainMenuV1.IconButton
        href="mailto: clientcare@msbconnect.com"
        overline="Email"
        i={<XNGIconRenderer size="md" i={<XNGICONS.Email />} />}
      >
        <Typography variant="body1">clientcare@msbconnect.com</Typography>
      </MainMenuV1.IconButton>
    </Box>
  );
}
