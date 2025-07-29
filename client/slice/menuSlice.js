// import { createSlice } from "@reduxjs/toolkit";

// const menuSlice = createSlice({
//   name: "menu",
//   initialState: {
//     availableTemplates: [],
//     fetchedMenus: {},
//   },
//   reducers: {
//     setNewTemplate(state, action) {
//       const newTemplate = action.payload;

//       // Avoid adding duplicates based on unique id
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
//   },
// });

// export default menuSlice.reducer;
// export const { setNewTemplate, clearSingleTemplate, setFetchedMenu } =
//   menuSlice.actions;

import { createSlice } from "@reduxjs/toolkit";

const menuSlice = createSlice({
  name: "menu",
  initialState: {
    availableTemplates: [],
    fetchedMenus: {},
    monthlyMenus: {}, // NEW: Store monthly data using "YYYY-MM" keys
  },
  reducers: {
    setNewTemplate(state, action) {
      const newTemplate = action.payload;
      const alreadyExists = state.availableTemplates.some(
        (template) => template.id === newTemplate.id,
      );
      if (!alreadyExists) {
        state.availableTemplates.push(newTemplate);
      }
    },
    clearSingleTemplate(state, action) {
      const id = action.payload;
      state.availableTemplates = state.availableTemplates.filter(
        (curr) => curr.id !== id,
      );
    },
    setFetchedMenu(state, action) {
      const { key, week } = action.payload;
      state.fetchedMenus[key] = week;
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
  clearSingleTemplate,
  setFetchedMenu,
  setMonthlyMenus, // export this too
} = menuSlice.actions;
