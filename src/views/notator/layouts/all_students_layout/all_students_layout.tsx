import { useState, useEffect } from "react";
import Box from "../../../../design/components-dev/BoxExtended";
import { NotatorTools } from "../../tools";
import XNGHyperlink from "../../../../design/low-level/hyperlink";
import { Typography } from "@mui/material";
import { StudentRef, DefaultCareProvisionsResponse } from "../../../../profile-sdk";
import { SessionResponse, StudentJournal } from "../../../../session-sdk";
import {
  EditDraftFunctionType,
  ExemptedStudentsFromEditsForFutureSessionsType,
} from "../../tools/types";
import { FutureTabs } from "../../types/types";
import useBreakpointHelper from "../../../../design/hooks/use_breakpoint_helper";
import { StudentAccordion } from "./components/student_accordion";

interface AllStudentsLayoutProps {
  notatorTools?: NotatorTools;
  studentCaseLoadList?: StudentRef[];
  studentJournalList?: StudentJournal[];
  draftSession: SessionResponse;
  editDraftSession: EditDraftFunctionType;
  applyFuture: FutureTabs[][];
  setApplyFuture: React.Dispatch<React.SetStateAction<FutureTabs[][]>>;
  defaultCareProvisions: DefaultCareProvisionsResponse;
  children?: React.ReactNode;
}

function AllStudentsLayout(props: AllStudentsLayoutProps) {
  useEffect(() => {
    const newState: ExemptedStudentsFromEditsForFutureSessionsType = {};
    props.studentJournalList?.forEach((journal, i) => {
      newState[i.toString()] = journal;
    });
    props.notatorTools?.setExemptedStudentsFromEditsForFutureSessions(newState);
  }, []);

  const { isGreaterThanEqualTo } = useBreakpointHelper();
  const needStopgap = !isGreaterThanEqualTo(1293);
  const stopgapMobileNextButtonPositionFixer = needStopgap ? "15.3rem" : "15rem";

  const [expandedStudents, setExpandedStudents] = useState<Number[]>([
    ...props.studentJournalList?.map((student, index) => index)!,
  ]);

  const handleStudentAccordionExpansion = (index: number) => {
    if (expandedStudents.includes(index)) {
      setExpandedStudents(expandedStudents.filter((i) => i !== index));
    } else {
      setExpandedStudents([...expandedStudents, index]);
    }
  };

  const collapseAllStudents = () => {
    setExpandedStudents([]);
  };

  const expandAllStudents = () => {
    const newState: Number[] = [];
    props.studentJournalList?.forEach((student, index) => {
      newState.push(index);
    });
    setExpandedStudents(newState);
  };

  return (
    <Box
      sx={{
        display: "flex",
        height: `calc(100% - ${stopgapMobileNextButtonPositionFixer})`,
        // minHeight: `calc(100% - ${stopgapMobileNextButtonPositionFixer})`,
        flexDirection: "column",
        // backgroundColor: sessionStatusColor,
        // `sessionStatusColor` was a React state that initialized to `undefined`, and was never subsequently
        // set to anything else. It has been removed as part of the V1 notator refactor. To make sure this CSS
        // still behaves the way it did, I've hardcoded it to use `undefined` directly.
        backgroundColor: undefined,
        position: "relative",
        padding: 6,
        overflowY: "auto",
      }}
      id="allStudentViewContainer"
    >
      <Box
        name="overlay"
        sx={{
          display: props.notatorTools?.isSaveSpinnerActive ? "block" : "none",
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          bgcolor: "rgba(0, 0, 0, 0.2)",
          zIndex: 5,
        }}
      />
      <Box sx={{ mb: 4, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        {props.children}
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <XNGHyperlink onClick={expandAllStudents} width="max-content">
            Expand All
          </XNGHyperlink>
          <Typography>/</Typography>
          <XNGHyperlink onClick={collapseAllStudents} width="max-content">
            Collapse All
          </XNGHyperlink>
        </Box>
      </Box>
      {props.studentJournalList?.map((studentJournal, index) => {
        return (
          <StudentAccordion
            studentJournal={studentJournal}
            index={index}
            key={index}
            expanded={expandedStudents.includes(index)}
            handleStudentAccordionExpansion={handleStudentAccordionExpansion}
            draftSession={props.draftSession}
            editDraftSession={props.editDraftSession}
            applyFuture={props.applyFuture}
            setApplyFuture={props.setApplyFuture}
            defaultCareProvisions={props.defaultCareProvisions}
          />
        );
      })}
    </Box>
  );
}

export default AllStudentsLayout;
