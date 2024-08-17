import { PayloadAction, createSlice } from "@reduxjs/toolkit";

type moduleSlice = {
  show: boolean;
  confirmationData: {
    confirmationText: string;
    providerInformation: {
      providerId: string;
      caseloadType: "proxyCaseload" | "approverCaseload";
    };
  };
};

type removeProviderConfirmationTrue = {
  show: true;
  confirmationData: moduleSlice["confirmationData"];
};

type removeProviderConfirmationFalse = {
  show: false;
  confirmationData?: moduleSlice["confirmationData"];
};

const initialState: moduleSlice = {
  show: false,
  confirmationData: {
    confirmationText: "",
    providerInformation: {
      providerId: "",
      caseloadType: "proxyCaseload",
    },
  },
};

const removeProvderConfirmationModal = createSlice({
  name: "removeProvderConfirmationModal",
  initialState,
  reducers: {
    ACTION_ShowModal(
      state,
      action: PayloadAction<removeProviderConfirmationTrue | removeProviderConfirmationFalse>,
    ) {
      state.show = action.payload.show;
      if (action.payload.show) {
        state.confirmationData = action.payload.confirmationData;
      } else {
        state.confirmationData = {} as moduleSlice["confirmationData"];
      }
    },
  },
});

export default removeProvderConfirmationModal.reducer;

export const removeProvderConfirmationModalAction = removeProvderConfirmationModal.actions;
