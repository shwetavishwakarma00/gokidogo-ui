"use client";

import { useState, useRef, useEffect } from "react";
import { useDispatch } from "react-redux";
import { sendOtpThunk, verifyOtpThunk, signupThunk, loginThunk, fetchProfileThunk } from "@/app/redux/features/authSlice";
import { motion } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { getDeviceId } from "../utils/deviceID";

export default function AuthPage() {
  const dispatch = useDispatch();
  const router = useRouter();

  const otpRefs = [useRef(null), useRef(null), useRef(null), useRef(null), useRef(null), useRef(null)];

  const [screen, setScreen] = useState("login");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [otp, setOtp] = useState(Array(6).fill(""));
  const [timer, setTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);

  const [form, setForm] = useState({
    title: "",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [loginForm, setLoginForm] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const handleLoginChange = (e) => setLoginForm({ ...loginForm, [e.target.name]: e.target.value });

  /* ---------------- SEND OTP ---------------- */
  const sendOtp = async () => {
    if (!form.email) return toast.error("Email required");
    if (form.password !== form.confirmPassword) return toast.error("Passwords don't match");

    try {
      setLoading(true);
      await dispatch(sendOtpThunk({ deviceId: "web123", email: form.email })).unwrap();
      toast.success("OTP sent 🚀");
      setScreen("otp");
      setTimer(30);
      setCanResend(false);
    } catch {
      toast.error("OTP failed");
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- OTP HANDLERS ---------------- */
  const handleOtpChange = (value, index) => {
    if (!/^[0-9]?$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < 5) otpRefs[index + 1].current.focus();
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) otpRefs[index - 1].current.focus();
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const paste = e.clipboardData.getData("text").trim();
    if (!/^[0-9]+$/.test(paste)) return;
    const arr = paste.slice(0, 6).split("");
    const newOtp = [...otp];
    arr.forEach((num, i) => (newOtp[i] = num));
    setOtp(newOtp);
    if (otpRefs[arr.length - 1]) otpRefs[arr.length - 1].current.focus();
  };

  /* ---------------- VERIFY OTP & SIGNUP ---------------- */
  const verifyOtp = async () => {
    const code = otp.join("");
    if (code.length < 6) return toast.error("Enter full OTP");

    try {
      setLoading(true);
      await dispatch(verifyOtpThunk({ deviceId: "web123", email: form.email, otp: code })).unwrap();
      await dispatch(
        signupThunk({
          firstname: form.firstName,
          lastname: form.lastName,
          email: form.email,
          mobile: form.phone,
          passwd: form.password,
          gender: "1",
        })
      ).unwrap();

      toast.success("Signup Successful 🎉");
      setScreen("login");
    } catch (err) {
      console.error(err);
      toast.error("Verification/Signup failed");
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- LOGIN ---------------- */
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

      console.log("LOGIN RESPONSE:", response);

      const user = response?.data?.[0]?.DataValue?.[0];

      if (!user) {
        toast.error("Login response invalid");
        return;
      }

      // ✅ Save to localStorage
      localStorage.setItem("user", JSON.stringify(user));

      // ✅ Fetch profile with correct PascalCase field names
      dispatch(fetchProfileThunk({
        customer_ID: user.CustomerId,
        email: user.EmailAddress,
        apikey: user.apikey,
        deviceId: "web123",
      }));

      toast.success("Login Successful 🎉");
      setScreen("success");

      setTimeout(() => {
        router.push("/profile");
      }, 1500);

    } catch (err) {
      console.error(err);
      toast.error("Login failed");
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- RESEND TIMER ---------------- */
  useEffect(() => {
    let interval;
    if (screen === "otp" && timer > 0) {
      interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
    }
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

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-300 px-4 py-6">
      <Toaster />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl p-6 sm:p-10 rounded-3xl shadow-2xl border border-gray-200 bg-white"
      >
        {/* SIGNUP */}
        {screen === "signup" && (
          <div className="flex flex-col gap-5">
            <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-800">Create Account</h2>
            <select
              name="title"
              value={form.title}
              onChange={handleChange}
              className="border p-3 rounded-lg cursor-pointer text-black focus:ring-2 focus:ring-green-400"
            >
              <option value="">Select Title</option>
              <option>Mr</option>
              <option>Ms</option>
              <option>Mrs</option>
            </select>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input name="firstName" placeholder="First Name" onChange={handleChange} className="border p-3 rounded focus:ring-2 focus:ring-green-400 text-black" />
              <input name="lastName" placeholder="Last Name" onChange={handleChange} className="border p-3 rounded focus:ring-2 focus:ring-green-400 text-black" />
            </div>

            <input type="email" name="email" placeholder="Email" onChange={handleChange} className="border p-3 rounded focus:ring-2 focus:ring-green-400 text-black" />
            <input type="tel" name="phone" placeholder="Phone" onChange={handleChange} className="border p-3 rounded focus:ring-2 focus:ring-green-400 text-black" />

            <div className="relative">
              <input type={showPassword ? "text" : "password"} name="password" placeholder="Password" onChange={handleChange} className="border p-3 rounded w-full focus:ring-2 focus:ring-green-600 text-black" />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-3 text-lg text-gray-700 hover:text-green-600 transition">
                {showPassword ? <FiEye /> : <FiEyeOff />}
              </button>
            </div>

            <div className="relative">
              <input type={showConfirm ? "text" : "password"} name="confirmPassword" placeholder="Confirm Password" onChange={handleChange} className="border p-3 rounded w-full focus:ring-2 focus:ring-green-600 text-black" />
              <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3 top-3 text-lg text-gray-700 hover:text-green-600 transition">
                {showConfirm ? <FiEye /> : <FiEyeOff />}
              </button>
            </div>

            <motion.button whileTap={{ scale: 0.95 }} onClick={sendOtp} disabled={loading} className="bg-green-600 hover:bg-orange-600 text-white p-4 rounded-lg font-semibold text-lg sm:text-xl transition shadow-md">
              {loading ? "Sending..." : "Signup"}
            </motion.button>

            <p className="text-center text-gray-600">
              Already have an account?{" "}
              <button onClick={() => setScreen("login")} className="text-blue-600 font-semibold hover:underline">
                Login
              </button>
            </p>
          </div>
        )}

        {/* OTP */}
        {screen === "otp" && (
          <div className="flex flex-col gap-6 items-center">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800 text-center">Enter OTP</h2>

            <div onPaste={handlePaste} className="flex justify-center gap-3 sm:gap-4">
              {otp.map((digit, i) => (
                <motion.input
                  key={i}
                  ref={otpRefs[i]}
                  value={digit}
                  maxLength={1}
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  onChange={(e) => handleOtpChange(e.target.value, i)}
                  onKeyDown={(e) => handleKeyDown(e, i)}
                  whileFocus={{ scale: 1.05 }}
                  className={`w-14 h-14 sm:w-16 sm:h-16 text-center text-black text-lg sm:text-xl border rounded-xl transition-all
                    ${digit ? "border-green-500 shadow-lg" : "border-gray-300"}
                    focus:ring-2 focus:ring-blue-400`}
                />
              ))}
            </div>

            <motion.button whileTap={{ scale: 0.95 }} onClick={verifyOtp} disabled={loading} className="bg-purple-600 hover:bg-purple-800 text-white p-4 rounded-lg font-semibold w-full text-lg sm:text-xl transition shadow-md">
              {loading ? "Verifying..." : "Verify OTP"}
            </motion.button>

            <div className="text-sm sm:text-base text-gray-600 text-center">
              {canResend ? (
                <button onClick={resendOtp} className="text-red-600 hover:underline">Resend OTP</button>
              ) : (
                <p>Resend OTP in {timer}s</p>
              )}
            </div>
          </div>
        )}

        {/* LOGIN */}
        {screen === "login" && (
          <div className="flex flex-col gap-5">
            <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-800">Login</h2>
            <input type="email" name="email" placeholder="Email" value={loginForm.email} onChange={handleLoginChange} className="border p-3 rounded w-full focus:ring-2 focus:ring-green-400 text-black" />
            <div className="relative">
              <input type={showPassword ? "text" : "password"} name="password" placeholder="Password" value={loginForm.password} onChange={handleLoginChange} className="border p-3 rounded w-full focus:ring-2 focus:ring-green-600 text-black" />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-3 text-lg text-gray-700 hover:text-green-600 transition">
                {showPassword ? <FiEye /> : <FiEyeOff />}
              </button>
            </div>
            <motion.button whileTap={{ scale: 0.95 }} onClick={login} disabled={loading} className="bg-blue-600 hover:bg-blue-800 text-white p-4 rounded-lg font-semibold w-full text-lg sm:text-xl transition shadow-md">
              {loading ? "Logging in..." : "Login"}
            </motion.button>

            <p className="text-center text-gray-600">
              Don't have an account?{" "}
              <button onClick={() => setScreen("signup")} className="text-green-600 font-semibold hover:underline">
                Signup
              </button>
            </p>
          </div>
        )}

        {/* SUCCESS */}
        {screen === "success" && (
          <div className="flex flex-col items-center justify-center gap-4 py-8">
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 260, damping: 20 }} className="text-6xl sm:text-7xl text-green-500">🎉</motion.div>
            <h2 className="text-2xl sm:text-3xl font-bold text-green-600 text-center">Login Successful</h2>
            <p className="text-gray-700 text-center max-w-xs sm:max-w-sm">Welcome! Redirecting to profile...</p>
          </div>
        )}
      </motion.div>
    </div>
  );
}