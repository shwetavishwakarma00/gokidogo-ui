"use client";

import { useState, useRef, useEffect } from "react";
import { useDispatch } from "react-redux";
import {
  sendOtpThunk,
  verifyOtpThunk,
  signupThunk,
  loginThunk,
  fetchProfileThunk,
} from "@/app/redux/features/authSlice";
import { motion, AnimatePresence } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { FiEye, FiEyeOff } from "react-icons/fi";

export default function AuthPage() {
  const dispatch = useDispatch();
  const router = useRouter();

  const otpRefs = [
    useRef(null), useRef(null), useRef(null),
    useRef(null), useRef(null), useRef(null),
  ];

  const [screen, setScreen] = useState("login");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [otp, setOtp] = useState(Array(6).fill(""));
  const [timer, setTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const [otpError, setOtpError] = useState(false);

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    dob: "",
    gender: "",
    address: "",
    state: "",
    city: "",
    country: "",
  });

  const [loginForm, setLoginForm] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleLoginChange = (e) =>
    setLoginForm({ ...loginForm, [e.target.name]: e.target.value });

  /* OTP INPUT */
  const handleOtpChange = (value, index) => {
    if (!/^[0-9]?$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setOtpError(false);
    if (value && index < 5) otpRefs[index + 1].current?.focus();
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0)
      otpRefs[index - 1].current?.focus();
  };

  const handlePasteOtp = (e) => {
  e.preventDefault();

  const pasteData = e.clipboardData.getData("text").trim();

  if (!/^\d+$/.test(pasteData)) return;

  const digits = pasteData.slice(0, 6).split("");

  const newOtp = [...otp];

  digits.forEach((num, i) => {
    newOtp[i] = num;
    if (otpRefs[i]?.current) {
      otpRefs[i].current.value = num;
    }
  });

  setOtp(newOtp);

  // move focus to last filled input
  const nextIndex = digits.length < 6 ? digits.length : 5;
  otpRefs[nextIndex]?.current?.focus();
};

  /* SEND OTP */
  const sendOtp = async () => {
    if (!form.email) return toast.error("Email required");
    if (form.password !== form.confirmPassword)
      return toast.error("Passwords don't match");

    try {
      setLoading(true);
      await dispatch(sendOtpThunk({ deviceId: "web123", email: form.email })).unwrap();

      toast.success("OTP sent 🚀");
      setScreen("otp");
      setTimer(30);
      setCanResend(false);
      setOtp(Array(6).fill(""));
    } catch {
      toast.error("OTP failed");
    } finally {
      setLoading(false);
    }
  };

  /* VERIFY OTP + SIGNUP */
  const verifyOtp = async () => {
    const code = otp.join("");
    if (code.length < 6) return toast.error("Enter full OTP");

    try {
      setLoading(true);
      setOtpError(false);

      await dispatch(
        verifyOtpThunk({ deviceId: "web123", email: form.email, otp: code })
      ).unwrap();

      await dispatch(
        signupThunk({
          firstname: form.firstName,
          lastname: form.lastName,
          email: form.email,
          mobile: form.phone,
          passwd: form.password,
          gender: form.gender,
          dob: form.dob,
          address: form.address,
          state: form.state,
          city: form.city,
          country: form.country,
        })
      ).unwrap();

      const genderLabel = { "1": "Male", "2": "Female", "3": "Other" };

      localStorage.setItem(
        "signupData",
        JSON.stringify({
          firstName: form.firstName,
          lastName: form.lastName,
          email: form.email,
          mobile: form.phone,
          dateOfBirth: form.dob,
          gender: genderLabel[form.gender] || form.gender,
          address: form.address,
          state: form.state,
          city: form.city,
          country: form.country,
        })
      );

      // ✅ AUTO FILL LOGIN
      setLoginForm({
        email: form.email,
        password: form.password,
      });

      toast.success("Signup Successful 🎉");

      setTimeout(() => setScreen("login"), 1200);
    } catch {
      setOtpError(true);
      toast.error("Invalid OTP ❌");
    } finally {
      setLoading(false);
    }
  };

  /* LOGIN */
 const login = async () => {
  if (!loginForm.email || !loginForm.password) {
    toast.error("Email & Password required");
    return;
  }

  try {
    setLoading(true);

    const response = await dispatch(
      loginThunk({
        usrid: loginForm.email,
        passwd: loginForm.password,
        deviceid: "web123",
      })
    ).unwrap();

    const users = response?.data?.[0]?.DataValue;

    if (!users || users.length === 0) {
      return toast.error("Invalid login");
    }

    const user = users[0]; // API should already return matched user

    if (
      user.EmailAddress !== loginForm.email
    ) {
      return toast.error("Invalid email or password");
    }

    localStorage.setItem("user", JSON.stringify(user));

    dispatch(
      fetchProfileThunk({
        customer_ID: user.CustomerId,
        email: user.EmailAddress,
        apikey: user.apikey,
        deviceId: "web123",
      })
    );

    toast.success("Login Successful 🎉");
    setTimeout(() => router.push("/profile"), 1500);

  } catch (err) {
    toast.error("Invalid email or password");
  } finally {
    setLoading(false);
  }
};

  /* TIMER */
  useEffect(() => {
    let interval;
    if (screen === "otp" && timer > 0)
      interval = setInterval(() => setTimer((p) => p - 1), 1000);
    if (timer === 0) setCanResend(true);
    return () => clearInterval(interval);
  }, [screen, timer]);

  const resendOtp = async () => {
    try {
      setLoading(true);
      await dispatch(sendOtpThunk({ deviceId: "web123", email: form.email })).unwrap();
      toast.success("OTP Resent 🚀");
      setTimer(30);
      setCanResend(false);
      setOtp(Array(6).fill(""));
    } catch {
      toast.error("Failed to resend OTP");
    } finally {
      setLoading(false);
    }
  };

  const inputCls =
    "w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 outline-none text-black bg-white text-sm";

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-100 to-purple-300 p-4 sm:p-6 md:p-8">
      <Toaster />

      <AnimatePresence mode="wait">
        <motion.div
          key={screen}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -30 }}
          transition={{ duration: 0.3 }}
          className="w-full max-w-3xl bg-white p-5 sm:p-8 md:p-10 rounded-2xl shadow-2xl border border-purple-200"
        >

          {/* LOGIN */}
          {screen === "login" && (
            <div className="space-y-4 sm:space-y-5">
              <h1 className="text-center text-xl sm:text-2xl md:text-3xl font-bold text-purple-900 underline underline-offset-2 decoration-2">
                Welcome Back 👋
              </h1>

              <input
                className={inputCls}
                name="email"
                placeholder="Email"
                value={loginForm.email}
                onChange={handleLoginChange}
              />

              <div className="relative">
                <input
                  className={inputCls}
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={loginForm.password}
                  onChange={handleLoginChange}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-gray-500"
                >
                  {showPassword ? <FiEye /> : <FiEyeOff />}
                </button>
              </div>

              <button
                onClick={login}
                disabled={loading}
                className="w-full bg-purple-500 hover:bg-purple-600 text-white py-2 sm:py-3 rounded-lg font-semibold"
              >
                {loading ? "Logging in..." : "Login"}
              </button>

              <p className="text-center text-sm text-black">
                Not registered?{" "}
                <span
                  onClick={() => setScreen("signup")}
                  className="text-blue-700 text-[16px] underline cursor-pointer"
                >
                  SignUp
                </span>
              </p>
            </div>
          )}

          {/* SIGNUP */}
          {screen === "signup" && (
            <div className="space-y-4">
              <h1 className="text-center text-xl sm:text-2xl md:text-3xl font-bold text-purple-900">
                Create Account
              </h1>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <input className={inputCls} name="firstName" placeholder="First Name" onChange={handleChange} />
                <input className={inputCls} name="lastName" placeholder="Last Name" onChange={handleChange} />
              </div>

              <input className={inputCls} name="email" placeholder="Email Address" onChange={handleChange} />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <input className={inputCls} name="phone" placeholder="Mobile Number" onChange={handleChange} />
                <input className={inputCls} type="date" name="dob" onChange={handleChange} />
              </div>

              <textarea className={inputCls} name="address" placeholder="Address" rows={2} onChange={handleChange} />

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                <input className={inputCls} name="city" placeholder="City" onChange={handleChange} />
                <input className={inputCls} name="state" placeholder="State" onChange={handleChange} />
                <input className={inputCls} name="country" placeholder="Country" onChange={handleChange} />
              </div>

              <div className="flex flex-wrap gap-4 text-black text-sm">
                {[["1", "Male"], ["2", "Female"], ["3", "Other"]].map(([val, label]) => (
                  <label key={val} className="flex items-center gap-1">
                    <input type="radio" name="gender" value={val} onChange={handleChange} />
                    {label}
                  </label>
                ))}
              </div>

              {/* PASSWORD */}
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Password"
                  onChange={handleChange}
                  className={inputCls}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-gray-500"
                >
                  {showPassword ? <FiEye /> : <FiEyeOff />}
                </button>
              </div>

              {/* CONFIRM PASSWORD */}
              <div className="relative">
                <input
                  type={showConfirm ? "text" : "password"}
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  onChange={handleChange}
                  className={inputCls}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3 top-3 text-gray-500"
                >
                  {showConfirm ? <FiEye /> : <FiEyeOff />}
                </button>
              </div>

              <button
                onClick={sendOtp}
                disabled={loading}
                className="w-full bg-purple-500 hover:bg-purple-600 text-white py-2 sm:py-3 rounded-lg font-semibold"
              >
                {loading ? "Sending OTP..." : "SignUp"}
              </button>

              <p className="text-center text-sm text-black">
                Already have account?{" "}
                <span
                  onClick={() => setScreen("login")}
                  className="text-blue-700 text-[16px] underline cursor-pointer"
                >
                  Login
                </span>
              </p>
            </div>
          )}

          {/* OTP */}
         {screen === "otp" && (
  <div className="text-center space-y-5 sm:space-y-6">
    
    <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-purple-900">
      Verify OTP
    </h1>

    <div
      className="flex justify-center text-black gap-2 sm:gap-3 flex-wrap"
      onPaste={handlePasteOtp}   
    >
      {otp.map((digit, index) => (
        <input
          key={index}
          ref={otpRefs[index]}
          value={digit}
          type="text"
          inputMode="numeric"     // ✅ mobile numeric keyboard
          pattern="[0-9]*"
          maxLength={1}
          className={`w-10 sm:w-12 h-12 sm:h-14 text-center text-lg sm:text-xl border-2 rounded-xl outline-none ${
            otpError ? "border-red-500" : "border-purple-300"
          }`}
          onChange={(e) => handleOtpChange(e.target.value, index)}
          onKeyDown={(e) => handleKeyDown(e, index)}
        />
      ))}
    </div>

    <p className="text-sm text-gray-500">
      {timer > 0 ? `Resend OTP in ${timer}s` : ""}
    </p>

    {canResend && (
      <button
        onClick={resendOtp}
        className="text-red-600 underline text-sm"
      >
        Resend OTP
      </button>
    )}

    <button
      onClick={verifyOtp}
      disabled={loading}
      className="w-full bg-purple-500 hover:bg-purple-600 text-white py-2 sm:py-3 rounded-lg font-semibold"
    >
      {loading ? "Verifying..." : "Verify OTP"}
    </button>

    <p className="text-sm text-black">
      Wrong email?{" "}
      <span
        onClick={() => setScreen("signup")}
        className="text-blue-700 text-[16px] underline cursor-pointer"
      >
        Go back
      </span>
    </p>
  </div>
)}

        </motion.div>
      </AnimatePresence>
    </div>
  );
}