// import { createSlice } from "@reduxjs/toolkit";

// const menuSlice = createSlice({
//   name: "menu",
//   initialState: {
//     availableTemplates: [], // template data which can the admin access for adding the available templates
//     fetchedMenus: {}, // For actual date-specific menus
//   },
//   reducers: {
//     setNewTemplate(state, action) {
//       state.availableTemplates.push(action.payload);
//     },
//     clearSingleTemplate(state, action) {
//       const id = action.payload;
//       state.availableTemplates = state.availableTemplates.filter(
//         (curr) => curr.id !== id, // assuming each template has an id
//       );
//     },
//     setFetchedMenu(state, action) {
//       const { date, menu } = action.payload;
//       state.fetchedMenus[date] = menu;
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
  },
  reducers: {
    setNewTemplate(state, action) {
      const newTemplate = action.payload;

      // Avoid adding duplicates based on unique id
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
  },
});

export default menuSlice.reducer;
export const { setNewTemplate, clearSingleTemplate, setFetchedMenu } =
  menuSlice.actions;
