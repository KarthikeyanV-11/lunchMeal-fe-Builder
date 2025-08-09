// src/slice/feedbackSlice.js
import { createSlice } from "@reduxjs/toolkit";

const feedbackSlice = createSlice({
  name: "feedback",
  initialState: {
    allFeedbacks: [], // array of feedback objects
    lastThreeRatings: [],
    monthlyAvgRating: [],
  },
  reducers: {
    setAllRatings: (state, action) => {
      state.allFeedbacks = action.payload;
    },
    setLastThreeRatings: (state, action) => {
      state.lastThreeRatings = action.payload;
    },
    setMonthlyAvgRating(state, action) {
      state.monthlyAvgRating = action.payload;
    },
  },
});

export const { setAllRatings, setLastThreeRatings, setMonthlyAvgRating } =
  feedbackSlice.actions;

export default feedbackSlice.reducer;
