import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  allEmployees: [],
  subscribedEmployees: [],
};

const employeeSlice = createSlice({
  name: "employee",
  initialState,
  reducers: {
    setEmployees(state, action) {
      state.allEmployees = action.payload;
    },
    clearEmployees(state) {
      state.allEmployees = [];
    },
  },
});

export const { setEmployees, clearEmployees } = employeeSlice.actions;
export default employeeSlice.reducer;
