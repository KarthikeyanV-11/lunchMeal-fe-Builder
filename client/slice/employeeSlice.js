import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  allEmployees: [],
  subscribedEmployees: [],
  workingDaysStats: [],
  moneyContributions: [],
};

const employeeSlice = createSlice({
  name: "employee",
  initialState,
  reducers: {
    setEmployees(state, action) {
      state.allEmployees = action.payload;
    },
    setSubscribedEmployees(state, action) {
      state.subscribedEmployees = action.payload;
    },
    clearEmployees(state) {
      state.allEmployees = [];
    },
    setWorkingDaysStats(state, action) {
      state.workingDaysStats = action.payload;
    },
    setMoneyContributions(state, action) {
      state.moneyContributions = action.payload;
    },
  },
});

export const {
  setEmployees,
  setSubscribedEmployees,
  clearEmployees,
  setWorkingDaysStats,
  setMoneyContributions,
} = employeeSlice.actions;
export default employeeSlice.reducer;
