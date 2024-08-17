import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";

interface IRefreshSwitch {
  refreshSwitch: boolean;
}

const initialState: IRefreshSwitch = {
  refreshSwitch: false,
};

export const refreshSwitchSlice = createSlice({
  name: "refreshSwitch",
  initialState,
  reducers: {
    toggleRefreshSwitch: (state) => {
      state.refreshSwitch = !state.refreshSwitch;
    },
  },
});

// SELECTORS, used to read state
export const selectRefreshSwitch = (state: RootState) => state.refreshSwitchReducer;
// ACTIONS, used to execute logic
export const ACTION_toggleRefreshSwitch = refreshSwitchSlice.actions.toggleRefreshSwitch;

export default refreshSwitchSlice.reducer;
