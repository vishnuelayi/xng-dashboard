import { PayloadAction, createSlice } from "@reduxjs/toolkit";

const initialState = {
  showModal: false,
  message: "",
};

/* 
    This slice is form simple modals with the attention header
    that have simple messages
*/
const SimpleAttentionMessageslice = createSlice({
  name: "simple-attention-message",
  initialState,
  reducers: {
    ACTION_ShowModal(
      state,
      action: PayloadAction<{
        show: boolean;
        message: string | undefined;
      }>,
    ) {
      if (action.payload.show && action.payload.message) {
        state.showModal = true;
        state.message = action.payload.message;
      } else {
        state.showModal = false;
      }
    },
  },
});

export default SimpleAttentionMessageslice.reducer;

export const SimpleAttentionMessagesActions = SimpleAttentionMessageslice.actions;
