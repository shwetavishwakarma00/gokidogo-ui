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
import { useTranslation } from "react-i18next";

export default function AuthPage() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { t } = useTranslation();

  const otpRefs = [
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
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

  /* ================= OTP COPY PASTE (ONLY ADDITION) ================= */
  const handlePasteOtp = (e) => {
    e.preventDefault();

    const pastedData = e.clipboardData.getData("text").trim();

    if (!/^\d+$/.test(pastedData)) return;

    const digits = pastedData.slice(0, 6).split("");

    const newOtp = [...otp];

    digits.forEach((num, i) => {
      newOtp[i] = num;
    });

    setOtp(newOtp);

    const nextIndex = digits.length < 6 ? digits.length : 5;
    otpRefs[nextIndex]?.current?.focus();
  };

  /* ================= SEND OTP ================= */
  const sendOtp = async () => {
    if (!form.email) return toast.error("Email required");
    if (form.password !== form.confirmPassword)
      return toast.error("Passwords don't match");

    try {
      setLoading(true);

      await dispatch(
        sendOtpThunk({ deviceId: "web123", email: form.email })
      ).unwrap();

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

  /* ================= VERIFY OTP + SIGNUP ================= */
  const verifyOtp = async () => {
    const code = otp.join("");
    if (code.length < 6) return toast.error("Enter full OTP");

    try {
      setLoading(true);
      setOtpError(false);

      await dispatch(
        verifyOtpThunk({
          deviceId: "web123",
          email: form.email,
          otp: code,
        })
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

      toast.success("Signup Successful 🎉");

      setTimeout(() => setScreen("login"), 1200);
    } catch {
      setOtpError(true);
      toast.error("Invalid OTP ❌");
    } finally {
      setLoading(false);
    }
  };

  /* ================= LOGIN ================= */
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

      const block = response?.data?.[0];
      const status = block?.LoginStatus?.[0]?.Status;

      if (status && status !== "Success") {
        toast.error(status);
        return;
      }

      const user = block?.DataValue?.[0];

      if (!user) {
        toast.error("Invalid login response");
        return;
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
    } catch {
      toast.error("Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  /* ================= TIMER ================= */
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

      await dispatch(
        sendOtpThunk({ deviceId: "web123", email: form.email })
      ).unwrap();

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
                onChange={handleLoginChange}
              />

              <div className="relative">
                <input
                  className={inputCls}
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
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

              {/* ONLY CHANGE: onPaste added here */}
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
                    inputMode="numeric"
                    maxLength={1}
                    className={`w-10 sm:w-12 h-12 sm:h-14 text-center text-lg sm:text-xl border-2 rounded-xl outline-none ${
                      otpError ? "border-red-500" : "border-purple-300"
                    }`}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (!/^[0-9]?$/.test(val)) return;

                      const newOtp = [...otp];
                      newOtp[index] = val;
                      setOtp(newOtp);

                      if (val && index < 5)
                        otpRefs[index + 1]?.current?.focus();
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Backspace" && !otp[index] && index > 0) {
                        otpRefs[index - 1]?.current?.focus();
                      }
                    }}
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