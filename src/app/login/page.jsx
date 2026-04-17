"use client";

import { useState, useRef, useEffect } from "react";
import { useDispatch } from "react-redux";
import {
  sendOTP,
  verifyOTP,
  registerUser,
  loginUser,
  getUserProfile
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
    useRef(null)
  ];

  const [screen, setScreen] = useState("login");
  const [loading, setLoading] = useState(false);

  const [showPassword, setShowPassword] = useState(false);

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
    dob: "",
    gender: "",
    address: "",
    state: "",
    city: "",
    country: ""
  });

  const [loginForm, setLoginForm] = useState({
    email: "",
    password: ""
  });

  /* ================= VALIDATIONS ================= */

  const validateEmail = (email) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const validatePhone = (phone) =>
    /^[0-9]{8,15}$/.test(phone);

  const validatePassword = (password) =>
    password.length >= 6;

  /* ================= FORM HANDLERS ================= */

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleLoginChange = (e) =>
    setLoginForm({ ...loginForm, [e.target.name]: e.target.value });

  /* ================= AUTO LOGIN CHECK ================= */

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) router.push("/profile");
  }, []);

  /* ================= SEND OTP ================= */

  const sendOtp = async () => {

    if (!form.firstName || !form.lastName)
      return toast.error("Name required");

    if (!validateEmail(form.email))
      return toast.error("Invalid email");

    if (!validatePhone(form.phone))
      return toast.error("Invalid phone number");

    if (!validatePassword(form.password))
      return toast.error("Password must be at least 6 characters");

    if (form.password !== form.confirmPassword)
      return toast.error("Passwords don't match");

    try {

      setLoading(true);

      const res = await dispatch(
        sendOTP({ email: form.email })
      ).unwrap();

      /* If already registered */
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

    } catch (err) {
      toast.error("Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  /* ================= VERIFY OTP + REGISTER ================= */

  const verifyOtp = async () => {

    const code = otp.join("");

    if (code.length !== 6)
      return toast.error("Enter valid OTP");

    try {

      setLoading(true);

      await dispatch(
        verifyOTP({
          email: form.email,
          otp: code
        })
      ).unwrap();

      await dispatch(
        registerUser({
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
          country: form.country
        })
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

    if (!validateEmail(loginForm.email))
      return toast.error("Enter valid email");

    if (!loginForm.password)
      return toast.error("Password required");

    try {

      setLoading(true);

      const response = await dispatch(
        loginUser({
          usrid: loginForm.email,
          passwd: loginForm.password
        })
      ).unwrap();

      const block = response?.data?.[0];
      const status = block?.LoginStatus?.[0]?.Status;

      if (status !== "Success")
        return toast.error(status || "Login failed");

      const user = block?.DataValue?.[0];

      if (!user)
        return toast.error("Invalid login response");

      localStorage.setItem("user", JSON.stringify(user));

      dispatch(
        getUserProfile({
          customer_ID: user.CustomerId,
          email: user.EmailAddress,
          apikey: user.apikey,
          deviceId: "web123"
        })
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
      interval = setInterval(() => {
        setTimer((p) => p - 1);
      }, 1000);
    }

    if (timer === 0) setCanResend(true);

    return () => clearInterval(interval);

  }, [screen, timer]);

  /* ================= RESEND OTP ================= */

  const resendOtp = async () => {

    if (!canResend) return;

    try {

      setLoading(true);

      await dispatch(
        sendOTP({ email: form.email })
      ).unwrap();

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
        className="w-full max-w-md bg-white p-6 rounded-2xl shadow-2xl border border-purple-200"
      >

        {/* LOGIN */}
        {screen === "login" && (
          <div className="space-y-4">

            <h2 className="text-2xl font-bold text-center text-purple-900">
              Login
            </h2>

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
                className="absolute right-3 top-3"
              >
                {showPassword ? <FiEye /> : <FiEyeOff />}
              </button>
            </div>

            <button
              onClick={login}
              disabled={loading}
              className="w-full bg-purple-500 hover:bg-purple-600 text-white py-2 rounded-lg"
            >
              {loading ? "Logging in..." : "Login"}
            </button>

            <p className="text-center text-sm">
              Not registered?{" "}
              <span
                onClick={() => setScreen("signup")}
                className="text-blue-600 cursor-pointer underline"
              >
                SignUp
              </span>
            </p>

          </div>
        )}

        {/* SIGNUP */}
        {screen === "signup" && (
          <div className="space-y-4">

            <h2 className="text-2xl font-bold text-center text-purple-900">
              Create Account
            </h2>

            <input
              className={inputCls}
              name="firstName"
              placeholder="First Name"
              onChange={handleChange}
            />

            <input
              className={inputCls}
              name="lastName"
              placeholder="Last Name"
              onChange={handleChange}
            />

            <input
              className={inputCls}
              name="email"
              placeholder="Email"
              onChange={handleChange}
            />

            <input
              className={inputCls}
              name="phone"
              placeholder="Phone"
              onChange={handleChange}
            />

            <div className="relative">
              <input
                className={inputCls}
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                onChange={handleChange}
              />
            </div>

            <input
              className={inputCls}
              name="confirmPassword"
              type="password"
              placeholder="Confirm Password"
              onChange={handleChange}
            />

            <button
              onClick={sendOtp}
              disabled={loading}
              className="w-full bg-purple-500 hover:bg-purple-600 text-white py-2 rounded-lg"
            >
              {loading ? "Sending OTP..." : "SignUp"}
            </button>

            <p className="text-center text-sm">
              Already have account?{" "}
              <span
                onClick={() => setScreen("login")}
                className="text-blue-600 underline cursor-pointer"
              >
                Login
              </span>
            </p>

          </div>
        )}

        {/* OTP */}
        {screen === "otp" && (
          <div className="space-y-4 text-center">

            <h2 className="text-2xl font-bold text-purple-900">
              Verify OTP
            </h2>

            <div className="flex justify-center gap-2">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={otpRefs[index]}
                  value={digit}
                  maxLength={1}
                  className="w-10 h-10 border text-center text-lg rounded"
                  onChange={(e) => {
                    const val = e.target.value;

                    if (!/^[0-9]?$/.test(val)) return;

                    const newOtp = [...otp];
                    newOtp[index] = val;
                    setOtp(newOtp);

                    if (val && index < 5)
                      otpRefs[index + 1]?.current?.focus();
                  }}
                />
              ))}
            </div>

            <button
              onClick={verifyOtp}
              disabled={loading}
              className="w-full bg-purple-500 hover:bg-purple-600 text-white py-2 rounded-lg"
            >
              {loading ? "Verifying..." : "Verify OTP"}
            </button>

          </div>
        )}

      </motion.div>

    </AnimatePresence>

  </div>
);
  
}