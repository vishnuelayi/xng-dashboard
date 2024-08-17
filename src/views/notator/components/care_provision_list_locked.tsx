import { useMemo } from "react";
import { CareProvision } from "../types/care_provision";
import CareProvisionControl from "./care_provision_control";

// This is purely a presentational, or "dumb" component. This is not to house any of its own state. It should only ever provide callbacks.
// See more:
// https://medium.com/@dan_abramov/smart-and-dumb-components-7ca2f9a7c7d0
// https://medium.com/@thejasonfile/dumb-components-and-smart-components-e7b33a698d43

/** 💡 NOTE:
 * When modifying: Please use prefixes `saved-` and `draft-` as standard naming convention to designate the usage context of the new property.
 * Prefixing with saved- means that the property represents a value found in `session`, while draft- means that it derives from `editedSession`.
 *
 * TODO: Clarify language and minimize reliance on injected dependencies -- instead refine code to rely on context directly.
 * For language reference: https://msb-tlm.atlassian.net/wiki/spaces/MTD/pages/382664706/X+Logs+Care+Provision+Synopsis
 */
export type LockedCareProvisionsDisplayData = {
  defaultIDs: string[];
  draftProvidedCareProvisions: CareProvision[];
  savedCustomCareProvisionLedger: string[];
  draftCustomCareProvisionLedger: string[];
};

// -- What dumb components can do:
// * Directly display props as UI
// * Derive how to display something based on props, this includes running algorithms against multiple props to derive visual state
// -- What they can't do:
// * Manage own state
// * Accept props that the parent has applied an alteration to. All props should be true, unaltered data

/**
 * @param displayData The object that informs the UI what to display.
 * @param callbacks The callbacks fired when an operation to the data is requested. AKA: `onToggleName`, `onIncrementNameUp`, `onIncrementNameDown`, `onCustomDelete`
 * @returns
 */
export function LockedCareProvisionsDisplay(
  props: Readonly<{
    displayData: LockedCareProvisionsDisplayData;
    onToggleName: (id: string) => void;
    onIncrementNameUp: (id: string) => void;
    onIncrementNameDown: (id: string) => void;
    onCustomDelete: (id: string) => void;
  }>,
) {
  const { defaultIDs, draftCustomCareProvisionLedger, savedCustomCareProvisionLedger } =
    props.displayData;

  const lockedCustomsWithoutCachedDeletions = deriveLockedCustomsWithoutCachedDeletions({
    draftCustomCareProvisionLedger,
    savedCustomCareProvisionLedger,
  });

  const defaultIDsWithoutCustoms = useMemo(
    () => defaultIDs.filter((defID) => !savedCustomCareProvisionLedger.includes(defID)),
    [defaultIDs],
  );

  return (
    <>
      {defaultIDsWithoutCustoms.map((id: string, i: number) => {
        const increments =
          props.displayData.draftProvidedCareProvisions.find((cp) => cp.name === id)?.increments ??
          0;

        return (
          <CareProvisionControl
            key={i}
            label={id}
            increments={increments}
            onIncrement={() => props.onIncrementNameUp(id)}
            onDecrement={() => props.onIncrementNameDown(id)}
            onToggle={() => props.onToggleName(id)}
          />
        );
      })}

      {lockedCustomsWithoutCachedDeletions.map((id: string, i: number) => {
        const increments =
          props.displayData.draftProvidedCareProvisions.find((cp) => cp.name === id)?.increments ??
          0;

        return (
          <CareProvisionControl
            key={i}
            label={id}
            increments={increments}
            onIncrement={() => props.onIncrementNameUp(id)}
            onDecrement={() => props.onIncrementNameDown(id)}
            onToggle={() => props.onToggleName(id)}
            useDeleteButton={{
              onDelete: () => {
                props.onCustomDelete(id);
              },
            }}
          />
        );
      })}
    </>
  );
}

function deriveLockedCustomsWithoutCachedDeletions(props: {
  savedCustomCareProvisionLedger: string[];
  draftCustomCareProvisionLedger: string[];
}) {
  const savedCustoms = props.savedCustomCareProvisionLedger;
  const draftCustoms = props.draftCustomCareProvisionLedger;

  const cachedDeletionIDs: string[] = savedCustoms.filter((saved) => !draftCustoms.includes(saved));

  const customsWithoutCachedDeletions = savedCustoms.filter((id) => {
    const isHidden = cachedDeletionIDs.includes(id);
    return !isHidden;
  });

  return customsWithoutCachedDeletions;
}
