import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";

interface IForceAccountRegistration {
  forceAccountRegistration: boolean;
}

const initialState: IForceAccountRegistration = {
  forceAccountRegistration: false,
};

export const forceAccountRegistrationSlice = createSlice({
  name: "forceAccountRegistration",
  initialState,
  reducers: {
    ACTION_setForceAccountRegistration: (state, action: PayloadAction<boolean>) => {
      state.forceAccountRegistration = action.payload;
    },
  },
});

// ACTIONS, used to execute logic
export const ACTION_setForceAccountRegistration =
  forceAccountRegistrationSlice.actions.ACTION_setForceAccountRegistration;

export default forceAccountRegistrationSlice.reducer;
