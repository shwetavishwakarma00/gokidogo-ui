import api from "@/app/apis/axiosInstance";

// SEND OTP
export const sendOtpEmail = async (data) => {
  const res = await api.post("/sendotpemail", data);
  return res.data;
};

// VERIFY OTP
export const verifyOtpEmail = async (data) => {
  const res = await api.post("/verifyotpemail", data);
  return res.data;
};

// SIGNUP
export const customerSignup = async (data) => {
  const res = await api.post("/customersignup", data);
  return res.data;
};

// LOGIN
export const customerLogin = async (data) => {
  const res = await api.post("/authcustomer", data);
  return res.data;
};

export const getUserProfile = async (data) => {
  const res = await api.post("/userprofile", data);
  return res.data;
};

export const updateUserProfile = async (data) => {
  const res = await api.post("/updateuserprofile", data);
  return res.data;
};