import { useState } from "react";
import { Box, Divider, Stack } from "@mui/material";
import { Outlet, useNavigate } from "react-router";
import { UnpostedSessionsFilter } from "./containers/header/unposted_sessions_filter";
import PageTitle from "./components/header/page_title";
import PaddedWrapper from "./components/common/padded_wrapper";
import useUnpostedSessionsCtx from "./hooks/context/useUnpostedSessionsCtx";
import ArrowLabelBtn from "./components/common/arrow_label_btn";
import { XNGICONS, XNGIconRenderer } from "../../design/icons";
import { ROUTES_XLOGS } from "../../constants/URLs";
import XNGButton from "./batch-post/components/common/xng-button";
import DlgBatchPostAlert from "./components/dialog/dlg_batch_post_alert";

/**
 * Renders the layout for the Unposted Sessions view.
 * @returns JSX.Element
 */
const UnpostedSessionsLayout = () => {
  const navigate = useNavigate();
  const inNotator = useUnpostedSessionsCtx().routeState.notator.inNotator;
  const unpostedSessionsCount =
    useUnpostedSessionsCtx().selectedFilterData.selectedFilter.sessions?.length;
  const [openAlert, setOpenAlert] = useState<boolean>(false);

  return (
    <Box
      position={"relative"}
      sx={{
        overflowY: "auto",
        overflowX: "hidden",
      }}
    >
      <Stack height={"calc(100vh - 64px)"}>
        <Box>
          <PaddedWrapper>
            <Stack
              alignItems={"center"}
              sx={{
                flexDirection: {
                  direction: "column",
                  sm: "row",
                },
                gap: {
                  xs: 1,
                  md: 4,
                },
                paddingY: {
                  xs: 2,
                  sm: 4,
                },
                alignItems: "center",
                justifyContent: "space-between",
              }}
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
                    md: 4,
                  },
                  paddingY: {
                    xs: 2,
                    sm: 4,
                  },
                  alignItems: "center",
                }}
              >
                {inNotator && (
                  <ArrowLabelBtn
                    label="Back To Session List"
                    icon={
                      <XNGIconRenderer i={<XNGICONS.CaretOutline />} size="xs" left color="white" />
                    }
                    start
                    onClick={() => navigate(ROUTES_XLOGS.unposted_sessions.home)}
                  />
                )}
                <PageTitle title="Unposted Sessions" count={unpostedSessionsCount || 0} />
              </Stack>
              <XNGButton onClick={() => setOpenAlert(true)}>Batch Posting</XNGButton>
            </Stack>
            <UnpostedSessionsFilter />
          </PaddedWrapper>
          <Divider />
        </Box>
        <Box flexGrow={1} sx={{ overflow: "auto" }}>
          <Outlet />
        </Box>
      </Stack>
      <DlgBatchPostAlert open={openAlert} onClose={() => setOpenAlert(false)} />
    </Box>
  );
};

export default UnpostedSessionsLayout;
