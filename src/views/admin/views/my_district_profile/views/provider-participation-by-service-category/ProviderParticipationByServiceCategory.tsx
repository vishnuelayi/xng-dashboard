import { Box, Typography } from "@mui/material";
import React from "react";
import ProviderParticipationTable from "./views/ProviderParticipationTable";

const ProviderParticipationByServiceCategory = () => {
  return (
    <Box
      sx={{
        width: "1600px",
        height: "px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        borderRadius: "10px",
        boxShadow: 5,
        
      }}
    >
      <Typography
        variant="h6"
        textAlign={"center"}
        sx={{
          color: "white",
          bgcolor: "#4a5568",
          p: 2,
          justifyContent: "center",
          borderTopLeftRadius: 8,
          borderTopRightRadius: 8,
          width: "100%",
        }}
      >
        Provider Participation by Service Category
      </Typography>
      <ProviderParticipationTable />
    </Box>
  );
};

export default ProviderParticipationByServiceCategory;
