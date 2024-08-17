import { createSlice } from "@reduxjs/toolkit";

type AttendanceOption = "present" | "absent" | " virtual";

type documentationState = {
  attendance: AttendanceOption[];
};

type attendacePayload = {
  index: number;
  attendance: AttendanceOption;
};

const initialState: documentationState = {
  attendance: ["present"],
};

const studentDocumentationSlice = createSlice({
  name: "studentDocumentationSlice",
  initialState,
  reducers: {
    ACTION_SetAttendanceState(state, { payload }: { payload: attendacePayload }) {
      if (payload.index > state.attendance.length - 1) state.attendance.push(payload.attendance);
      const { attendance } = payload;
      state.attendance[payload.index] = attendance;
    },
  },
});

export default studentDocumentationSlice.reducer;

export const { ACTION_SetAttendanceState } = studentDocumentationSlice.actions;
