import { Box, Button } from "@mui/material";
import React from "react";
import { XNGIconRenderer, XNGICONS } from "../../../../../../design/icons";
import usePalette from "../../../../../../hooks/usePalette";
import { useNavigate } from "react-router";
import { ROUTES_XLOGS } from "../../../../../../constants/URLs";
import { SessionSlimCard } from "../../../../../../session-sdk";
import useUnpostedSessionsCtx from "../../../../hooks/context/useUnpostedSessionsCtx";

type Props = {
  serviceProviderId: string | undefined;
  sessions: SessionSlimCard[];
};

export const UnpostedSessionCardContent = (props: Props) => {
  const palette = usePalette();
  const [expanded, setExpanded] = React.useState(false);

  const navigate = useNavigate();

  const setSelectedIndex =  useUnpostedSessionsCtx().selectedFilterData.updateSelectedFilterSessionIndex;

  const ContentButton = () => {
    return (
      <Button
        variant="text"
        sx={{
          borderBottom: "2px solid " + palette.contrasts[3],
          borderRadius: 0,
          width: "100%",
          display: "flex",
          justifyContent: "end",
          marginBottom: 2,
        }}
        onClick={() => setExpanded((prev) => !prev)}
      >
        <Box
          sx={{
            transform: expanded ? "rotateZ(0deg)" : "rotateZ(180deg)",
            transformOrigin: "center",
            transition: "transform 0.2s ease-in-out",
          }}
        >
          <XNGIconRenderer i={<XNGICONS.DownChevron />} size="small" />
        </Box>
      </Button>
    );
  };

  return (
    <Box
      // bgcolor={"wheat"}
      sx={{
        display: "flex",
        flexDirection: "column",
        flexGrow: 1,
        position: "relative",
        overflowY: "hidden",
      }}
    >
      <ContentButton />
      <Box
        component={"ul"}
        sx={{
          transform: expanded ? "none" : "scaleY(0)",
          transformOrigin: "top",
          transition: "transform 0.2s ease-in-out",
          height: "100%",
          overflowY: "auto",
          flexGrow: 1,
          px: 0,
          gap: 1,
          display: "flex",
          flexDirection: "column",
        }}
        // dense
        // disablePadding
      >
        {props.sessions.map((session, i) => (
          <Box
            component={"li"}
            key={session.id || i}
            // disableGutters

            // sx={{ padding: 0, mb: 1, height: "fit-content", display: "block" }}
          >
            {/* notator/e812acf4-1e4b-44a8-8486-b3232eb55470?serviceProviderId=2982453f-575e-4da1-a842-538839d593dc&seriesId=null&date=2023-09-06T13:00:00Z */}
            <Button
              variant="text"
              onClick={() =>{
                setSelectedIndex(session?.id || "");
                navigate(
                  ROUTES_XLOGS.unposted_sessions.home +
                    "/notator/" +
                    `${session.id}?serviceProviderId=${props.serviceProviderId}&seriesId=${session.seriesId}&date=${session.startTime}`,
                )
              //   navigate(
              //     ROUTES_XLOGS.notator +
              //       `/${session.id}?serviceProviderId=${props.serviceProviderId}&seriesId=${session.seriesId}&date=${session.startTime}`,
              //   )}
              }}
              sx={{
                fontSize: "12px",
                border: "1px solid " + palette.contrasts[3],
                borderRadius: 1,
                color: palette.contrasts[2],
                px: 1,
                py: 0.5,
                cursor: "pointer",
                display: "block",
                height: "fit-content",
                "&:hover": {
                  backgroundColor: palette.primary[4],
                },
                width: "100%",
                alignItems: "flex-start",
                justifyContent: "center",
                whiteSpace: "nowrap",
                textAlign: "left",
                overflow: "hidden",
                textOverflow: "ellipsis",
                wordBreak: "break-all",
              }}
            >
              <Box component={"span"}>{session.title}</Box>
              {" | "}
              <Box component={"span"}>
                {new Date(session.startTime || "")?.toLocaleString("en-US", {
                  timeStyle: "short",
                  dateStyle: "short",
                })}
              </Box>
            </Button>
          </Box>
        ))}
      </Box>
    </Box>
  );
};
