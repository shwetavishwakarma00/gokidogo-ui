import api from "@/app/apis/axiosInstance";

// SEND OTP
export const sendOtpEmail = async (data) => {
  const res = await api.post("/auth/send-otp", data);
  return res.data;
};

// VERIFY OTP
export const verifyOtpEmail = async (data) => {
  const res = await api.post("/auth/verify-otp", data);
  return res.data;
};

// SIGNUP
export const customerSignup = async (data) => {
  const res = await api.post("/auth/signup", data);
  return res.data;
};

// LOGIN
export const customerLogin = async (data) => {
  const res = await api.post("/auth/login", data);
  return res.data;
};