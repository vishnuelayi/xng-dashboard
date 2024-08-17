import { Box, Typography } from '@mui/material'
import BillingDonutChart from './views/BillingDonutChart'

const BillingBlock = () => {
  return (
    <Box
    sx={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      boxShadow: 5,
      borderRadius: "10px",

      paddingX: 3,
      width: "600px",
      height: "694px",
    }}
  >
    <Typography variant="h6" sx={{ paddingBottom: "16px", paddingTop: "16px" }} fontWeight={"bold"}>
      Billing Blocks
    </Typography>
    <BillingDonutChart />
  </Box>
  )
}

export default BillingBlock
