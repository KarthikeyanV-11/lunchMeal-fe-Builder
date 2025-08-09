import { createSlice } from "@reduxjs/toolkit";

const storedUser = JSON.parse(localStorage.getItem("user"));

const initialState = {
  user: storedUser || null, // { name, email, role, etc. }
  subscriptions: [],
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser(state, action) {
      state.user = action.payload;
    },
    clearUser(state) {
      state.user = null;
    },
    setSubscriptionState(state, action) {
      state.subscriptions = action.payload;
    },
  },
});

console.log(initialState.user);
export const { setUser, clearUser, setSubscriptionState } = authSlice.actions;
// Optional - selectors
export const selectUser = (state) => state.auth.user;
export const selectIsAuthenticated = (state) => !!state.auth.user;

export default authSlice.reducer;
