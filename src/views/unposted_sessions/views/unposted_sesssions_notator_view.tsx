import React from "react";
import useUnpostedSessionsCtx from "../hooks/context/useUnpostedSessionsCtx";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Stack,
  Typography,
} from "@mui/material";
import { XNGICONS, XNGIconRenderer } from "../../../design/icons";
import usePalette from "../../../hooks/usePalette";
import ArrowLabelBtn from "../components/common/arrow_label_btn";
import { Outlet, useNavigate } from "react-router";
import { ROUTES_XLOGS } from "../../../constants/URLs";

const UnpostedSesssionsNotatorView = () => {
  const setInNotator = useUnpostedSessionsCtx().routeState.notator.setInNotator;
  const palette = usePalette();

  const [accordionExpanded, setAccordionExpanded] = React.useState(true);
  
  const setSelectedSessionIndex = useUnpostedSessionsCtx().selectedFilterData.updateSelectedFilterSessionIndex;
  const selectedSessionIndex = useUnpostedSessionsCtx().selectedFilterData.selectedFilter.sessionIndex;
  
  const filteredsessions = useUnpostedSessionsCtx().selectedFilterData.selectedFilter.sessions;
  
  const filteredCards = useUnpostedSessionsCtx().selectedFilterData.selectedFilter.sessionCards;
  const filteredProviders = useUnpostedSessionsCtx().selectedFilterData.selectedFilter.providers;
  
  const navigate = useNavigate();
  
  const selectedSession = filteredsessions?.[selectedSessionIndex || 0];

  const [triggerUpdate, setTriggerUpdate] = React.useState(0);

  // console.log("selectedSession", selectedSession);

  React.useEffect(() => {
    setInNotator(true);
    return () => {
      setInNotator(false);
    };
  }, [setInNotator]);

  React.useEffect(()=>{

    const sessionProviderId = Object.keys(filteredCards || {}).find((key) => {
      return filteredProviders?.find((p) => p.id === key);
    })

    // const selectedSession = filteredsessions?.[selectedSessionIndex || 0];

    if (!sessionProviderId) {
      navigate(ROUTES_XLOGS.unposted_sessions.home)
      return;
    }

    navigate(
      ROUTES_XLOGS.unposted_sessions.home +
        "/notator/" +
        `${selectedSession?.id}?serviceProviderId=${sessionProviderId}&seriesId=${selectedSession?.seriesId}&date=${selectedSession?.startTime}`,
    )
  }, [filteredCards, filteredProviders, navigate, selectedSession?.id, selectedSession?.seriesId, selectedSession?.startTime])

  // React.useEffect(() => {
  //   setSelectedSession(filteredsessions?.[selectedSessionIndex || 0]);
  // }, [filteredsessions, selectedSessionIndex]);

  React.useEffect(() => {
    const timoute = setTimeout(() => {
      setTriggerUpdate(Math.random());
    }, 10);
    
    return () => {
      clearTimeout(timoute);
    };
  }, [selectedSessionIndex]);

  return (
    <Box>
      <Accordion square expanded={accordionExpanded} onChange={(e, value)=> setAccordionExpanded(value)}>
        <AccordionSummary
          expandIcon={
            <XNGIconRenderer i={<XNGICONS.CaretOutline />} size="xs" up />
          }
        >
          <Stack
            alignItems={"center"}
            sx={{
              flexDirection: {
                direction: "column",
                sm: "row",
              },
              gap: {
                xs: 1,
                md: 3,
              },
              paddingY: {
                xs: 2,
                sm: 0,
              },
            }}
          >
            <Typography fontWeight={600} fontSize={"16px"}>
              Currently Viewing Session:
            </Typography>
            <Box
              sx={{ backgroundColor: palette.primary[4], borderRadius: "3px", px:1, color: palette.contrasts[2] }}
            >
              <Typography sx={{ fontSize: "12px", padding: "4px" }}>
              <Box component={"span"}>{selectedSession?.title || "no session"}</Box>
              {" | "}
              <Box component={"span"}>
                {new Date(selectedSession?.startTime || Date.now())?.toLocaleString("en-US", {
                  timeStyle: "short",
                  dateStyle: "short",
                })}
              </Box>
              </Typography>
            </Box>
            <Stack direction={"row"} fontSize={"12px"}>
              <ArrowLabelBtn
                label="View Previous Unposted Session"
                icon={
                  <XNGIconRenderer
                    i={<XNGICONS.CaretOutline />}
                    size="xs"
                    left
                    color={palette.primary[1]}
                  />
                }
                start
                variant="text"
                color="primary"
                size="small"
                onClick={(e)=>{
                  e.stopPropagation();
                  setSelectedSessionIndex(-1);
                }}
              />
              <ArrowLabelBtn
                label="View Next Unposted Session"
                icon={
                  <XNGIconRenderer
                    i={<XNGICONS.CaretOutline />}
                    size="xs"
                    right
                    color={palette.primary[1]}
                 
                  />
                }
                end
                variant="text"
                color="primary"
                size="small"
                onClick={(e)=>{
                  e.stopPropagation();
                  setSelectedSessionIndex(1);
                }}
              />
            </Stack>
          </Stack>
        </AccordionSummary>
        <AccordionDetails sx={{
          overflowY: "scroll",
          px: 0,
        }}>
          {/* filteredCards, filteredProviders, filteredsessions, navigate, selectedSessionIndex */}
          {selectedSession && <Outlet key={`${triggerUpdate}`}/>}
        </AccordionDetails>
      </Accordion>
    </Box>
  );
};

export default UnpostedSesssionsNotatorView;
