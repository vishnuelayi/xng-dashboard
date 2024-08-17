import { Box, Typography } from "@mui/material";
import React from "react";
import PaidVsGoalChart from "./views/PaidVsGoalChart";
import PaidVsGoalChart2 from "./views/PaidVsGoalChart2";
import ProgressBars from "./views/ProgressBars";

const ReimbursementGoalTracking = () => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        width: "600px",
        boxShadow: 5,
        borderRadius: "10px",
        paddingY: 2,
        height: "568px",
      }}
    >
      <Typography variant="h6" fontWeight={"bold"}>Reimbursement Goal Tracking</Typography>
      <Box sx={{ display: "flex", width: "100%", paddingTop: 2 }}>
        <PaidVsGoalChart />
        <PaidVsGoalChart2 />
      </Box>
      <ProgressBars />
    </Box>
  );
};

export default ReimbursementGoalTracking;
