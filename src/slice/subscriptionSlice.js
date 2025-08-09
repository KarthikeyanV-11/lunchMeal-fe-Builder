import { createSlice } from "@reduxjs/toolkit";

const subscriptionSlice = createSlice({
  name: "subscription",
  initialState: {
    subscriptions: [], // holds all employee subscriptions
  },
  reducers: {
    setSubscriptions(state, action) {
      state.subscriptions = action.payload;
    },
    addSubscription(state, action) {
      state.subscriptions.push(action.payload);
    },
    clearSubscriptions(state) {
      state.subscriptions = [];
    },
  },
});

export const { setSubscriptions, addSubscription, clearSubscriptions } =
  subscriptionSlice.actions;

export default subscriptionSlice.reducer;
