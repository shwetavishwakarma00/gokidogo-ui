// import api from "@/app/apis/axiosInstance";

// // SEND OTP
// export const sendOtpEmail = async (data) => {
//   const res = await api.post("/sendotpemail", data);
//   return res.data;
// };

// // VERIFY OTP
// export const verifyOtpEmail = async (data) => {
//   const res = await api.post("/verifyotpemail", data);
//   return res.data;
// };

// // SIGNUP
// export const customerSignup = async (data) => {
//   const res = await api.post("/customersignup", data);
//   return res.data;
// };

// // LOGIN
// export const customerLogin = async (data) => {
//   const res = await api.post("/authcustomer", data);
//   return res.data;
// };

// export const getUserProfile = async (data) => {
//   const res = await api.post("/userprofile", data);
//   return res.data;
// };

// export const updateUserProfile = async (data) => {
//   const res = await api.post("/updateuserprofile", data);
//   return res.data;
// };


import api from "@/app/apis/axiosInstance";

// POST /custlogin
export const customerLogin = (data) =>
  api.post("/custlogin", {
    usrid:    data.usrid,    // controller: data.usrid || data.email
    passwd:   data.passwd,   // controller: data.passwd || data.password
    deviceid: data.deviceid || "web123",
  });

// POST /customersignup
export const customerSignup = (data) =>
  api.post("/customersignup", {
    email:     data.email,
    firstname: data.firstname,
    lastname:  data.lastname,
    gender:    data.gender   || "",
    mobile:    data.mobile   || "",
    passwd:    data.passwd,
    address:   data.address  || "",
    state:     data.state    || "",
    city:      data.city     || "",
    country:   data.country  || "",
    zip:       data.zip      || "",
    newsl:     data.newsl    || "0",
    smssub:    data.smssub   || "0",
    ipadd:     data.ipadd    || "",
  });

// POST /sendotpemail
export const sendOtpEmail = (data) =>
  api.post("/sendotpemail", { email: data.email });

// POST /verifyotpemail
export const verifyOtpEmail = (data) =>
  api.post("/verifyotpemail", { email: data.email, otp: data.otp });

// POST /forgotpassword
export const forgotPasswordApi = (data) =>
  api.post("/forgotpassword", {
    email:    data.email,
    password: data.password || undefined,
  });

// POST /userprofile
export const getUserProfileAPI = (data) =>
  api.post("/userprofile", { email: data.email });

// POST /updateuserprofile
export const updateUserProfileAPI = (data) =>
  api.post("/updateuserprofile", {
    email:       data.email,
    firstName:   data.firstName   || "",
    lastName:    data.lastName    || "",
    mobile:      data.mobile      || "",
    phone:       data.phone       || "",
    gender:      data.gender      || "",
    dateOfBirth: data.dateOfBirth || "",
    address:     data.address     || "",
    city:        data.city        || "",
    zip:         data.zip         || "",
    country:     data.country     || "",
    title:       data.title       || "",
  });

  //order history
  export const orderHistoryApi = (data) =>
  api.post("/orderhistory", { email: data.email });