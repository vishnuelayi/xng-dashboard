import { Box, Stack, Typography } from "@mui/material";
import React from "react";
import usePalette from "../../../../../../hooks/usePalette";
import { ServiceProviderRef } from "../../../../../../profile-sdk";
import { useXNGSelector } from "../../../../../../context/store";
import { selectServiceProviderProfile } from "../../../../../../context/slices/loggedInClientSlice";

type Props = {
  serviceProvider: ServiceProviderRef | undefined;
  totalUnpostedSessionsCount: number;
  filteredUnpostedSessionsCount: number;
}

const UnpostedSessionCardHeader = (props:Props) => {
  const palette = usePalette();
  const loggedInProviderId = useXNGSelector(selectServiceProviderProfile)?.id;
  return (
    <Box
      p={2}
      sx={{
        border: "1px solid " + palette.contrasts[3],
        borderRadius: 1,
        // marginBottom:2,
      }}
    >
      <Box mb={2}>
        <Typography variant="h6" fontWeight={600}>
          {loggedInProviderId === props.serviceProvider?.id ?  "My Sessions" : `${props.serviceProvider?.firstName} ${props.serviceProvider?.lastName}`}
        </Typography>
      </Box>
      <Stack gap={1} alignItems={"center"}>
        <Typography variant="h3">{props.filteredUnpostedSessionsCount}</Typography>
        <Typography variant="body1">filtered sessions</Typography>
        <Typography variant="body1" fontWeight={700}>
          Total Unposted: {props.totalUnpostedSessionsCount}
        </Typography>
      </Stack>
    </Box>
  );
};

export default UnpostedSessionCardHeader;
