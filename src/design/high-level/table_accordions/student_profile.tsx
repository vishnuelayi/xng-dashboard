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
import { StudentProfileRow } from "./student_profile_types";
import Box from "../../components-dev/BoxExtended";
import XNGAvatar from "../../low-level/avatar";
import { getSizing } from "../../sizing";
import XNGTable from "../../low-level/table";
import usePalette from "../../../hooks/usePalette";
import { CaseloadStudentDisplay } from "../../../profile-sdk";
import { DAYJS_FORMATTER_DONTUSE } from "../../../views/students/_";
import dayjs from "dayjs";
import { addStudentGradeSuffix } from "../../../utils/add_student_grade_suffix";

interface ITableAccordion_StudentProfile {
  rows: CaseloadStudentDisplay[];
  accordionBreakpoint: Breakpoint;
}

// Refactor to use Fortitude Accordion. Provide correct formatted data
// Refactor to use Fortitude Table.

function TableAccordion_StudentProfile({
  rows,
  accordionBreakpoint,
}: ITableAccordion_StudentProfile) {
  const theme = useTheme<Theme>();
  const isAccordionView = useMediaQuery(theme.breakpoints.down(accordionBreakpoint));
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const palette = usePalette();

  const handleRowClick = (studentId: string) => {
    setExpandedRow(studentId === expandedRow ? null : studentId);
  };

  return isAccordionView ? (
    <>
      {rows.map((row) => (
        <Accordion
          disableGutters
          key={row.id}
          expanded={row.studentIdGivenByState === expandedRow}
          onChange={() => handleRowClick(row.studentIdGivenByState!)}
        >
          <AccordionSummary expandIcon={<XNGIconRenderer down i={<XNGICONS.Caret />} size="md" />}>
            <Typography>{row.firstName + " " + row.lastName}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
              DOB: {dayjs(row.dateOfBirth).format(DAYJS_FORMATTER_DONTUSE)} | Grade:{" "}
              {addStudentGradeSuffix(row.grade!.valueOf())} | School:{" "}
              {row.activeSchoolCampuses!.length > 0 ? row.activeSchoolCampuses![0].name : "campus"}{" "}
              | Plan of Care: {row.activePlanOfCare?.type ? row.activePlanOfCare.type : "IEP"} |
              Plan of Care Duration:{" "}
              {dayjs(row.activePlanOfCare?.startDate).format(DAYJS_FORMATTER_DONTUSE)} -{" "}
              {dayjs(row.activePlanOfCare?.endDate).format(DAYJS_FORMATTER_DONTUSE)} | Progress:{" "}
              {50}
            </Typography>
          </AccordionDetails>
        </Accordion>
      ))}
    </>
  ) : (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Student Name</TableCell>
            <TableCell>DOB</TableCell>
            <TableCell>Grade</TableCell>
            <TableCell>School</TableCell>
            <TableCell>Plan of Care</TableCell>
            <TableCell>Student ID</TableCell>
            <TableCell>Plan of Care Duration</TableCell>
            <TableCell>Progress</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row: CaseloadStudentDisplay) => (
            <TableRow key={row.id} onClick={() => handleRowClick(row.studentIdGivenByState!)}>
              <TableCell sx={{ display: "flex", alignItems: "center", gap: getSizing(1) }}>
                <XNGAvatar size="sm" text={row.firstName![0] + row.lastName![0]} />
                <Typography>{row.firstName + " " + row.lastName}</Typography>
              </TableCell>
              <TableCell>{dayjs(row.dateOfBirth).format(DAYJS_FORMATTER_DONTUSE)}</TableCell>
              <TableCell>{addStudentGradeSuffix(row.grade!.valueOf())}</TableCell>
              <TableCell>
                {row.activeSchoolCampuses!.length > 0
                  ? row.activeSchoolCampuses![0].name
                  : "school"}
              </TableCell>
              <TableCell>
                {row.activePlanOfCare?.type ? row.activePlanOfCare.type : "IEP"}
              </TableCell>
              <TableCell>{row.studentIdGivenByState}</TableCell>
              <TableCell>
                {dayjs(row.activePlanOfCare?.startDate).format(DAYJS_FORMATTER_DONTUSE) +
                  " - " +
                  dayjs(row.activePlanOfCare?.endDate).format(DAYJS_FORMATTER_DONTUSE)}
              </TableCell>
              <TableCell>
                <XNGProgress progress={50} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default TableAccordion_StudentProfile;
