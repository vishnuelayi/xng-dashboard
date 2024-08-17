import { useEffect, useState } from "react";
import { UnsavedCustomCareProvisionControl } from "../components/care_provision_control";
import { NotatorTools, useNotatorTools } from "../tools";
import isEmptyOrSpaces from "../../../utils/is_empty_or_spaces";
import { CareProvisionMode, OtherField, OtherStatus } from "../types/care_provision";
import { getCapitalizedSingleCareProvisionString } from "../logic/language";

// This is a container or "smart" component, it's in charge of its own state.
export function UnlockedCareProvisionsContainer(props: {
  onBlur: (v: OtherField[]) => void;
  onToggle: (v: OtherField) => void;
  validationDependencies: {
    defaultIDs: string[];
    savedCustomCareProvisionLedger: string[];
    mode: CareProvisionMode;
  };
}) {
  const { otherFields, otherFieldsSetter } = useOtherFields({
    validationDependencies: {
      defaultIDs: props.validationDependencies.defaultIDs,
      customCareProvisionLedger: props.validationDependencies.savedCustomCareProvisionLedger,
      mode: props.validationDependencies.mode,
    },
  });

  return (
    <>
      {otherFields.map((other, i) => {
        const renderValidBecauseItsTheOnlyOneOnTheScreen = otherFields.length === 1;
        const renderValidBecauseItsTheLastItem = i === otherFields.length + -1;
        const overrideStatus =
          renderValidBecauseItsTheOnlyOneOnTheScreen || renderValidBecauseItsTheLastItem;

        return (
          <UnsavedCustomCareProvisionControl
            key={i}
            status={overrideStatus ? { unsaveable: false, userFeedback: "" } : other.status}
            name={other.name}
            increments={other.increments}
            onBlur={() => props.onBlur(otherFields)}
            onChange={(e) => otherFieldsSetter.updateNameByIndex(i, e)}
            onToggle={() => {
              otherFieldsSetter.updateCheckByIndex(i);
              props.onToggle(other);
            }}
          />
        );
      })}
    </>
  );
}

function useOtherFields(deps: {
  validationDependencies: {
    defaultIDs: string[];
    customCareProvisionLedger: string[];
    mode: CareProvisionMode;
  };
}) {
  // Get Refresh Switch
  const { softRefreshSwitch: refreshSwitch } = useNotatorTools();

  // ------ SINGLE STATE ------
  const [otherFields, setOtherFields] = useState<OtherField[]>([getBlankOther()]);

  // ------ STATE UPDATE HANDLERS ------

  function updateNameByIndex(
    i: number,
    e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
  ) {
    const _edited = [...otherFields];
    _edited[i].status = validateOther(e.target.value);
    _edited[i].name = e.target.value;
    setOtherFields(_edited);
  }

  function updateCheckByIndex(i: number) {
    const _edited = [...otherFields];
    _edited[i].increments = Number(!Boolean(_edited[i].increments));
    setOtherFields(_edited);
  }

  function reset() {
    setOtherFields([getBlankOther()]);
  }

  function appendEmpty() {
    const _edited = [...otherFields];
    _edited.push(getBlankOther());
    setOtherFields(_edited);
  }

  // ------ LISTENING STATE UPDATERS ------

  // On `edited` change
  useEffect(() => {
    // Append if necessary
    const hasEmptyProvision = otherFields.filter((e) => e.name === "").length > 0;
    if (!hasEmptyProvision) {
      appendEmpty();
    }
  }, [otherFields]);
  // On refresh
  useEffect(() => {
    reset();
  }, [refreshSwitch]);

  // ----- VALIDATION -----

  function validateOther(otherID: string): OtherStatus {
    const careProvisionStr = getCapitalizedSingleCareProvisionString(
      deps.validationDependencies.mode,
    );

    const entryIsSpaces = isEmptyOrSpaces(otherID);
    if (entryIsSpaces) return { unsaveable: true, userFeedback: "" };

    const entryAlreadyFoundInDefaults = deps.validationDependencies.defaultIDs
      .map((id) => normalize(id))
      .includes(normalize(otherID));
    if (entryAlreadyFoundInDefaults)
      return {
        unsaveable: true,
        userFeedback: `${careProvisionStr} already exists, this will not save`,
      };

    const entryAlreadyFoundInLockedOthers = deps.validationDependencies.customCareProvisionLedger
      ?.map((a) => normalize(a))
      ?.includes(normalize(otherID));
    if (entryAlreadyFoundInLockedOthers)
      return {
        unsaveable: true,
        userFeedback: `${careProvisionStr} already exists, this will not save`,
      };

    const entryAlreadyFoundInUnlockedOthers = otherFields
      .map((o) => o.name.toLowerCase())
      .includes(otherID.toLowerCase());
    if (entryAlreadyFoundInUnlockedOthers)
      return {
        unsaveable: true,
        userFeedback: `${careProvisionStr} already exists, this will not save`,
      };

    return { unsaveable: false, userFeedback: "" };
  }

  // ----- RETURN STATEMENT -----

  return { otherFields: otherFields, otherFieldsSetter: { updateNameByIndex, updateCheckByIndex } };

  // ----- HELPERS -----
  function getBlankOther(): OtherField {
    return { increments: 0, name: "", status: { unsaveable: true, userFeedback: "" } };
  }
}

// is this what it's called?
function normalize(str: string) {
  return str.toLowerCase().trim();
}
