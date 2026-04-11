import { configureStore } from "@reduxjs/toolkit";
import restaurantReducer from "./features/restaurantSlice";
import authReducer from "./features/authSlice";
import checkoutReducer from "./features/checkoutSlice";
import cartReducer from "./features/cartSlice";

export const store = configureStore({
  reducer: {
    restaurant: restaurantReducer,
    auth: authReducer,
    checkout : checkoutReducer,
    cart : cartReducer,
  },
});