/* eslint-disable react-hooks/rules-of-hooks */
"use client";

import { useState, useRef, useEffect } from "react";
import { useDispatch } from "react-redux";
import {
  sendOTP,
  verifyOTP,
  registerUser,
  loginUser,
  getUserProfile,
} from "@/app/redux/features/authSlice";

import { motion, AnimatePresence } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { FiEye, FiEyeOff } from "react-icons/fi";

export default function AuthPage() {
  const dispatch = useDispatch();
  const router = useRouter();

  const otpRefs = Array.from({ length: 6 }, () => useRef(null));

  const [screen, setScreen] = useState("login");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [otp, setOtp] = useState(Array(6).fill(""));
  const [timer, setTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    gender: "",
    address: "",
    state: "",
    city: "",
    country: "",
    zip: "",
  });

  const [loginForm, setLoginForm] = useState({
    email: "",
    password: "",
  });

  const inputCls =
    "w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-purple-500 outline-none text-black bg-white text-sm";

  /* ================= VALIDATIONS ================= */
  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validatePhone = (phone) => /^[0-9]{8,15}$/.test(phone);
  const validatePassword = (password) => password.length >= 6;

  /* ================= HANDLERS ================= */
  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleLoginChange = (e) =>
    setLoginForm({ ...loginForm, [e.target.name]: e.target.value });

  /* ================= AUTO LOGIN ================= */
  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) router.push("/profile");
  }, []);

  /* ================= SEND OTP ================= */
  const sendOtp = async () => {
    if (!form.firstName || !form.lastName) return toast.error("Name required");
    if (!validateEmail(form.email)) return toast.error("Invalid email");
    if (!validatePhone(form.phone)) return toast.error("Invalid phone number");
    if (!validatePassword(form.password))
      return toast.error("Password must be at least 6 characters");
    if (form.password !== form.confirmPassword)
      return toast.error("Passwords don't match");

    try {
      setLoading(true);
      const res = await dispatch(sendOTP({ email: form.email })).unwrap();

      if (res?.message?.toLowerCase()?.includes("already")) {
        toast("User already registered. Please login.");
        setScreen("login");
        return;
      }

      toast.success("OTP sent 🚀");
      setScreen("otp");
      setTimer(30);
      setCanResend(false);
      setOtp(Array(6).fill(""));
    } catch {
      toast.error("Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  /* ================= VERIFY OTP ================= */
  const verifyOtp = async () => {
    const code = otp.join("");
    if (code.length !== 6) return toast.error("Enter valid OTP");

    try {
      setLoading(true);

      await dispatch(verifyOTP({ email: form.email, otp: code })).unwrap();

      // Save signup form data to localStorage so profile page can use it
      const signupData = {
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        mobile: form.phone,
        gender: form.gender,
        address: form.address,
        state: form.state,
        city: form.city,
        country: form.country,
        zip: form.zip,
      };
      localStorage.setItem("signupData", JSON.stringify(signupData));
      // Save password separately for local change password logic
      localStorage.setItem("userPassword", form.password);

      await dispatch(
        registerUser({
          firstname: form.firstName,
          lastname: form.lastName,
          email: form.email,
          mobile: form.phone,
          passwd: form.password,
          gender: form.gender,
          address: form.address,
          state: form.state,
          city: form.city,
          country: form.country,
          zip: form.zip,
        }),
      ).unwrap();

      toast.success("Signup Successful 🎉");
      setScreen("login");
    } catch {
      toast.error("Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  /* ================= LOGIN ================= */
  const login = async () => {
    if (!validateEmail(loginForm.email)) return toast.error("Enter valid email");
    if (!loginForm.password) return toast.error("Password required");

    try {
      setLoading(true);

      const response = await dispatch(
        loginUser({ usrid: loginForm.email, passwd: loginForm.password }),
      ).unwrap();

      const block = response?.data?.[0];
      const status = block?.LoginStatus?.[0]?.Status;
      if (status !== "Success") return toast.error(status || "Login failed");

      const user = block?.DataValue?.[0];
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("userPassword", loginForm.password);

      dispatch(
        getUserProfile({
          customer_ID: user.CustomerId,
          email: user.EmailAddress,
          apikey: user.apikey,
          deviceId: "web123",
        }),
      );

      toast.success("Login Successful 🎉");
      router.push("/profile");
    } catch {
      toast.error("Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  /* ================= OTP TIMER ================= */
  useEffect(() => {
    let interval;
    if (screen === "otp" && timer > 0) {
      interval = setInterval(() => setTimer((p) => p - 1), 1000);
    }
    if (timer === 0) setCanResend(true);
    return () => clearInterval(interval);
  }, [screen, timer]);

  /* ================= RESEND OTP ================= */
  const resendOtp = async () => {
    if (!canResend) return;
    try {
      setLoading(true);
      await dispatch(sendOTP({ email: form.email })).unwrap();
      toast.success("OTP Resent");
      setTimer(30);
      setCanResend(false);
      setOtp(Array(6).fill(""));
    } catch {
      toast.error("Failed to resend OTP");
    } finally {
      setLoading(false);
    }
  };

  /* ================= OTP PASTE HANDLER ================= */
  const handleOtpPaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (!pasted) return;
    const newOtp = Array(6).fill("");
    pasted.split("").forEach((char, i) => (newOtp[i] = char));
    setOtp(newOtp);
    const focusIdx = Math.min(pasted.length, 5);
    otpRefs[focusIdx]?.current?.focus();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-200 via-white to-purple-300 px-4 text-black">
      <Toaster />

      <div className="w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl bg-white rounded-3xl shadow-2xl p-6 sm:p-8 md:p-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={screen}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
          >
            {/* ─── LOGIN ─── */}
            {screen === "login" && (
              <div className="space-y-5">
                <h2 className="text-2xl sm:text-3xl font-bold text-center text-[#601b65]">
                  Sign In
                </h2>

                <input
                  className={inputCls}
                  placeholder="Email"
                  name="email"
                  value={loginForm.email}
                  onChange={handleLoginChange}
                />

                <div className="relative">
                  <input
                    className={inputCls}
                    placeholder="Password"
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={loginForm.password}
                    onChange={handleLoginChange}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-3 text-gray-500"
                    onClick={() => setShowPassword((p) => !p)}
                  >
                    {showPassword ? <FiEye size={18} /> : <FiEyeOff size={18} />}
                  </button>
                </div>

                <button
                  onClick={login}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-xl transition"
                >
                  {loading ? "Logging in..." : "Login"}
                </button>

                <p className="text-sm text-center text-black">
                  Not registered?{" "}
                  <span
                    className="text-purple-800 hover:text-red-600 cursor-pointer underline underline-offset-1 decoration-1"
                    onClick={() => setScreen("signup")}
                  >
                    Sign Up
                  </span>
                </p>
              </div>
            )}

            {/* ─── SIGNUP ─── */}
            {screen === "signup" && (
              <div className="space-y-4">
                <h2 className="text-2xl sm:text-3xl font-bold text-center text-black">
                  Create Account
                </h2>

                <div className="grid sm:grid-cols-2 gap-3">
                  <input className={inputCls} placeholder="First Name" name="firstName" onChange={handleChange} />
                  <input className={inputCls} placeholder="Last Name" name="lastName" onChange={handleChange} />
                </div>

                <input className={inputCls} placeholder="Email" name="email" onChange={handleChange} />
                <input className={inputCls} placeholder="Phone" name="phone" onChange={handleChange} />

                <div className="flex flex-wrap items-center gap-4 text-black">
                  <span className="text-[16px] font-medium">Gender :</span>
                  {["Male", "Female", "Other"].map((g) => (
                    <label key={g} className="flex items-center gap-1 cursor-pointer">
                      <input
                        type="radio"
                        name="gender"
                        value={g}
                        checked={form.gender === g}
                        onChange={handleChange}
                        className="accent-purple-600 w-4 h-4"
                      />
                      <span className="text-sm">{g}</span>
                    </label>
                  ))}
                </div>

                <input className={inputCls} placeholder="Address" name="address" onChange={handleChange} />

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <input className={inputCls} placeholder="State" name="state" onChange={handleChange} />
                  <input className={inputCls} placeholder="City" name="city" onChange={handleChange} />
                  <input className={inputCls} placeholder="Country" name="country" onChange={handleChange} />
                </div>

                <input className={inputCls} placeholder="Zip Code" name="zip" onChange={handleChange} />

                {/* Password with independent eye toggle */}
                <div className="relative">
                  <input
                    className={inputCls}
                    placeholder="Password"
                    type={showPassword ? "text" : "password"}
                    name="password"
                    onChange={handleChange}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-3 text-gray-500"
                    onClick={() => setShowPassword((p) => !p)}
                  >
                    {showPassword ? <FiEye size={18} /> : <FiEyeOff size={18} />}
                  </button>
                </div>

                {/* Confirm Password with independent eye toggle */}
                <div className="relative">
                  <input
                    className={inputCls}
                    placeholder="Confirm Password"
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    onChange={handleChange}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-3 text-gray-500"
                    onClick={() => setShowConfirmPassword((p) => !p)}
                  >
                    {showConfirmPassword ? <FiEye size={18} /> : <FiEyeOff size={18} />}
                  </button>
                </div>

                <button
                  onClick={sendOtp}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-xl transition"
                >
                  {loading ? "Sending OTP..." : "Register"}
                </button>

                <p className="text-sm text-center text-black">
                  Already have account?{" "}
                  <span
                    className="text-purple-800 hover:text-red-600 cursor-pointer underline underline-offset-1 decoration-1"
                    onClick={() => setScreen("login")}
                  >
                    Login
                  </span>
                </p>
              </div>
            )}

            {/* ─── OTP ─── */}
            {screen === "otp" && (
              <div className="space-y-5 text-center">
                {/* Back button */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setScreen("signup")}
                    className="flex items-center gap-1 text-purple-700 hover:text-purple-900 text-sm font-medium transition"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-4 h-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                    </svg>
                    Back
                  </button>
                </div>

                <h2 className="text-2xl sm:text-3xl font-bold text-black">Verify OTP</h2>
                <p className="text-sm text-gray-500">
                  Enter the 6-digit code sent to <span className="font-medium text-purple-700">{form.email}</span>
                </p>

                <div className="flex justify-center gap-2 flex-wrap">
                  {otp.map((d, i) => (
                    <input
                      key={i}
                      ref={otpRefs[i]}
                      maxLength={1}
                      className="w-12 h-12 border-2 border-gray-300 focus:border-purple-500 text-center text-lg rounded-xl text-black outline-none transition"
                      value={d}
                      onChange={(e) => {
                        const val = e.target.value;
                        if (!/^[0-9]?$/.test(val)) return;
                        const newOtp = [...otp];
                        newOtp[i] = val;
                        setOtp(newOtp);
                        if (val && i < 5) otpRefs[i + 1].current.focus();
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Backspace" && !otp[i] && i > 0) {
                          otpRefs[i - 1].current.focus();
                        }
                      }}
                      onPaste={i === 0 ? handleOtpPaste : undefined}
                    />
                  ))}
                </div>

                <button
                  onClick={verifyOtp}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-xl transition"
                >
                  {loading ? "Verifying..." : "Verify OTP"}
                </button>

                <p className="text-sm text-black">
                  {canResend ? (
                    <span
                      onClick={resendOtp}
                      className="text-purple-600 cursor-pointer hover:underline"
                    >
                      Resend OTP
                    </span>
                  ) : (
                    `Resend in ${timer}s`
                  )}
                </p>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}



