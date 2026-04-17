import { 
  customerLogin,
  customerSignup,
  sendOtpEmail,
  verifyOtpEmail,
  getUserProfile as getUserProfileAPI,
  updateUserProfile as updateUserProfileAPI
} from "@/app/apis/authApi";import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";



// LOGIN
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

// REGISTER
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

// SEND OTP
export const sendOTP = createAsyncThunk(
  "auth/sendOTP",
  async (data, { rejectWithValue }) => {
    try {
      const res = await sendOtpEmail(data);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || "OTP Send Failed");
    }
  }
);

// VERIFY OTP
export const verifyOTP = createAsyncThunk(
  "auth/verifyOTP",
  async (data, { rejectWithValue }) => {
    try {
      const res = await verifyOtpEmail(data);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || "OTP Verification Failed");
    }
  }
);

// FORGOT PASSWORD
export const forgotPassword = createAsyncThunk(
  "auth/forgotPassword",
  async (data, { rejectWithValue }) => {
    try {
      const res = await axios.post(`${API}/customer/forgot-password`, data);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Password Reset Failed");
    }
  }
);

// GET USER PROFILE
export const getUserProfile = createAsyncThunk(
  "auth/getUserProfile",
  async (data, { rejectWithValue }) => {
    try {
      const res = await getUserProfileAPI(data);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Profile Fetch Failed");
    }
  }
);

// UPDATE USER PROFILE
export const updateUserProfile = createAsyncThunk(
  "auth/updateUserProfile",
  async (data, { rejectWithValue }) => {
    try {
      const res = await updateUserProfileAPI(data);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Profile Update Failed");
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
  user: null,
  profile: null,
  loading: false,
  error: null,
  message: null
},

  reducers: {
    logout: (state) => {
      state.user = null;
      state.message = null;
    }
  },

  extraReducers: (builder) => {

    builder

      // LOGIN
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // REGISTER
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // SEND OTP
      .addCase(sendOTP.fulfilled, (state, action) => {
        state.message = action.payload;
      })

      // VERIFY OTP
      .addCase(verifyOTP.fulfilled, (state, action) => {
        state.message = action.payload;
      })

      // FORGOT PASSWORD
      .addCase(forgotPassword.fulfilled, (state, action) => {
        state.message = action.payload;
      })



      // GET USER PROFILE
.addCase(getUserProfile.pending, (state) => {
  state.loading = true;
})
.addCase(getUserProfile.fulfilled, (state, action) => {
  state.loading = false;
  state.profile = action.payload.data;
})
.addCase(getUserProfile.rejected, (state, action) => {
  state.loading = false;
  state.error = action.payload;
})

// UPDATE USER PROFILE
.addCase(updateUserProfile.pending, (state) => {
  state.loading = true;
})
.addCase(updateUserProfile.fulfilled, (state, action) => {
  state.loading = false;
  state.message = action.payload.message;
})
.addCase(updateUserProfile.rejected, (state, action) => {
  state.loading = false;
  state.error = action.payload;
})
  }
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;