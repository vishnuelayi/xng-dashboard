import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Avatar,
  Breakpoint,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Theme,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import XNGProgress from "../../low-level/progress";
import { useState } from "react";
import { XNGICONS, XNGIconRenderer } from "../../icons";
import { getSizing } from "../../sizing";
import XNGTable from "../../low-level/table";
import usePalette from "../../../hooks/usePalette";
import { dirty_sample, IDirty } from "../../../views/students/profile_tabs/progress_reports";

interface ITableAccordion_ProgressReports {
  rows: IDirty[];
  accordionBreakpoint: Breakpoint;
}

// Refactor to use Fortitude Accordion. Provide correct formatted data
// Refactor to use Fortitude Table.

function TableAccordion_ProgressReports({
  rows,
  accordionBreakpoint,
}: ITableAccordion_ProgressReports) {
  const theme = useTheme<Theme>();
  const isAccordionView = useMediaQuery(theme.breakpoints.down(accordionBreakpoint));
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const palette = usePalette();

  const handleRowClick = (studentId: string) => {
    setExpandedRow(studentId === expandedRow ? null : studentId);
  };

  return isAccordionView ? (
    <>
      {rows.map((row: IDirty) => (
        <Accordion
          disableGutters
          key={row.ProgressReportDate}
          expanded={row.ProgressReportDate === expandedRow}
          onChange={() => handleRowClick(row.ProgressReportDate)}
        >
          <AccordionSummary expandIcon={<XNGIconRenderer down i={<XNGICONS.Caret />} size="md" />}>
            <Typography>Progress Report Date: {row.ProgressReportDate}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>Provider {row.Provider}</Typography>
            <Typography>Service {row.Service}</Typography>
            <Typography>Date Finalized {row.DateFinalized}</Typography>
            <Typography>View/Download {row.ViewDownload}</Typography>
          </AccordionDetails>
        </Accordion>
      ))}
    </>
  ) : (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Progress Report Dates</TableCell>
            <TableCell>Provider</TableCell>
            <TableCell>Service</TableCell>
            <TableCell>Date Finalized</TableCell>
            <TableCell>View/Download</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row: IDirty) => (
            <TableRow
              key={row.ProgressReportDate}
              onClick={() => handleRowClick(row.ProgressReportDate)}
            >
              <TableCell sx={{ display: "flex", alignItems: "center", gap: getSizing(1) }}>
                <Typography>{row.ProgressReportDate}</Typography>
              </TableCell>
              <TableCell>{row.Provider}</TableCell>
              <TableCell>{row.Service}</TableCell>
              <TableCell>{row.DateFinalized}</TableCell>
              <TableCell>{row.ViewDownload}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default TableAccordion_ProgressReports;
