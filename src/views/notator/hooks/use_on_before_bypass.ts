import { useState } from "react";

/**
 * Provides `bypassUnsavedChanges` function and the 'is bypassing' status.
 */
export function useBypassUnsavedChanges(props: { onBeforeBypass: () => void }) {
  const [bypass, setBypass] = useState<boolean>(false);

  /**
   * Prevents the unsaved changes modal from popping up if the user has unsaved changes.
   * This is necessary because sometimes the modal pops up when navigating away from the
   * notator before certain actions have finished, like saving, posting, deleting etc.
   */
  function bypassUnsavedChanges() {
    props.onBeforeBypass();
    setBypass(true);
    window.onbeforeunload = function () {};
  }

  return { bypass, bypassUnsavedChanges };
}
