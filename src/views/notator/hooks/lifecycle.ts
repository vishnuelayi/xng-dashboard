import { useEffect } from "react";
import { SessionResponse } from "../../../session-sdk";

interface NotatorLifecycleDependencies {
  session: SessionResponse;
}
interface NotatorLifecycleActions {
  setEditedSession: React.Dispatch<React.SetStateAction<SessionResponse>>;
}

export default function useNotatorLifecycleHooks(props: {
  dependencies: NotatorLifecycleDependencies;
  actions: NotatorLifecycleActions;
}) {
  const { session } = props.dependencies;
  const { setEditedSession } = props.actions;

  // -- Lifecycle Hook --
  useEffect(() => {
    // Initialize `editedSession`, thus beginning save system lifecycle.
    if (!session || !session.sessionJournal || !session.sessionJournal.customCareProvisionLedger)
      return;
    const newSession = JSON.parse(JSON.stringify(session)) as SessionResponse;

    // const { acts, accs, mods } = getCurrentCareProvisions(newSession);
    // Append empty items to all custom care provision ledgers, so that way the UI renders appropriately by giving users an empty text field to start with
    // See more in section 3A: https://msb-tlm.atlassian.net/wiki/spaces/XL/pages/140935169/Notator+Philosophy
    // newSession.sessionJournal!.customCareProvisionLedger!.activities = appendEmpty(acts);
    // newSession.sessionJournal!.customCareProvisionLedger!.accommodations = appendEmpty(accs);
    // newSession.sessionJournal!.customCareProvisionLedger!.accommodations = appendEmpty(mods);

    setEditedSession(newSession);
  }, [session]);
}
