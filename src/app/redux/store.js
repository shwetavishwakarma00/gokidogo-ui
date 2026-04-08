import { configureStore } from "@reduxjs/toolkit";
import restaurantReducer from "./features/restaurantSlice";

export const store = configureStore({
  reducer: {
    restaurant: restaurantReducer,
  },
});