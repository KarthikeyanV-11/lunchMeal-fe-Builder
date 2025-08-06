import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  allNotifications: [],
  lastThree: [],
};

const adminNotificationSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    setAllNotifications: (state, action) => {
      state.allNotifications = action.payload;
    },
    setLastThreeNotifications: (state, action) => {
      state.lastThree = action.payload;
    },
  },
});

export const { setAllNotifications, setLastThreeNotifications } =
  adminNotificationSlice.actions;
export default adminNotificationSlice.reducer;
