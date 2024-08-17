import Box from "../../../design/components-dev/BoxExtended";
import { getSizing } from "../../../design/sizing";
import { FutureTabs, NotatorTab } from "../types/types";
import { Button } from "@mui/material";
import ActivitiesTabView from "../tab-views/activities";
import useBreakpointHelper from "../../../design/hooks/use_breakpoint_helper";
import AccommodationsTabView from "../tab-views/accommodations";
import ModificationsTabView from "../tab-views/modifications";
import ShowHideBox from "../../../design/components-dev/show_hide_box";
import AttendanceTabView from "../tab-views/attendance";
import SessionTimesTabView from "../tab-views/session_times";
import ObservationsTabView from "../tab-views/observations";
import useTemporarySolutionDefaultCareProvisionLists from "../temp/use_default_care_provisions";
import { NotatorTools, useNotatorTools } from "../tools";
import { DefaultCareProvisionsResponse } from "../../../profile-sdk";
import XNGToggle from "../../../design/low-level/button_toggle";
import GoalsObjectivesTabView from "../tab-views/goals_objectives/goals_objectives";

export interface NotatorTabViewportProps {
  applyFuture: Array<FutureTabs[]>;
  setApplyFuture: React.Dispatch<React.SetStateAction<Array<FutureTabs[]>>>;
  selectedTab: NotatorTab;
  // editSession: EditSessionFunctionType;
  // editedSession: SessionResponse;
  // session: SessionResponse;
  // selectedStudentIndex: number;
  defaultCareProvisions: DefaultCareProvisionsResponse;
  onNext: () => void;
  onSave: () => void;
}

// This is purely a presentational, or "dumb" component. This is not to house any of its own state. It should only ever provide callbacks.
// See more:
// https://medium.com/@dan_abramov/smart-and-dumb-components-7ca2f9a7c7d0
// https://medium.com/@thejasonfile/dumb-components-and-smart-components-e7b33a698d43

function NotatorTabViewport(props: NotatorTabViewportProps) {
  const { isGreaterThanEqualTo } = useBreakpointHelper();
  const needStopgap = !isGreaterThanEqualTo(1293);
  const stopgapMobileNextButtonPositionFixer = needStopgap ? "23.3rem" : "22rem";

  // const notatorTools = useNotatorTools();
  const notatorTools = useNotatorTools();

  const views = useTabViews(props, notatorTools);

  return (
    <>
      <Box
        sx={{
          width: "calc(100vw - 20rem)",
          paddingX: getSizing(1),
          maxHeight: "10%",
          minHeight: `calc(100% - ${stopgapMobileNextButtonPositionFixer})`,
          overflowY: "auto",
        }}
      >
        {/* This must always use a show/hide DOM solution (NOT switch case) so that way local states (if any) persist across screens. */}
        <ShowHideBox if={props.selectedTab === NotatorTab["Attendance"]} show={views.attendance} />
        <ShowHideBox
          if={props.selectedTab === NotatorTab["Session Times"]}
          show={views.sessionTimes}
        />
        <ShowHideBox if={props.selectedTab === NotatorTab["Activities"]} show={views.activities} />
        <ShowHideBox
          if={props.selectedTab === NotatorTab["Accommodations"]}
          show={views.accommodations}
        />
        <ShowHideBox
          if={props.selectedTab === NotatorTab["Modifications"]}
          show={views.modifications}
        />
        <ShowHideBox
          if={props.selectedTab === NotatorTab["Goals/Objectives"]}
          show={views.goalsObjectives}
        />
        <ShowHideBox
          if={props.selectedTab === NotatorTab["Observations"]}
          show={views.observations}
        />
      </Box>
      <Box
        sx={{
          width: "100%",
          maxWidth: "calc(100vw - 20rem)",
          display: "flex",
          justifyContent: "flex-end",
          paddingRight: getSizing(2),
          paddingTop: getSizing(1),
          gap: getSizing(1.5),
        }}
      >
        {notatorTools.adaptedDraftSession.isRecurring() && (
          <XNGToggle
            value={notatorTools.applyEditsToFutureSessions}
            onToggle={() =>
              notatorTools.handleToggleApplyEditsToFutureSessions(
                notatorTools.session.studentJournalList!,
                "documentation",
              )
            }
            label="Apply all edits to future sessions"
          />
        )}
        <Button sx={{ width: getSizing(8) }} onClick={() => props.onNext()}>
          Next
        </Button>
      </Box>
    </>
  );
}

export default NotatorTabViewport;

function useTabViews(
  props: NotatorTabViewportProps,
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
  const sessionTimes = (
    <SessionTimesTabView selectedStudentIndex={notatorTools.selectedStudentIndex} />
  );
  const activities = (
    <ActivitiesTabView
      selectedStudentIndex={notatorTools.selectedStudentIndex}
      defaultIDs={defaultActivities ?? []}
    />
  );
  const accommodations = (
    <AccommodationsTabView
      selectedStudentIndex={notatorTools.selectedStudentIndex}
      defaultIDs={defaultAccommodations ?? []}
    />
  );
  const modifications = (
    <ModificationsTabView
      selectedStudentIndex={notatorTools.selectedStudentIndex}
      defaultIDs={defaultModifications ?? []}
    />
  );
  const goalsObjectives = (
    <GoalsObjectivesTabView selectedStudentIndex={notatorTools.selectedStudentIndex} />
  );
  const observations = (
    <ObservationsTabView
      applyFuture={props.applyFuture}
      setApplyFuture={props.setApplyFuture}
      selectedStudentIndex={notatorTools.selectedStudentIndex}
      editedSession={notatorTools.draftSession}
      editSession={notatorTools.editDraft}
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
