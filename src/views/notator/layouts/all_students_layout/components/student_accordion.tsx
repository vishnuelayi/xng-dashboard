import { useState } from "react";
import Box from "../../../../../design/components-dev/BoxExtended";
import { AddRationaleModal } from "../../../modals/add_rationale";
import { Accordion, AccordionDetails, AccordionSummary, Typography } from "@mui/material";
import XNGHyperlink from "../../../../../design/low-level/hyperlink";
import AttendanceTabView from "../../../tab-views/attendance";
import { XNGICONS, XNGIconRenderer } from "../../../../../design";
import { getSizing } from "../../../../../design/sizing";
import { SessionResponse, StudentJournal } from "../../../../../session-sdk";
import { DefaultCareProvisionsResponse, NotatorSectionName } from "../../../../../profile-sdk";
import { EditDraftFunctionType } from "../../../tools/types";
import useBreakpointHelper from "../../../../../design/hooks/use_breakpoint_helper";
import SessionTimesTabView from "../../../tab-views/session_times";
import { CareProvisionAccordion } from "./care_provision_accordion";
import { NotatorTools, useNotatorTools } from "../../../tools";
import { FutureTabs, NotatorTab } from "../../../types/types";
import useTemporarySolutionDefaultCareProvisionLists from "../../../temp/use_default_care_provisions";
import ActivitiesTabView from "../../../tab-views/activities";
import AccommodationsTabView from "../../../tab-views/accommodations";
import ModificationsTabView from "../../../tab-views/modifications";
import GoalsObjectivesTabView from "../../../tab-views/goals_objectives/goals_objectives";
import ObservationsTabView from "../../../tab-views/observations";
import XNGToggle from "../../../../../design/low-level/button_toggle";

export interface AllStudentViewportProps {
  studentJournal: StudentJournal;
  index: number;
  expanded: boolean;
  handleStudentAccordionExpansion: (index: number) => void;
  draftSession: SessionResponse;
  editDraftSession: EditDraftFunctionType;
  applyFuture: Array<FutureTabs[]>;
  setApplyFuture: React.Dispatch<React.SetStateAction<Array<FutureTabs[]>>>;
  defaultCareProvisions: DefaultCareProvisionsResponse;
}

export function StudentAccordion(props: AllStudentViewportProps) {
  const {
    studentJournal,
    index,
    expanded,
    handleStudentAccordionExpansion,
    draftSession,
    editDraftSession,
  } = props;

  const notatorTools = useNotatorTools();
  const views = useAccordionViews(props, notatorTools);
  const isMobile = useBreakpointHelper().isMobile;

  const [showRationaleModal, setShowRationaleModal] = useState<boolean>(false);
  const [expandedProvisions, setExpandedProvisions] = useState<String[]>([]);

  let { notatorSections } = notatorTools;
  // Filters out Session Times and Attendance Tabs since they are rendered separately in this view
  notatorSections = notatorSections = notatorSections.filter((section) => section.sectionName! > 1);

  const handleProvisionAccordionExpansion = (index: string) => {
    if (expandedProvisions.includes(index)) {
      setExpandedProvisions(expandedProvisions.filter((i) => i !== index));
    } else {
      setExpandedProvisions([...expandedProvisions, index]);
    }
  };

  const collapseAllProvisions = () => {
    setExpandedProvisions([]);
  };

  const expandAllProvisions = () => {
    const newState: String[] = [];
    notatorSections?.forEach((notatorSection, index) => {
      newState.push(NotatorTab[notatorSection.sectionName!]);
    });
    setExpandedProvisions(newState);
  };

  const careProvisionsComponentsMap: {
    [key: string]: React.ReactNode;
  } = {
    Activities: views.activities,
    Accommodations: views.accommodations,
    Modifications: views.modifications,
    "Goals/Objectives": views.goalsObjectives,
    Observations: views.observations,
  };

  const rationale =
    draftSession.studentJournalList?.[props.index]?.studentAttendanceRecord?.rationale ||
    studentJournal.studentAttendanceRecord?.rationale;

  return (
    <>
      <AddRationaleModal
        selectedStudentIndex={index}
        setModalOpen={setShowRationaleModal}
        modalOpen={showRationaleModal}
        rationale={rationale}
        studentName={studentJournal.student?.firstName + " " + studentJournal.student?.lastName}
      />
      <Accordion
        disableGutters
        expanded={expanded}
        onChange={() => handleStudentAccordionExpansion(index)}
        key={studentJournal.student?.id}
        sx={{ mb: 2, border: "unset", boxShadow: "none" }}
        id={`${studentJournal.student?.id}`}
      >
        <AccordionSummary
          expandIcon={
            <XNGIconRenderer left color="#4B4B4B" i={<XNGICONS.DownChevron />} size="md" />
          }
          sx={{
            bgcolor: "#D5E2E6",
          }}
        >
          <Typography sx={{ color: "#206A7E" }}>
            {studentJournal?.student?.firstName}&nbsp;{studentJournal?.student?.lastName}
          </Typography>
        </AccordionSummary>
        <AccordionDetails sx={{ pl: 0, pr: 0, mb: 4 }}>
          <Box sx={{ width: "100%", mt: 2, mb: 2 }}>
            <AttendanceTabView
              editSession={editDraftSession}
              editedSession={draftSession}
              selectedStudentIndex={index}
              isAllStudentView={true}
            />
          </Box>
          {draftSession.studentJournalList?.[index]?.studentAttendanceRecord?.present && (
            <>
              <Box
                sx={{
                  bgcolor: "#D5E2E6",
                  width: "100%",
                  padding: 2,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Typography>Today's Session Times</Typography>
                  <XNGHyperlink
                    onClick={() => setShowRationaleModal(!showRationaleModal)}
                    width="max-content"
                  >
                    {rationale ? "View Rationale" : "Add Rationale"}
                  </XNGHyperlink>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <XNGHyperlink onClick={expandAllProvisions} width="max-content">
                    Expand All
                  </XNGHyperlink>
                  <Typography>/</Typography>
                  <XNGHyperlink onClick={collapseAllProvisions} width="max-content">
                    Collapse All
                  </XNGHyperlink>
                </Box>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "flex-start",
                  gap: getSizing(2),
                  flexDirection: isMobile ? "column" : "row",
                }}
              >
                <Box sx={{ width: "100%" }}>
                  <SessionTimesTabView selectedStudentIndex={index} isAllStudentView={true} />
                  {notatorTools?.adaptedDraftSession.isRecurring() && (
                    <XNGToggle
                      value={
                        !Object.keys(
                          notatorTools.exemptedStudentsFromEditsForFutureSessions,
                        ).includes(index.toString())
                      }
                      onToggle={() =>
                        notatorTools.handleToggleApplyEditsToFutureSessions(
                          notatorTools.session?.studentJournalList!,
                          "allStudents",
                          index,
                        )
                      }
                      label="Apply all edits to future sessions"
                    />
                  )}
                </Box>
                <Box sx={{ width: "100%" }}>
                  {notatorSections?.map((notatorSection, index) => {
                    return (
                      <CareProvisionAccordion
                        index={index}
                        key={index}
                        expanded={expandedProvisions.includes(
                          NotatorTab[notatorSection.sectionName!],
                        )}
                        handleProvisionAccordionExpansion={handleProvisionAccordionExpansion}
                        header={NotatorTab[notatorSection.sectionName!]}
                        editDraftSession={editDraftSession}
                        draftSession={draftSession}
                        selectedProvisions={
                          // Not quite sure how to get around this TS error
                          // @ts-ignore
                          studentJournal.careProvisionLedger?.[
                            NotatorTab[notatorSection.sectionName!].toLocaleLowerCase()
                          ]?.length
                        }
                      >
                        {careProvisionsComponentsMap[NotatorTab[notatorSection.sectionName!]]}
                      </CareProvisionAccordion>
                    );
                  })}
                </Box>
              </Box>
            </>
          )}
        </AccordionDetails>
      </Accordion>
    </>
  );
}

function useAccordionViews(
  props: AllStudentViewportProps,
  notatorTools: NotatorTools,
): {
  attendance: JSX.Element;
  sessionTimes: JSX.Element;
  activities: JSX.Element;
  accommodations: JSX.Element;
  modifications: JSX.Element;
  goalsObjectives: JSX.Element;
  observations: JSX.Element;
} {
  const { defaultActivities, defaultAccommodations, defaultModifications } =
    useTemporarySolutionDefaultCareProvisionLists(props);

  const attendance = (
    <AttendanceTabView
      selectedStudentIndex={notatorTools.selectedStudentIndex}
      editedSession={notatorTools.draftSession}
      editSession={notatorTools.editDraft}
    />
  );
  const sessionTimes = <SessionTimesTabView selectedStudentIndex={props.index} />;
  const activities = (
    <ActivitiesTabView
      selectedStudentIndex={props.index}
      defaultIDs={defaultActivities ?? []}
      isAllStudentView={true}
    />
  );
  const accommodations = (
    <AccommodationsTabView
      selectedStudentIndex={props.index}
      defaultIDs={defaultAccommodations ?? []}
      isAllStudentView={true}
    />
  );
  const modifications = (
    <ModificationsTabView
      selectedStudentIndex={props.index}
      defaultIDs={defaultModifications ?? []}
      isAllStudentView={true}
    />
  );
  const goalsObjectives = (
    <GoalsObjectivesTabView isAllStudentView={true} selectedStudentIndex={props.index} />
  );
  const observations = (
    <ObservationsTabView
      applyFuture={props.applyFuture}
      setApplyFuture={props.setApplyFuture}
      selectedStudentIndex={props.index}
      editedSession={notatorTools.draftSession}
      editSession={notatorTools.editDraft}
      isAllStudentView={true}
    />
  );

  return {
    attendance,
    sessionTimes,
    activities,
    accommodations,
    modifications,
    goalsObjectives,
    observations,
  };
}
