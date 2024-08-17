import Box from "../../../../components-dev/BoxExtended";
import { getSizing } from "../../../../sizing";
import { Typography } from "@mui/material";
import { XNGICONS, XNGIconRenderer } from "../../../../icons";
import { MainMenuV1 } from "../_main_menu_components";
import usePalette from "../../../../../hooks/usePalette";
import { useMemo } from "react";
import useZohodeskChatbox from "../../../../hooks/use_zohodesk_chatbox";

export default function HelpSlideContent() {
  const palette = usePalette();

  const raiseAbugBtn = useMemo(() => document.getElementById("atlwdg-trigger"), []);

  const zohoDeskChatbox = useZohodeskChatbox();

  return (
    <MainMenuV1.Wrapper>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: getSizing(1),
        }}
      >
        <MainMenuV1.HeaderTypography>Help</MainMenuV1.HeaderTypography>

        <MainMenuV1.IconButton
          onClick={() => window.open("https://msbsconnect.zendesk.com/hc/en-us", "_blank")}
          overline="Resource Center"
          i={<XNGIconRenderer size="md" i={<XNGICONS.DocText />} />}
        >
          <Typography variant="body1">
            User Guides, Video Tutorials, and FAQs. <a>View here</a>
          </Typography>
        </MainMenuV1.IconButton>

        <MainMenuV1.IconButton
          onClick={() =>
            window.open(
              "https://docs.google.com/forms/d/e/1FAIpQLSdOc8diLtAV_jDE2sjNazeb-GuPUHGhe4tHOkgnB9_8FFNtaw/viewform",
              "_blank",
            )
          }
          overline="Workshop Sign In"
          i={<XNGIconRenderer size="md" i={<XNGICONS.Pencil />} />}
        >
          <Typography variant="body1">
            Receive certification for your workshop attendance. <a>Sign in</a>
          </Typography>
        </MainMenuV1.IconButton>

        <MainMenuV1.IconButton
          onClick={() =>{
            zohoDeskChatbox.show();
          } }
          overline="Client Care"
          i={<XNGIconRenderer size="md" i={<XNGICONS.ChatBubbles />} />}
        >
          <Typography variant="body1">
            Reach out to Client Care Specialists for assistance.
            <br />
            Mon - Fri | 7:00 AM to 4:30 PM CST
            <br />
            <a>Connect with us</a>
          </Typography>
        </MainMenuV1.IconButton>

        <MainMenuV1.IconButton
          onClick={() => raiseAbugBtn?.click()}
          overline="Report an Issue"
          i={<XNGIconRenderer size="md" color={palette.contrasts[1]} i={<XNGICONS.Alert />} />}
        >
          <Typography variant="body1">
            If you are experiencing an issue with X Logs, please report it <a>here</a>
          </Typography>
        </MainMenuV1.IconButton>
      </Box>
    </MainMenuV1.Wrapper>
  );
}
