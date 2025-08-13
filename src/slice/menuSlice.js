// import { createSlice } from "@reduxjs/toolkit";

// const menuSlice = createSlice({
//   name: "menu",
//   initialState: {
//     availableTemplates: [],
//     fetchedMenus: {},
//     monthlyMenus: {}, // NEW: Store monthly data using "YYYY-MM" keys
//   },
//   reducers: {
//     setNewTemplate(state, action) {
//       const newTemplate = action.payload;
//       const alreadyExists = state.availableTemplates.some(
//         (template) => template.id === newTemplate.id,
//       );
//       if (!alreadyExists) {
//         state.availableTemplates.push(newTemplate);
//       }
//     },
//     clearSingleTemplate(state, action) {
//       const id = action.payload;
//       state.availableTemplates = state.availableTemplates.filter(
//         (curr) => curr.id !== id,
//       );
//     },
//     setFetchedMenu(state, action) {
//       const { key, week } = action.payload;
//       state.fetchedMenus[key] = week;
//     },
//     setMonthlyMenus(state, action) {
//       const { monthYearKey, monthData } = action.payload;
//       state.monthlyMenus[monthYearKey] = monthData;
//     },
//   },
// });

// export default menuSlice.reducer;
// export const {
//   setNewTemplate,
//   clearSingleTemplate,
//   setFetchedMenu,
//   setMonthlyMenus, // export this too
// } = menuSlice.actions;

import { createSlice } from "@reduxjs/toolkit";

const menuSlice = createSlice({
  name: "menu",
  initialState: {
    availableTemplates: [],
    fetchedMenus: {}, // For weekly / multi-day menus, keyed by week range
    fetchedDayMenus: {}, // New: For single day menus, keyed by date string
    monthlyMenus: {}, // Monthly menus as before
  },
  reducers: {
    // setNewTemplate(state, action) {
    //   const newTemplate = action.payload;
    //   const alreadyExists = state.availableTemplates.some(
    //     (template) => template.id === newTemplate.id,
    //   );
    //   if (!alreadyExists) {
    //     state.availableTemplates.push(newTemplate);
    //   }
    // },
    // clearSingleTemplate(state, action) {
    //   const id = action.payload;
    //   state.availableTemplates = state.availableTemplates.filter(
    //     (curr) => curr.id !== id,
    //   );
    // },
    setNewTemplate: (state, action) => {
      state.availableTemplates.push(action.payload);
    },
    updateTemplate: (state, action) => {
      const updated = action.payload;
      const index = state.availableTemplates.findIndex(
        (t) => t.id === updated.id,
      );
      if (index !== -1) {
        state.availableTemplates[index] = updated;
      }
    },
    deleteTemplate: (state, action) => {
      state.availableTemplates = state.availableTemplates.filter(
        (t) => t.id !== action.payload,
      );
    },
    setFetchedMenu(state, action) {
      const { key, week } = action.payload;
      state.fetchedMenus[key] = week;
    },
    setFetchedDayMenu(state, action) {
      const { key, dayMenu } = action.payload;
      state.fetchedDayMenus[key] = dayMenu;
    },
    setMonthlyMenus(state, action) {
      const { monthYearKey, monthData } = action.payload;
      state.monthlyMenus[monthYearKey] = monthData;
    },
  },
});

export default menuSlice.reducer;
export const {
  setNewTemplate,
  updateTemplate,
  deleteTemplate,
  setFetchedMenu,
  setFetchedDayMenu, // export new action
  setMonthlyMenus,
} = menuSlice.actions;
