import {
  customerLogin,
  customerSignup,
  sendOtpEmail,
  verifyOtpEmail,
  getUserProfileAPI,
  updateUserProfileAPI,
  forgotPasswordApi,
} from "@/app/apis/authApi";

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// ── LOGIN ─────────────────────────────────────────────────────────────────────
// Sends: { usrid (email), passwd, deviceid }
// Receives: [{ LoginStatus: [{ Status }], DataValue: [userObj] }]
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (data, { rejectWithValue }) => {
    try {
      const res = await customerLogin(data);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Login Failed");
    }
  }
);

// ── REGISTER ──────────────────────────────────────────────────────────────────
// Sends: { email, firstname, lastname, mobile, passwd, gender, address,
//          state, city, country, zip, newsl, smssub }
// Receives: { RegisterStatus: [{ Status }], DataValue: [{ Message }] }
export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async (data, { rejectWithValue }) => {
    try {
      const res = await customerSignup(data);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Register Failed");
    }
  }
);

// ── SEND OTP ──────────────────────────────────────────────────────────────────
// Sends: { email }
// Receives: { status: 1|0, message }
export const sendOTP = createAsyncThunk(
  "auth/sendOTP",
  async (data, { rejectWithValue }) => {
    try {
      const res = await sendOtpEmail(data);
      // Throw if backend reports failure so catch blocks in UI work correctly
      if (res.data?.status === 0) return rejectWithValue(res.data.message);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || "OTP Send Failed");
    }
  }
);

// ── VERIFY OTP ────────────────────────────────────────────────────────────────
// Sends: { email, otp }
// Receives: { status: 1|0, message }
export const verifyOTP = createAsyncThunk(
  "auth/verifyOTP",
  async (data, { rejectWithValue }) => {
    try {
      const res = await verifyOtpEmail(data);
      if (res.data?.status === 0) return rejectWithValue(res.data.message);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || "OTP Verification Failed");
    }
  }
);

// ── FORGOT PASSWORD ───────────────────────────────────────────────────────────
// Sends: { email } to check  OR  { email, password } to reset
// Receives: { status: 1|0, message }
export const forgotPassword = createAsyncThunk(
  "auth/forgotPassword",
  async (data, { rejectWithValue }) => {
    try {
      const res = await forgotPasswordApi(data);
      if (res.data?.status === 0) return rejectWithValue(res.data.message);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Password Reset Failed");
    }
  }
);

// ── GET USER PROFILE ──────────────────────────────────────────────────────────
// Sends: { email }
// Receives: { status, message, data: { customerId, firstName, lastName, ... } }
export const getUserProfile = createAsyncThunk(
  "auth/getUserProfile",
  async (data, { rejectWithValue }) => {
    try {
      const res = await getUserProfileAPI(data);
      if (res.data?.status === 0) return rejectWithValue(res.data.message);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Profile Fetch Failed");
    }
  }
);

// ── UPDATE USER PROFILE ───────────────────────────────────────────────────────
// Sends: { email, firstName, lastName, mobile, phone, gender,
//          dateOfBirth, address, city, zip, country, title }
// Receives: { status: 1, message: "Profile updated successfully" }
export const updateUserProfile = createAsyncThunk(
  "auth/updateUserProfile",
  async (data, { rejectWithValue }) => {
    try {
      const res = await updateUserProfileAPI(data);
      if (res.data?.status === 0) return rejectWithValue(res.data.message);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Profile Update Failed");
    }
  }
);

// ── SLICE ─────────────────────────────────────────────────────────────────────
const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,       // raw login DataValue[0] object from backend
    profile: null,    // getUserProfile data object from backend
    loading: false,
    error: null,
    message: null,
  },

  reducers: {
    logout: (state) => {
      state.user = null;
      state.profile = null;
      state.message = null;
      state.error = null;
    },
    clearError: (state) => { state.error = null; },
    clearMessage: (state) => { state.message = null; },
  },

  extraReducers: (builder) => {
    builder

      // ── LOGIN ──────────────────────────────────────────────────────────────
      // Backend returns: [{ LoginStatus:[{Status}], DataValue:[userObj] }]
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        // Store the full raw response; UI extracts DataValue[0] for localStorage
        state.user = action.payload;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ── REGISTER ───────────────────────────────────────────────────────────
      // Backend returns: { RegisterStatus:[{Status}], DataValue:[{Message}] }
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload?.DataValue?.[0]?.Message || "Registered";
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ── SEND OTP ───────────────────────────────────────────────────────────
      .addCase(sendOTP.pending, (state) => { state.loading = true; })
      .addCase(sendOTP.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload?.message || "OTP Sent";
      })
      .addCase(sendOTP.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ── VERIFY OTP ─────────────────────────────────────────────────────────
      .addCase(verifyOTP.pending, (state) => { state.loading = true; })
      .addCase(verifyOTP.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload?.message || "OTP Verified";
      })
      .addCase(verifyOTP.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ── FORGOT PASSWORD ────────────────────────────────────────────────────
      .addCase(forgotPassword.pending, (state) => { state.loading = true; })
      .addCase(forgotPassword.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload?.message;
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ── GET USER PROFILE ───────────────────────────────────────────────────
      // Backend returns: { status, message, data: { customerId, firstName, ... } }
      .addCase(getUserProfile.pending, (state) => { state.loading = true; })
      .addCase(getUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload?.data; // the customer row object
      })
      .addCase(getUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ── UPDATE USER PROFILE ────────────────────────────────────────────────
      // Backend returns: { status: 1, message: "Profile updated successfully" }
      .addCase(updateUserProfile.pending, (state) => { state.loading = true; })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload?.message;
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { logout, clearError, clearMessage } = authSlice.actions;
export default authSlice.reducer;