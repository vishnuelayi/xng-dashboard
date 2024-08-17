import { PayloadAction, createSlice } from "@reduxjs/toolkit";

type thankYouModalState = {
  show: boolean;
  text: string;
  cleanup?: () => void;
};

type ThankYouPayloadTrue = {
  show: true;
  text: string;
};

type ThankYouPayloadFalse = {
  show: false;
  text?: string;
};

type CleanupPayload = {
  cleanup: () => void;
};

const initialState: thankYouModalState = {
  show: false,
  text: "",
};

const thankYouConfirmationModal = createSlice({
  name: "thankYouConfirmationModal",
  initialState,
  reducers: {
    ACTION_ShowThankyouModal(
      state,
      action: PayloadAction<ThankYouPayloadTrue | ThankYouPayloadFalse>,
    ) {
      state.show = action.payload.show;
      if (action.payload.show) state.text = action.payload.text || "";
    },
    ACTION_OnAfterCloseModal(state, action: PayloadAction<CleanupPayload>) {
      state.cleanup = action.payload.cleanup;
    },
    ACTION_ResetCleanup(state) {
      state.cleanup = undefined;
    },
  },
});

export default thankYouConfirmationModal.reducer;

export const thankYouModalActions = thankYouConfirmationModal.actions;
