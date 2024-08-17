import React from "react";
import { useXNGSelector } from "../../../context/store";
import PaddedWrapper from "../components/common/padded_wrapper";
import UnpostedSessionsList from "../components/lists/unposted_sessions_list";
import Typography from "@mui/material/Typography";
import { Box } from "@mui/material";
import XNGSpinner from "../../../design/low-level/spinner";
import usePalette from "../../../hooks/usePalette";

const UnpostedSessionsView = () => {
  const mappedCards = useXNGSelector(
    (state) => state.unpostedSessionsSlice.unpostedSessionsMappedCards,
  );
  const response = useXNGSelector((state) => state.unpostedSessionsSlice.slimSessionCardsResponse);

  const unpostedSessionsAvaiable = React.useMemo(() => {
    return response && mappedCards;
  }, [mappedCards, response]);

  const palette = usePalette();

  return (
    <PaddedWrapper fullHeight sx={{ pt: 1 }}>
      {unpostedSessionsAvaiable ? (
        <UnpostedSessionsList />
      ) : (
        <Box
          height={"100%"}
          display={"flex"}
          flexDirection={"column"}
          alignItems={"center"}
          justifyContent={"center"}
          gap={3}
        >
          <XNGSpinner />
          <Typography variant="h5" color={palette.primary[1]} textAlign={"center"}>
            Loading unposted sessions...
          </Typography>
        </Box>
      )}
    </PaddedWrapper>
  );
};

export default UnpostedSessionsView;
