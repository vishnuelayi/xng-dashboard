import { Box, Typography } from '@mui/material'
import React from 'react'
import OnClickProgressBar from './views/OnClickProgressBar'
import BarChart from './views/BarChart'

const FiveYearBillingSummary = () => {
  return (
    <Box
    sx={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      boxShadow: 5,
      borderRadius: "10px",
      paddingY: 2,
      paddingX: 3,
      width: "1000px",
      height: "568px",
    }}
  >
    <Typography variant="h6" fontWeight={"bold"} sx={{ paddingTop: "16px" }}>
      5 Year Billing Summary
    </Typography>
    <Box sx={{ display: "flex", width: "100%" }}>
      <OnClickProgressBar />
      <BarChart />
    </Box>
  </Box>
  )
}

export default FiveYearBillingSummary
