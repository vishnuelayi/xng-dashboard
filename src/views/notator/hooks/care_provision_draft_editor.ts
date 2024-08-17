import getArrayWithoutValue from "../../../utils/get_array_without_value";
import { NotatorCareProvisionTabContext } from "../containers/care_provision_list_renderer";
import { NotatorTools, useNotatorTools } from "../tools";
import { CareProvision, CareProvisionMode, OtherField } from "../types/care_provision";
import { NotatorStudentTools } from "./use_edit_session_student";

export default function useCareProvisionDraftEditor<T extends CareProvision>(
  notatorTools: NotatorTools,
  studentTools: NotatorStudentTools,
  context: NotatorCareProvisionTabContext<T>,
) {
  const { readOnly } = useNotatorTools();
  const { editDraftStudent: editStudent } = studentTools;
  const config = getConfig(context.dotNotationIndexer, studentTools);

  // ----- DRAFT PROVIDED LIST UPDATERS -----

  function incrementByName(name: string, v: number) {
    const isAlreadyProvided = getIsAlreadyProvided(name);

    if (isAlreadyProvided) {
      const newCareProvisions = config.studentDraftProvidedItems.map((a) => {
        if (a.name === name) {
          a.increments = Math.max(0, a.increments! + v);
          return a;
        } else {
          return a;
        }
      });

      editStudent(config.studentCareProvisionListQuery, newCareProvisions);
    } else {
      const provisionsWithRequested: CareProvision[] = [
        ...config.studentDraftProvidedItems,
        { increments: 1, name: name },
      ];

      editStudent(config.studentCareProvisionListQuery, provisionsWithRequested);
    }
  }

  function toggleName(name: string) {
    if (readOnly) return;
    const isAlreadyProvided = getIsAlreadyProvided(name);

    if (isAlreadyProvided) {
      const provisionsWithoutRequested: CareProvision[] = config.studentDraftProvidedItems!.filter(
        (a) => a.name !== name,
      );

      editStudent(config.studentCareProvisionListQuery, provisionsWithoutRequested);
    } else {
      const provisionsWithRequested: CareProvision[] = [
        ...config.studentDraftProvidedItems,
        { increments: 1, name: name },
      ];

      editStudent(config.studentCareProvisionListQuery, provisionsWithRequested);
    }
  }

  function updateCustomCareProvisions(v: OtherField[]) {
    const validatedOthers = v.filter((e) => !e.status.unsaveable).map((e) => e.name) ?? [];
    const newCustomCareProvisionsLedger: string[] = [
      ...context.savedCustomCareProvisionLedger,
      ...validatedOthers,
    ];
    notatorTools.editDraft(
      "sessionJournal.customCareProvisionLedger." + context.dotNotationIndexer,
      newCustomCareProvisionsLedger,
    );
  }

  function deleteCustom(id: string) {
    const newCustomCareProvisionLedger = getArrayWithoutValue(
      context.draftCustomCareProvisionLedger,
      id,
    );

    notatorTools.editDraft(
      "sessionJournal.customCareProvisionLedger." + context.dotNotationIndexer,
      newCustomCareProvisionLedger,
    );

    console.log("AFTER: ", notatorTools.session.sessionJournal?.customCareProvisionLedger);
  }

  // ----- RETURN STATEMENT -----

  return { incrementByName, toggleName, updateCustomCareProvisions, deleteCustom };

  // ----- HELPERS -----

  function getConfig(mode: CareProvisionMode, studentTools: NotatorStudentTools) {
    const { draftStudent: editedStudent } = studentTools;

    return {
      studentCareProvisionListQuery: "careProvisionLedger." + mode,
      studentDraftProvidedItems: getStudentCareProvisions(),
    };

    function getStudentCareProvisions(): CareProvision[] {
      switch (mode) {
        case "activities":
          return editedStudent.careProvisionLedger!.activities ?? [];
        case "accommodations":
          return editedStudent.careProvisionLedger!.accommodations ?? [];
        case "modifications":
          return editedStudent.careProvisionLedger!.modifications ?? [];
        default:
          throw new Error(
            "Fallthrough in switch statement. Has a new care provision been introduced?",
          );
      }
    }
  }

  function getIsAlreadyProvided(name: string) {
    return Boolean(config.studentDraftProvidedItems.find((a) => a.name === name));
  }
}
