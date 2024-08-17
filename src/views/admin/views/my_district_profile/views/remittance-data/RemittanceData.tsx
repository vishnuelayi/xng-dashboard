import { Box, Typography } from '@mui/material'
import React from 'react'
import RemittanceDataTable from './views/RemittanceDataTable'

const RemittanceData = () => {
  return (
    <Box
    sx={{
      width: "1600px",
      height: "694px",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
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
      }}
    >
      Remittance Data
    </Typography>
    <RemittanceDataTable />
  </Box>
  )
}

export default RemittanceData
