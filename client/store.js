import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slice/authSlice";
import employeeReducer from "./slice/employeeSlice";
import menuReducer from "./slice/menuSlice";
import subscriptionReducer from "./slice/subscriptionSlice";
import adminNotificationReducer from "./slice/adminNotification";
import feedbackReducer from "./slice/menuFeedback";

const store = configureStore({
  reducer: {
    auth: authReducer,
    employee: employeeReducer,
    menu: menuReducer,
    subscription: subscriptionReducer,
    Notification: adminNotificationReducer,
    feedback: feedbackReducer,
  },
});

export default store;
