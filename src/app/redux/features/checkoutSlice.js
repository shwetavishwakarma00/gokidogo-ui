import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { placeCheckout } from "@/app/apis/checkoutApi";

// ================= CHECKOUT THUNK =================
export const checkoutThunk = createAsyncThunk(
  "checkout/placeOrder",
  async (data, { rejectWithValue }) => {
    try {
      const response = await placeCheckout(data);
      return response;
    } catch (error) {
      return rejectWithValue(error?.response?.data || "Checkout failed");
    }
  }
);

// ================= INITIAL STATE =================
const initialState = {
  loading: false,
  success: false,
  orderResponse: null,  // API se jo response aaye
  error: null,
};

// ================= SLICE =================
const checkoutSlice = createSlice({
  name: "checkout",
  initialState,
  reducers: {
    // Order place hone ke baad state reset karo
    resetCheckout: (state) => {
      state.loading = false;
      state.success = false;
      state.orderResponse = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(checkoutThunk.pending, (state) => {
        state.loading = true;
        state.success = false;
        state.error = null;
      })
      .addCase(checkoutThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.orderResponse = action.payload;
      })
      .addCase(checkoutThunk.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload;
      });
  },
});

export const { resetCheckout } = checkoutSlice.actions;
export default checkoutSlice.reducer;