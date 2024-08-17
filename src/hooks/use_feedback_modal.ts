import { useXNGDispatch } from "../context/store";
import { SimpleAttentionMessagesActions } from "../context/slices/SimpleAttentionMessageSlice";
import { thankYouModalActions } from "../context/slices/thankYouModalSlice";

const useFeedbackModal = () => {
  const xng_dispatch = useXNGDispatch();

  const onFailedSave = (msg?: string) => {
    xng_dispatch(
      SimpleAttentionMessagesActions.ACTION_ShowModal({
        message: msg ?? "Problem saving information. Please refresh window and try again.",
        show: true,
      }),
    );
  };

  const onSuccessfulSave = (msg?: string, cleanup?: () => void) => {
    xng_dispatch(
      thankYouModalActions.ACTION_ShowThankyouModal({
        text: msg ?? "information saved successfully.",
        show: true,
      }),
    );
    if (cleanup) {
      xng_dispatch(thankYouModalActions.ACTION_OnAfterCloseModal({ cleanup }));
    }
  };

  return {
    onFailedSave,
    onSuccessfulSave,
  };
};

export default useFeedbackModal;
