import { ProvidedActivity } from "../../../session-sdk";
import GenericCareProvisionListRenderer, {
  NotatorCareProvisionTabContext,
} from "../containers/care_provision_list_renderer";
import { useNotatorTools } from "../tools";
import useNotatorStudentTools from "../hooks/use_edit_session_student";
import { TabInnerViewportLayout } from "../layouts/inner_viewport_headers";

// This is purely a presentational, or "dumb" component. This is not to house any of its own state. It should only ever provide callbacks.
// See more:
// https://medium.com/@dan_abramov/smart-and-dumb-components-7ca2f9a7c7d0
// https://medium.com/@thejasonfile/dumb-components-and-smart-components-e7b33a698d43

export default function ActivitiesTabView(props: {
  selectedStudentIndex: number;
  defaultIDs: string[];
  isAllStudentView?: boolean;
}) {
  const notatorTools = useNotatorTools();
  const studentTools = useNotatorStudentTools({
    notatorTools,
    indexOverride: props.isAllStudentView ? props.selectedStudentIndex : undefined,
  });

  const notatorTabViewContext: NotatorCareProvisionTabContext<ProvidedActivity> = {
    dotNotationIndexer: "activities",
    draftProvidedCareProvisions: studentTools.draftStudent.careProvisionLedger?.activities ?? [],
    savedCustomCareProvisionLedger:
      notatorTools.session.sessionJournal?.customCareProvisionLedger?.activities ?? [],
    draftCustomCareProvisionLedger:
      notatorTools.draftSession.sessionJournal?.customCareProvisionLedger?.activities ?? [],
  };

  return (
    <TabInnerViewportLayout
      title="Activities"
      // useComingSoonLink={{ text: "Import from Student Profile" }}
      isAllStudentView={props.isAllStudentView}
    >
      <GenericCareProvisionListRenderer<ProvidedActivity>
        tools={{ notatorTools, studentTools }}
        defaultIDs={props.defaultIDs}
        notatorTabViewContext={notatorTabViewContext}
      />
    </TabInnerViewportLayout>
  );
}
