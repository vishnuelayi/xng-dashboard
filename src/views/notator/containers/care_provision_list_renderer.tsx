import {
  LockedCareProvisionsDisplay,
  LockedCareProvisionsDisplayData,
} from "../components/care_provision_list_locked";
import { NotatorTools } from "../tools";
import useCareProvisionDraftEditor from "../hooks/care_provision_draft_editor";
import { NotatorStudentTools } from "../hooks/use_edit_session_student";
import CareProvisionGridLayout from "../layouts/care_provision_grid";
import { CareProvision, CareProvisionMode, OtherField } from "../types/care_provision";
import { UnlockedCareProvisionsContainer } from "./care_provision_list_unlocked";

/// --- Quick philosophy behind this system to keep in mind --- ///
// * All components seen below use callbacks to edit the `draft` / `editedSession`. None of these components seen below directly
//   control draft state.
// * Any component that requires local state to operate (UnlockedCareProvisions) should explicitly be labeled a "Container", and
//   still, as necessary, use callbacks to control draft state.

/** 💡 NOTE:
 * When modifying: Please use prefixes `saved-` and `draft-` as standard naming convention to designate the usage context of the new property.
 * Prefixing with saved- means that the property represents a value found in `session`, while draft- means that it derives from `editedSession`.
 */
export interface NotatorCareProvisionTabContext<T extends CareProvision> {
  dotNotationIndexer: CareProvisionMode; // Don't prefix, this is just the mode.
  draftProvidedCareProvisions: T[];
  draftCustomCareProvisionLedger: string[];
  savedCustomCareProvisionLedger: string[];
}

/**
 * This is a dumb component for rendering care provisions dependent on the given care provision context.
 *
 * @param props.tools - Tools passed in from a parent, so that way data duplication doesn't occur.
 * @param props.careProvisionContext - Configures the behavior of the component based on the context of its usage; whether for activities, accommodations, or modifications.
 * @param props.defaultIDs - (⚠️ This is temporary. ⚠️) We will refactor to not accept `defaultIDs` here. DefaultIDs will likely be able to be internally derived, or passed
 * as part of the NotatorTabViewContext property.
 */
export default function GenericCareProvisionListRenderer<T extends CareProvision>(props: {
  tools: { notatorTools: NotatorTools; studentTools: NotatorStudentTools };
  notatorTabViewContext: NotatorCareProvisionTabContext<T>;
  defaultIDs: string[];
}) {
  // --- Prop Extraction ---
  const { notatorTools, studentTools } = props.tools;
  const { readOnly } = notatorTools;
  const {
    draftCustomCareProvisionLedger,
    savedCustomCareProvisionLedger,
    draftProvidedCareProvisions,
  } = props.notatorTabViewContext;
  const { defaultIDs } = props;


  // --- Hooks ---
  const draftEditor = useCareProvisionDraftEditor(
    notatorTools,
    studentTools,
    props.notatorTabViewContext,
  );

  // --- Main Dataset --- //
  const lockedDisplayData: LockedCareProvisionsDisplayData = {
    defaultIDs,
    draftCustomCareProvisionLedger,
    savedCustomCareProvisionLedger,
    draftProvidedCareProvisions,
  };

  return (
    <CareProvisionGridLayout>
      <LockedCareProvisionsDisplay
        displayData={lockedDisplayData}
        onIncrementNameUp={(id: string) => draftEditor.incrementByName(id, 1)}
        onIncrementNameDown={(id: string) => draftEditor.incrementByName(id, -1)}
        onToggleName={(id: string) => draftEditor.toggleName(id)}
        onCustomDelete={(id: string) => {
          draftEditor.deleteCustom(id);
        }}
      />

      {readOnly || (
        <UnlockedCareProvisionsContainer
          onBlur={(v: OtherField[]) => {
            draftEditor.updateCustomCareProvisions(v);
          }}
          onToggle={(v: OtherField) => {
            if (!v.status.unsaveable) {
              draftEditor.toggleName(v.name);
            }
          }}
          validationDependencies={{
            defaultIDs,
            savedCustomCareProvisionLedger,
            mode: props.notatorTabViewContext.dotNotationIndexer,
          }}
        />
      )}
    </CareProvisionGridLayout>
  );
}
