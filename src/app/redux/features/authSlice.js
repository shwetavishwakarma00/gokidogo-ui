import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { sendOtpEmail, verifyOtpEmail, customerSignup } from "@/app/apis/authApi";


// ================= SEND OTP =================
export const sendOtpThunk = createAsyncThunk(
  "auth/sendOtp",
  async (data, { rejectWithValue }) => {
    try {
      const response = await sendOtpEmail(data);
      return response;
    } catch (error) {
      return rejectWithValue(error?.response?.data || "OTP send failed");
    }
  }
);


// ================= VERIFY OTP =================
export const verifyOtpThunk = createAsyncThunk(
  "auth/verifyOtp",
  async (data, { rejectWithValue }) => {
    try {
      const response = await verifyOtpEmail(data);
      return response;
    } catch (error) {
      return rejectWithValue(error?.response?.data || "OTP verification failed");
    }
  }
);


// ================= SIGNUP =================
export const signupThunk = createAsyncThunk(
  "auth/signup",
  async (data, { rejectWithValue }) => {
    try {
      const response = await customerSignup(data);
      return response;
    } catch (error) {
      return rejectWithValue(error?.response?.data || "Signup failed");
    }
  }
);


const authSlice = createSlice({
  name: "auth",

  initialState: {
    loading: false,
    signupData: null,
    otpSent: false,
    otpVerified: false,
    error: null,
  },

  reducers: {},

  extraReducers: (builder) => {

    // ===== SEND OTP =====
    builder
      .addCase(sendOtpThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(sendOtpThunk.fulfilled, (state) => {
        state.loading = false;
        state.otpSent = true;
      })
      .addCase(sendOtpThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })


      // ===== VERIFY OTP =====
      .addCase(verifyOtpThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyOtpThunk.fulfilled, (state) => {
        state.loading = false;
        state.otpVerified = true;
      })
      .addCase(verifyOtpThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })


      // ===== SIGNUP =====
      .addCase(signupThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signupThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.signupData = action.payload;
      })
      .addCase(signupThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

  },
});

export default authSlice.reducer;