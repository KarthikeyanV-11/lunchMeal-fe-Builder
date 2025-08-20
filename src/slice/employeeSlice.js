import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  allEmployees: [],
  subscribedEmployees: [],
  workingDaysStats: [],
  moneyContributions: [],
  monthlyContributions: [],
  attendeesStats: [],
};

const employeeSlice = createSlice({
  name: "employee",
  initialState,
  reducers: {
    setEmployees(state, action) {
      state.allEmployees = action.payload;
    },
    updateEmployees(state, action) {
      const newEmployees = action.payload; // backend returns only new/updated employees

      // Keep old employees in a map
      const employeeMap = new Map(
        state.allEmployees.map((emp) => [emp.id, emp]),
      );

      // Overwrite/add new ones
      newEmployees.forEach((emp) => {
        employeeMap.set(emp.id, emp);
      });

      // Update state
      state.allEmployees = Array.from(employeeMap.values());
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
    setTotalMonthlyContributions(state, action) {
      state.monthlyContributions = action.payload;
    },
    setDailyAttendeesCountStats(state, action) {
      state.attendeesStats = action.payload;
    },
  },
});

export const {
  setEmployees,
  updateEmployees,
  setSubscribedEmployees,
  clearEmployees,
  setWorkingDaysStats,
  setMoneyContributions,
  setTotalMonthlyContributions,
  setDailyAttendeesCountStats,
} = employeeSlice.actions;
export default employeeSlice.reducer;
