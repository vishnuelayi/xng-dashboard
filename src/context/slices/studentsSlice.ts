import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { StudentRef } from "../../profile-sdk";

interface IStudentsSlice {
  students: StudentRef[];
}

const initialState: IStudentsSlice = {
  students: [],
};

export const studentRefsSlice = createSlice({
  name: "student refs",
  initialState,
  reducers: {
    setStudents: (state, action: PayloadAction<StudentRef[]>) => {
      state.students = action.payload;
    },
  }
});

// SELECTORS, used to read state
export const selectStudents = (state: RootState) => state.studentsReducer.students;
// ACTIONS, used to execute logic
export const { setStudents } = studentRefsSlice.actions;

export default studentRefsSlice.reducer;
