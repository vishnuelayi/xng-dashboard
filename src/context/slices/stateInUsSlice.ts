import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { ClientResponse } from "../../profile-sdk";
import { placeholderForFutureLogErrorText } from "../../temp/errorText";
import { REPORTING_HEADERS } from "../../api/api";

type StateInUsSliceStateType = string | null;

const initialState: StateInUsSliceStateType = null;

export const stateInUsSlice = createSlice({
  name: "state in us",
  initialState: initialState as StateInUsSliceStateType,
  reducers: {
    setStateInUs: (state, action: PayloadAction<StateInUsSliceStateType>) => {
      // state = action.payload didn't work, it only worked when I changed to return. Need to look into this more later.
      REPORTING_HEADERS["State"] = action.payload as string;
      return action.payload;
    },
  },
});

// SELECTORS, used to read state
export const selectStateInUS = (state: RootState) => {
  const stateInUs = state.stateInUs;
 
  if (stateInUs === null) throw Error(placeholderForFutureLogErrorText);
  return stateInUs;
};
// ACTIONS, used to execute logic
export const { setStateInUs: setStateInUs } = stateInUsSlice.actions;

export default stateInUsSlice.reducer;
