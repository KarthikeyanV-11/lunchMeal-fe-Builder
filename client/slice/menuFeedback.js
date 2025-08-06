// src/slice/feedbackSlice.js
import { createSlice } from "@reduxjs/toolkit";

const feedbackSlice = createSlice({
  name: "feedback",
  initialState: {
    allFeedbacks: [], // array of feedback objects
    lastThreeRatings: [],
  },
  reducers: {
    setAllRatings: (state, action) => {
      state.allFeedbacks = action.payload;
    },
    setLastThreeRatings: (state, action) => {
      state.lastThreeRatings = action.payload;
    },
  },
});

export const { setAllRatings, setLastThreeRatings } = feedbackSlice.actions;

export default feedbackSlice.reducer;
