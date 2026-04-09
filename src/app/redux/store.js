import { configureStore } from "@reduxjs/toolkit";
import restaurantReducer from "./features/restaurantSlice";
import authReducer from "./features/authSlice";

export const store = configureStore({
  reducer: {
    restaurant: restaurantReducer,
    auth: authReducer,
  },
});