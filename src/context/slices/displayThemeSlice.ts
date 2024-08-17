import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { XNGTheme } from "../../design/colors/types";
import { RootState } from "../store";

interface ISelectedThemeState {
  theme: XNGTheme;
}

const initialState: ISelectedThemeState = {
  theme: XNGTheme.Light,
};

export const selectedThemeSlice = createSlice({
  name: "selected theme",
  initialState,
  reducers: {
    setSelectedTheme: (state, action: PayloadAction<XNGTheme>) => {
      state.theme = action.payload;
    },
  },
});

// SELECTORS, used to read state
export const selectedTheme = (state: RootState) => state.displayTheme.theme;
// ACTIONS, used to execute logic
export const { setSelectedTheme } = selectedThemeSlice.actions;

export default selectedThemeSlice.reducer;
