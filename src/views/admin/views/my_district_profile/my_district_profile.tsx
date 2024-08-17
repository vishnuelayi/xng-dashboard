import React, { useEffect, useState } from "react";
import { Box } from "@mui/material";
import AdminHeaderDistrictSelector from "../../common/admin_header_district_selector";
import SidebarLayout from "../../../../layouts/SidebarLayout";
import useSidebarLayoutBtns from "../../constants/sidebar_layout_btns";
import { ADMIN_VISUAL_STANDARD_SPACING } from "../../constants/spacing";
import { DistrictRef } from "../../../../profile-sdk";
import ReimbursementbyServiceArea from "./views/reimbursement-by-service-rea/ReimbursementbyServiceArea";
import ReimbursementGoalTracking from "./views/reimbursement-goal-tracking/ReimbursementGoalTracking";
import FiveYearBillingSummary from "./views/five-year-billing-summary/FiveYearBillingSummary";
import BillingBlock from "./views/billing-blocks/BillingBlock";
import RemittanceData from "./views/remittance-data/RemittanceData";
import ProviderParticipationByServiceCategory from "./views/provider-participation-by-service-category/ProviderParticipationByServiceCategory";

export default function MyDistrictProfile() {
  const sidebarButtons = useSidebarLayoutBtns();
  const [district, setDistrict] = useState<DistrictRef | null>(null);

  const REM_SPACING = "1.5rem";

  return (
    <SidebarLayout
      sidebarContent={sidebarButtons}
      content={
        <Box
          p={REM_SPACING}
          sx={{
            p: ADMIN_VISUAL_STANDARD_SPACING,
            display: "flex",
            flexDirection: "column",
            gap: REM_SPACING,
            width: "1632px",
          }}
        >
          <AdminHeaderDistrictSelector
            onChange={(d) => {
              setDistrict(d);
            }}
          />

          <ReimbursementbyServiceArea />

          <Box sx={{ display: "flex", gap: 3, height: "600px" }}>
            <ReimbursementGoalTracking />
            <FiveYearBillingSummary />
          </Box>

          <Box sx={{ display: "flex", gap: 3, height: "694px" }}>
            <BillingBlock />
            <RemittanceData />
          </Box>

          <ProviderParticipationByServiceCategory/>
        </Box>
      }
    />
  );
}
