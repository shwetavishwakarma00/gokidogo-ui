import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  sendOtpEmail,
  verifyOtpEmail,
  customerSignup,
  customerLogin,
  getUserProfile,
  updateUserProfile,
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
      return rejectWithValue(error?.response?.data || "Login failed");
    }
  }
);

// ================= FETCH PROFILE =================
export const fetchProfileThunk = createAsyncThunk(
  "profile/fetch",
  async (data, { rejectWithValue }) => {
    try {
      const response = await getUserProfile(data);
      return response;
    } catch (error) {
      return rejectWithValue(error?.response?.data || "Profile fetch failed");
    }
  }
);

// ================= UPDATE PROFILE =================
export const updateProfileThunk = createAsyncThunk(
  "profile/update",
  async (data, { rejectWithValue }) => {
    try {
      const response = await updateUserProfile(data);
      return response;
    } catch (error) {
      return rejectWithValue(error?.response?.data || "Update failed");
    }
  }
);

// ================= LOAD USER FROM LOCALSTORAGE =================
// Ye refresh pe Redux state restore karta hai
const loadUserFromStorage = () => {
  try {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("user");
      if (stored) return JSON.parse(stored);
    }
  } catch {
    return null;
  }
  return null;
};

const storedUser = loadUserFromStorage();

// ================= INITIAL STATE =================
const initialState = {
  loading: false,
  otpSent: false,
  otpVerified: false,
  signupData: null,
  // ✅ Agar localStorage mein user hai toh status "succeeded" set karo
  status: storedUser ? "succeeded" : "idle",
  user: storedUser || null,
  profile: null,
  updateSuccess: false,
  apikey: storedUser?.apikey || null,
  error: null,
};

// ================= SLICE =================
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // ✅ Ye action manually user restore karne k liye (optional)
    restoreUser: (state) => {
      try {
        if (typeof window !== "undefined") {
          const stored = localStorage.getItem("user");
          if (stored) {
            const user = JSON.parse(stored);
            state.user = user;
            state.apikey = user?.apikey || null;
            state.status = "succeeded";
          }
        }
      } catch {
        state.user = null;
      }
    },
    logout: (state) => {
      state.user = null;
      state.profile = null;
      state.apikey = null;
      state.status = "idle";
      state.error = null;
      state.otpSent = false;
      state.otpVerified = false;
      state.signupData = null;
      state.loading = false;
      state.updateSuccess = false;
      // ✅ Logout pe localStorage bhi clear karo
      if (typeof window !== "undefined") {
        localStorage.removeItem("user");
      }
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
        const user = action.payload?.[0]?.DataValue?.[0];
        state.user = user;
        state.apikey = user?.apikey || null;
        // ✅ Login pe localStorage mein save karo
        if (typeof window !== "undefined") {
          localStorage.setItem("user", JSON.stringify(user));
        }
      })
      .addCase(loginThunk.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Login failed";
      });

    // ===== FETCH PROFILE =====
    builder
      .addCase(fetchProfileThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProfileThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
      })
      .addCase(fetchProfileThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // ===== UPDATE PROFILE =====
    builder
      .addCase(updateProfileThunk.pending, (state) => {
        state.loading = true;
        state.updateSuccess = false;
      })
      .addCase(updateProfileThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.updateSuccess = true;
        state.profile = action.payload?.DataValue || action.payload;
      })
      .addCase(updateProfileThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { logout, restoreUser } = authSlice.actions;
export default authSlice.reducer;