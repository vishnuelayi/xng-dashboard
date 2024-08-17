import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  show: false,
  errorMsg: "",
};

const providerNotFoundErrorSlice = createSlice({
  name: "providerNotFount",
  initialState,
  reducers: {
    ACTION_ShowProviderNotFound(state, action: { payload: { show: boolean; errorMsg: string } }) {
      // console.log(action, "!!!!!!!!!!!!!!!!!!!!!!");
      state.show = action.payload.show;
      state.errorMsg = action.payload.errorMsg;
    },
  },
});

export default providerNotFoundErrorSlice.reducer;

export const providerNotFoundErrorActions = providerNotFoundErrorSlice.actions;
