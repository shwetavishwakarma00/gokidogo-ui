import {
  customerLogin,
  customerSignup,
  sendOtpEmail,
  verifyOtpEmail,
  getUserProfileAPI,
  updateUserProfileAPI,
  forgotPasswordApi,
  orderHistoryApi
} from "@/app/apis/authApi";

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// ── LOGIN 
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

// ── REGISTER 
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

// ── SEND OTP 
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

// ── VERIFY OTP
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

// ── FORGOT PASSWORD 
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

// ── GET USER PROFILE 
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

// ── UPDATE USER PROFILE 
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

//order history
export const getOrderHistory = createAsyncThunk(
  "auth/getOrderHistory",
  async (data, { rejectWithValue }) => {
    try {
      const res = await orderHistoryApi(data);
      if (res.data?.status === 0) return rejectWithValue(res.data.message);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Order History Failed");
    }
  }
);


// ── CHANGE PASSWORD
export const changePassword = createAsyncThunk(
  "auth/changePassword",
  async (data, { rejectWithValue }) => {
    try {
      const res = await changePasswordApi(data);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Error");
    }
  }
);

// ── SLICE ─────────────────────────────────────────────────────────────────────
const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,       
    profile: null,    
    loading: false,
    error: null,
    message: null,
    orders: [],
    ordersLoading: false,
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

      // ── LOGIN 
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ── REGISTER 
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

      // ── SEND OTP 
      .addCase(sendOTP.pending, (state) => { state.loading = true; })
      .addCase(sendOTP.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload?.message || "OTP Sent";
      })
      .addCase(sendOTP.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ── VERIFY OTP 
      .addCase(verifyOTP.pending, (state) => { state.loading = true; })
      .addCase(verifyOTP.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload?.message || "OTP Verified";
      })
      .addCase(verifyOTP.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ── FORGOT PASSWORD 
      .addCase(forgotPassword.pending, (state) => { state.loading = true; })
      .addCase(forgotPassword.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload?.message;
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ── GET USER PROFILE 
      .addCase(getUserProfile.pending, (state) => { state.loading = true; })
      .addCase(getUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload?.data; // the customer row object
      })
      .addCase(getUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ── UPDATE USER PROFILE 
      .addCase(updateUserProfile.pending, (state) => { state.loading = true; })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload?.message;
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ── GET ORDER HISTORY 
      .addCase(getOrderHistory.pending, (state) => { state.ordersLoading = true; })
      .addCase(getOrderHistory.fulfilled, (state, action) => {
        state.ordersLoading = false;
        state.orders = action.payload?.data || [];
      })
      .addCase(getOrderHistory.rejected, (state, action) => {
        state.ordersLoading = false;
        state.error = action.payload;
      })

      // ── CHANGE PASSWORD
       // CHANGE PASSWORD
      .addCase(changePassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(changePassword.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload.message;
      })

      .addCase(changePassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Password change failed";
      });
  },
});



export const { logout, clearError, clearMessage } = authSlice.actions;
export default authSlice.reducer;