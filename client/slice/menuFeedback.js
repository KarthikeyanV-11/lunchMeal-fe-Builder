// src/slice/feedbackSlice.js
import { createSlice } from "@reduxjs/toolkit";

const feedbackSlice = createSlice({
  name: "feedback",
  initialState: {
    items: [], // array of feedback objects
  },
  reducers: {
    setFeedbacks(state, action) {
      state.items = action.payload;
    },
    addFeedback(state, action) {
      state.items.push(action.payload);
    },
    resetFeedbacks(state) {
      state.items = [];
    },
  },
});

export const { setFeedbacks, addFeedback, resetFeedbacks } =
  feedbackSlice.actions;

export default feedbackSlice.reducer;
