import { Box, Typography } from "@mui/material";
import React from "react";
import ServiceAreaGraph from "./views/ServiceAreaGraph";
import CustomCircularProgressBar from "./views/CustomCircularProgress";
import { useApi } from "../../context/apiContext";

// Introduced a Custom Circular Progress Bar and Service Area Graph

const ReimbursementbyServiceArea = () => {
  const { apiValue } = useApi();

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        boxShadow: 5,
        borderRadius: "10px",
        paddingY: 3,
        width: "1600px",
        height: "496px",
      }}
    >
      <Typography variant="h6" fontWeight={"bold"}>Reimbursement by Service Area</Typography>
      <ServiceAreaGraph />

      <Box sx={{ display: "flex", gap: 3.3, marginLeft: 5 }}>
        {apiValue?.serviceAreaReimbursementReports?.map((item) => {
          return (
            <CustomCircularProgressBar
              key={item.accountDistrictID}
              value={(item?.progress || 0) * 100}
              size={90}
              thickness={6}
            />
          );
        })}
      </Box>
    </Box>
  );
};

export default ReimbursementbyServiceArea;
