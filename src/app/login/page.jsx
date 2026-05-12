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
  forgotPassword,
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

  /* ── VALIDATIONS ─────────────────────────────────────────────────────────── */
  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validatePhone = (phone) => /^[0-9]{8,15}$/.test(phone);
  const validatePassword = (password) => password.length >= 6;

  /* ── HANDLERS ────────────────────────────────────────────────────────────── */
  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleLoginChange = (e) =>
    setLoginForm({ ...loginForm, [e.target.name]: e.target.value });

  /* ── AUTO LOGIN ──────────────────────────────────────────────────────────── */
  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) router.push("/profile");
  }, []);

  /* ── SEND OTP ────────────────────────────────────────────────────────────── */
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

      // Step 1: Register first — password gets MD5-hashed and stored correctly
      const registerRes = await dispatch(
        registerUser({
          email:     form.email,
          firstname: form.firstName,
          lastname:  form.lastName,
          mobile:    form.phone,
          passwd:    form.password,
          gender:    form.gender,
          address:   form.address,
          state:     form.state,
          city:      form.city,
          country:   form.country,
          zip:       form.zip,
        }),
      ).unwrap();

      // Already registered → go to login
      const regStatus = registerRes?.RegisterStatus?.[0]?.Status;
      if (regStatus === "Failure") {
        toast("Already registered — please login.");
        setScreen("login");
        return;
      }

      // Step 2: Send OTP after successful registration
      await dispatch(sendOTP({ email: form.email })).unwrap();

      toast.success("OTP sent 🚀");
      setScreen("otp");
      setTimer(30);
      setCanResend(false);
      setOtp(Array(6).fill(""));
    } catch (err) {
      toast.error(typeof err === "string" ? err : "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  /* ── VERIFY OTP ──────────────────────────────────────────────────────────── */
    const verifyOtp = async () => {
    const code = otp.join("");
    if (code.length !== 6) return toast.error("Enter valid OTP");

    try {
      setLoading(true);
      await dispatch(verifyOTP({ email: form.email, otp: code })).unwrap();
      toast.success("Account verified! Please login 🎉");
      setScreen("login");
    } catch (err) {
      toast.error(typeof err === "string" ? err : "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  /* ── LOGIN ───────────────────────────────────────────────────────────────── */
  const login = async () => {
    if (!validateEmail(loginForm.email)) return toast.error("Enter valid email");
    if (!loginForm.password) return toast.error("Password required");

    try {
      setLoading(true);

      // Backend expects: { username (email), password, deviceid }
      // authApi.js maps usrid → username, passwd → password
      const response = await dispatch(
        loginUser({ usrid: loginForm.email, passwd: loginForm.password }),
      ).unwrap();

      // response is already res.data (array) from axios via Redux
      // structure: [{ LoginStatus: [{Status}], DataValue: [userObj] }]
      const block = Array.isArray(response) ? response[0] : response?.data?.[0];
      const status = block?.LoginStatus?.[0]?.Status;
      if (status !== "Success") return toast.error(status || "Login failed");

      const user = block?.DataValue?.[0];
      localStorage.setItem("user", JSON.stringify(user));

      // Fetch profile immediately after login — backend only needs email
      dispatch(getUserProfile({ email: user.EmailAddress }));

      toast.success("Login Successful 🎉");
      router.push("/profile");
    } catch (err) {
      toast.error("Invalid email or password");
    } finally {
      setLoading(false);
    }
  };


  /* ── OTP TIMER ───────────────────────────────────────────────────────────── */
  useEffect(() => {
    let interval;
    if (screen === "otp" && timer > 0) {
      interval = setInterval(() => setTimer((p) => p - 1), 1000);
    }
    if (timer === 0) setCanResend(true);
    return () => clearInterval(interval);
  }, [screen, timer]);

  /* ── RESEND OTP ──────────────────────────────────────────────────────────── */
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

  /* ── OTP PASTE HANDLER ───────────────────────────────────────────────────── */
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

  // forget- password flow
  const forgotPasswordHandler = async () => {
  if (!validateEmail(loginForm.email))
    return toast.error("Enter valid email");

  try {
    setLoading(true);

    await dispatch(
      forgotPassword({ email: loginForm.email })
    ).unwrap();

    toast.success("Password reset link sent to your email");
    setScreen("forgotOtp");
  } catch (err) {
    toast.error(typeof err === "string" ? err : "Failed to reset password");
  } finally {
    setLoading(false);
  }
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
                <p
  className="text-sm text-right text-purple-700 cursor-pointer hover:underline"
  onClick={() => setScreen("forgot")}
>
  Forgot Password?
</p>

                <button
                  onClick={login}
                  disabled={loading}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-xl transition disabled:opacity-60"
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
                  disabled={loading}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-xl transition disabled:opacity-60"
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
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setScreen("signup")}
                    className="flex items-center gap-1 text-purple-700 hover:text-purple-900 text-sm font-medium transition"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                    </svg>
                    Back
                  </button>
                </div>

                <h2 className="text-2xl sm:text-3xl font-bold text-black">Verify OTP</h2>
                <p className="text-sm text-gray-500">
                  Enter the 6-digit code sent to{" "}
                  <span className="font-medium text-purple-700">{form.email}</span>
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
                  disabled={loading}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-xl transition disabled:opacity-60"
                >
                  {loading ? "Verifying..." : "Verify OTP"}
                </button>

                <p className="text-sm text-black">
                  {canResend ? (
                    <span onClick={resendOtp} className="text-purple-600 cursor-pointer hover:underline">
                      Resend OTP
                    </span>
                  ) : (
                    `Resend in ${timer}s`
                  )}
                </p>
              </div>
            )}

            {/* ─── FORGOT PASSWORD ─── */}
{screen === "forgot" && (
  <div className="space-y-5">
    <button
      onClick={() => setScreen("login")}
      className="text-purple-700 text-sm"
    >
      ← Back
    </button>

    <h2 className="text-2xl font-bold text-center text-black">
      Forgot Password
    </h2>

    <p className="text-sm text-gray-500 text-center">
      Enter your email to reset your password
    </p>

    <input
      className={inputCls}
      placeholder="Enter Email"
      name="email"
      value={loginForm.email}
      onChange={handleLoginChange}
    />

    <button
      onClick={forgotPasswordHandler}
      disabled={loading}
      className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-xl"
    >
      {loading ? "Sending..." : "Reset Password"}
    </button>
  </div>
)}

{screen === "forgotOtp" && (
  <div className="space-y-5 text-center">

    <h2 className="text-2xl font-bold">Verify OTP</h2>

    <div className="flex justify-center gap-2">
      {otp.map((d, i) => (
        <input
          key={i}
          ref={otpRefs[i]}
          maxLength={1}
          className="w-12 h-12 border text-center"
          value={d}
          onChange={(e) => {
            const val = e.target.value;
            const newOtp = [...otp];
            newOtp[i] = val;
            setOtp(newOtp);
          }}
        />
      ))}
    </div>

    <button
      onClick={() => {
        toast.success("OTP Verified");
        setScreen("resetPassword");
      }}
      className="w-full bg-purple-600 text-white py-3 rounded-xl"
    >
      Verify OTP
    </button>

  </div>
)}

{screen === "resetPassword" && (
  <div className="space-y-5">

    <h2 className="text-2xl font-bold text-center">
      Set New Password
    </h2>

    <input
      className={inputCls}
      placeholder="New Password"
      type="password"
      onChange={(e) =>
        setLoginForm({ ...loginForm, password: e.target.value })
      }
    />

    <button
      onClick={async () => {
        try {
          await dispatch(
            forgotPassword({
              email: loginForm.email,
              password: loginForm.password,
            })
          ).unwrap();

          toast.success("Password Updated");
          setScreen("login");

        } catch {
          toast.error("Failed to update password");
        }
      }}
      className="w-full bg-purple-600 text-white py-3 rounded-xl"
    >
      Update Password
    </button>

  </div>
)}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}