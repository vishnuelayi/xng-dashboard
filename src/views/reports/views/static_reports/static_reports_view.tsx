import { Box, Typography } from "@mui/material";
import GridSectionLayout from "../../../../design/high-level/common/grid_section_layout";
import { XNGICONS } from "../../../../design";
import ReportsLayout from "../../reports_layout";
import useStaticReportsButtons from "./use_static_reports_buttons";

function StaticReportsView() {
  const staticReportsButtons = useStaticReportsButtons();

  return (
    <ReportsLayout title="Static Reports" gutterTop>
      <Box>
        <GridSectionLayout
          headerConfig={{
            title: "Report(s) Manger",
            title_sx: {
              fontSize: 18,
              fontWeight: 700,
            },
          }}
          bottomMargin="3rem"
          rows={[
            {
              fullwidth: true,
              cells: [
                <Typography key={0} sx={{ maxWidth: "790px" }}>
                  The “Report(s) Manager” provides a view of all static reports in one central
                  location. To create and schedule reports, click on the report you would like to
                  generate for insights and metrics on account-wide reporting.
                </Typography>,
              ],
            },
          ]}
        />
        <GridSectionLayout
          headerConfig={{
            title: "Provider / Student Report(s)",
            title_sx: {
              fontSize: 18,
              fontWeight: 700,
            },
            showDivider: true,
            headerStartContent: <XNGICONS.Reading />,
          }}
          rows={[
            {
              fullwidth: true,
              cells: staticReportsButtons,
            },
          ]}
        />
      </Box>
    </ReportsLayout>
  );
}

export default StaticReportsView;
