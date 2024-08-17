import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";

interface ISidebar {
  open: boolean;
}

const initialState: ISidebar = {
  open: false,
};

export const sidebarSlice = createSlice({
  name: "sidebar",
  initialState,
  reducers: {
    setSidebarOpen: (state, action: PayloadAction<boolean>) => {
      state.open = action.payload;
    },
  },
});

// SELECTORS, used to read state
export const sidebarOpen = (state: RootState) => state.sidebar.open;
// ACTIONS, used to execute logic
export const { setSidebarOpen } = sidebarSlice.actions;

export default sidebarSlice.reducer;
