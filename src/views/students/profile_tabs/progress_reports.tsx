import React from "react";
import TableAccordion_ProgressReports from "../../../design/high-level/table_accordions/profile_progress_reports";
import XNGTable from "../../../design/low-level/table";
import Box from "../../../design/components-dev/BoxExtended";

export type IDirty = {
  ProgressReportDate: string;
  Provider: string;
  Service: string;
  DateFinalized: string;
  ViewDownload: string;
};

export const dirty_sample: IDirty[] = [
  {
    ProgressReportDate: "1/1/1111",
    Provider: "Bob",
    Service: "Inclusion/Resource",
    DateFinalized: "2/2/2222",
    ViewDownload: "wait",
  },
  {
    ProgressReportDate: "1/1/1112",
    Provider: "Bob",
    Service: "Inclusion/Resource",
    DateFinalized: "2/2/2222",
    ViewDownload: "wait",
  },
  {
    ProgressReportDate: "1/1/1113",
    Provider: "Bob",
    Service: "Inclusion/Resource",
    DateFinalized: "2/2/2222",
    ViewDownload: "wait",
  },
  {
    ProgressReportDate: "1/1/1114",
    Provider: "Bob",
    Service: "Inclusion/Resource",
    DateFinalized: "2/2/2222",
    ViewDownload: "wait",
  },
];

function Progress_reports() {
  return (
    <Box>
      <TableAccordion_ProgressReports rows={dirty_sample} accordionBreakpoint="md" />
    </Box>
  );
}

export default Progress_reports;
