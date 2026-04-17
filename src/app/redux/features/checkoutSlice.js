import { placeCheckout } from "@/app/apis/checkoutApi";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// THUNK
export const checkoutThunk = createAsyncThunk(
  "checkout/submitOrder",
  async (orderData, { rejectWithValue }) => {
    try {
      const response = await placeCheckout(orderData);

      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Order submission failed"
      );
    }
  }
);

const checkoutSlice = createSlice({
  name: "checkout",
  initialState: {
    loading: false,
    order: null,
    error: null,
    success: false,
  },

  reducers: {
    clearCheckoutState: (state) => {
      state.loading = false;
      state.order = null;
      state.error = null;
      state.success = false;
    },
  },

  extraReducers: (builder) => {
    builder

      // PENDING
      .addCase(checkoutThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      // SUCCESS
      .addCase(checkoutThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.order = action.payload;
      })

      // ERROR
      .addCase(checkoutThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearCheckoutState } = checkoutSlice.actions;

export default checkoutSlice.reducer;