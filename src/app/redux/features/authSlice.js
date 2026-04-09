import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  sendOtpEmail,
  verifyOtpEmail,
  customerSignup,
  customerLogin,
} from "@/app/apis/authApi";

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

// ================= LOGIN =================
export const loginThunk = createAsyncThunk(
  "auth/login",
  async (loginData, { rejectWithValue }) => {
    try {
      const response = await customerLogin(loginData);
      return response;
    } catch (error) {
      return rejectWithValue(error?.response?.data || error.message);
    }
  }
);

const initialState = {
  loading: false,         // general loading
  otpSent: false,
  otpVerified: false,
  signupData: null,
  status: "idle",         // login status: idle | loading | succeeded | failed
  user: null,
  apikey: null,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.apikey = null;
      state.status = "idle";
      state.error = null;
      state.otpSent = false;
      state.otpVerified = false;
      state.signupData = null;
      state.loading = false;
    },
  },
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
      });

    // ===== VERIFY OTP =====
    builder
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
      });

    // ===== SIGNUP =====
    builder
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

    // ===== LOGIN =====
    builder
      .addCase(loginThunk.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(loginThunk.fulfilled, (state, action) => {
        state.status = "succeeded";
        const dataValue = action.payload[0]?.DataValue?.[0];
        state.user = dataValue || null;
        state.apikey = dataValue?.apikey || null;
      })
      .addCase(loginThunk.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Login failed";
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;