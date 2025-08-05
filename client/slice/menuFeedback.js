// src/slice/feedbackSlice.js
import { createSlice } from "@reduxjs/toolkit";

const feedbackSlice = createSlice({
  name: "feedback",
  initialState: {
    feedbacks: [], // array of feedback objects
  },
  reducers: {
    setFeedbacks(state, action) {
      state.feedbacks = action.payload;
    },
    addFeedback(state, action) {
      state.feedbacks.push(action.payload);
    },
    resetFeedbacks(state) {
      state.feedbacks = [];
    },
  },
});

export const { setFeedbacks, addFeedback, resetFeedbacks } =
  feedbackSlice.actions;

export default feedbackSlice.reducer;
