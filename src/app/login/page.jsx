"use client";

import { useState, useEffect, useRef } from "react";

export default function AuthPage() {
  const [screen, setScreen] = useState("signup"); // "signup" | "otp" | "success"
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [timer, setTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const otpRefs = [useRef(), useRef(), useRef(), useRef()];
  const timerRef = useRef(null);

  const startTimer = () => {
    setTimer(30);
    setCanResend(false);
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setTimer((t) => {
        if (t <= 1) {
          clearInterval(timerRef.current);
          setCanResend(true);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
  };

  useEffect(() => {
    return () => clearInterval(timerRef.current);
  }, []);

  const goToOtp = () => {
    setScreen("otp");
    setOtp(["", "", "", ""]);
    startTimer();
    setTimeout(() => otpRefs[0].current?.focus(), 100);
  };

  const handleOtpChange = (index, value) => {
    if (!/^\d?$/.test(value)) return;
    const next = [...otp];
    next[index] = value;
    setOtp(next);
    if (value && index < 3) otpRefs[index + 1].current?.focus();

    // Auto verify when all 4 digits filled
    if (next.every((d) => d !== "") && value) {
      setTimeout(() => setScreen("success"), 300);
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpRefs[index - 1].current?.focus();
    }
  };

  const resendOtp = () => {
    setOtp(["", "", "", ""]);
    otpRefs[0].current?.focus();
    startTimer();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f4f4f8] p-6 font-sans">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl shadow-purple-100 border border-purple-50 p-8 sm:p-10">

        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-[#6b47b8] rounded-2xl flex items-center justify-center mx-auto mb-3">
            <span className="text-2xl">🍽</span>
          </div>
          <h1 className="text-xl font-extrabold text-[#6b47b8]">RestaurantApp</h1>
        </div>

        {/* ── SIGNUP SCREEN ── */}
        {screen === "signup" && (
          <div>
            <div className="mb-7">
              <h2 className="text-2xl font-extrabold text-gray-800 tracking-tight">
                Create account 🎉
              </h2>
              <p className="text-gray-400 text-sm mt-1">
                Join us and get your first order delivered fast.
              </p>
            </div>

            <div className="flex flex-col gap-4">
              {/* Name row */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">
                    First Name
                  </label>
                  <input
                    type="text"
                    placeholder="John"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm text-gray-800 placeholder-gray-300 focus:outline-none focus:border-[#6b47b8] focus:ring-2 focus:ring-purple-100 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">
                    Last Name
                  </label>
                  <input
                    type="text"
                    placeholder="Doe"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm text-gray-800 placeholder-gray-300 focus:outline-none focus:border-[#6b47b8] focus:ring-2 focus:ring-purple-100 transition-all"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">
                  Email Address
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 text-base">✉️</span>
                  <input
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 text-sm text-gray-800 placeholder-gray-300 focus:outline-none focus:border-[#6b47b8] focus:ring-2 focus:ring-purple-100 transition-all"
                  />
                </div>
              </div>

              {/* Phone */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">
                  Phone Number
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 text-base">📱</span>
                  <input
                    type="tel"
                    placeholder="+91 00000 00000"
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 text-sm text-gray-800 placeholder-gray-300 focus:outline-none focus:border-[#6b47b8] focus:ring-2 focus:ring-purple-100 transition-all"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">
                  Password
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 text-base">🔒</span>
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-12 py-3 rounded-xl border border-gray-200 text-sm text-gray-800 placeholder-gray-300 focus:outline-none focus:border-[#6b47b8] focus:ring-2 focus:ring-purple-100 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 hover:text-[#6b47b8] transition-colors text-sm"
                  >
                    {showPassword ? "🙈" : "👁"}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">
                  Confirm Password
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 text-base">🔒</span>
                  <input
                    type={showConfirm ? "text" : "password"}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-12 py-3 rounded-xl border border-gray-200 text-sm text-gray-800 placeholder-gray-300 focus:outline-none focus:border-[#6b47b8] focus:ring-2 focus:ring-purple-100 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 hover:text-[#6b47b8] transition-colors text-sm"
                  >
                    {showConfirm ? "🙈" : "👁"}
                  </button>
                </div>
              </div>

              {/* Terms */}
              <label className="flex items-start gap-3 cursor-pointer mt-1">
                <input
                  type="checkbox"
                  className="mt-0.5 w-4 h-4 accent-[#6b47b8] rounded"
                />
                <span className="text-xs text-gray-400 leading-relaxed">
                  I agree to the{" "}
                  <button className="text-[#6b47b8] font-semibold hover:underline">Terms of Service</button>
                  {" "}and{" "}
                  <button className="text-[#6b47b8] font-semibold hover:underline">Privacy Policy</button>
                </span>
              </label>

              {/* Submit */}
              <button
                onClick={goToOtp}
                className="w-full mt-2 bg-[#3db56e] hover:bg-[#33a060] active:bg-[#2d8f55] text-white font-bold py-3.5 rounded-xl transition-all duration-200 shadow-lg shadow-green-200 hover:shadow-green-300 text-sm tracking-wide"
              >
                Create My Account →
              </button>

              {/* Divider */}
              <div className="flex items-center gap-3 my-1">
                <div className="flex-1 h-px bg-gray-100" />
                <span className="text-xs text-gray-300 font-medium">or continue with</span>
                <div className="flex-1 h-px bg-gray-100" />
              </div>

              {/* Social */}
              <div className="grid grid-cols-2 gap-3">
                <button className="flex items-center justify-center gap-2 border border-gray-200 rounded-xl py-3 text-sm font-semibold text-gray-600 hover:bg-gray-50 hover:border-gray-300 transition-all">
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Google
                </button>
                <button className="flex items-center justify-center gap-2 border border-gray-200 rounded-xl py-3 text-sm font-semibold text-gray-600 hover:bg-gray-50 hover:border-gray-300 transition-all">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="#1877F2">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                  Facebook
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── OTP SCREEN ── */}
        {screen === "otp" && (
          <div>
            <div className="text-center mb-6">
              <h2 className="text-2xl font-extrabold text-gray-800 tracking-tight">
                Verify your email ✉️
              </h2>
              <p className="text-gray-400 text-sm mt-1">
                We've sent a 4-digit OTP to your email.
              </p>
            </div>

            {/* Info box */}
            <div className="bg-purple-50 border border-purple-100 rounded-xl px-4 py-3 mb-6 text-sm text-gray-600 leading-relaxed">
              OTP sent to <span className="font-semibold text-[#6b47b8]">{email || "your email"}</span>. Check your inbox or spam folder.
            </div>

            {/* OTP boxes */}
            <div className="flex gap-3 justify-center mb-6">
              {otp.map((digit, i) => (
                <input
                  key={i}
                  ref={otpRefs[i]}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(i, e.target.value)}
                  onKeyDown={(e) => handleOtpKeyDown(i, e)}
                  className={`w-14 h-14 text-center text-2xl font-bold rounded-xl border-2 transition-all focus:outline-none focus:ring-2 focus:ring-purple-100 ${
                    digit
                      ? "border-[#6b47b8] text-[#6b47b8]"
                      : "border-gray-200 text-gray-800"
                  }`}
                />
              ))}
            </div>

            {/* Resend */}
            <div className="text-center text-sm text-gray-400 mb-6">
              {canResend ? (
                <button
                  onClick={resendOtp}
                  className="text-[#6b47b8] font-semibold hover:text-[#4a2d8f] transition-colors"
                >
                  Resend OTP
                </button>
              ) : (
                <span>
                  Resend OTP in <span className="font-semibold text-gray-600">{timer}s</span>
                </span>
              )}
            </div>

            {/* Verify button */}
            <button
              onClick={() => setScreen("success")}
              className="w-full bg-[#3db56e] hover:bg-[#33a060] active:bg-[#2d8f55] text-white font-bold py-3.5 rounded-xl transition-all duration-200 shadow-lg shadow-green-200 text-sm tracking-wide mb-4"
            >
              Verify & Continue →
            </button>

            <p className="text-center text-xs text-gray-400">
              <button
                onClick={() => setScreen("signup")}
                className="text-[#6b47b8] font-semibold hover:text-[#4a2d8f] transition-colors"
              >
                ← Back to signup
              </button>
            </p>
          </div>
        )}

        {/* ── SUCCESS SCREEN ── */}
        {screen === "success" && (
          <div className="text-center py-4">
            <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-5">
              <svg className="w-10 h-10" viewBox="0 0 40 40" fill="none">
                <circle cx="20" cy="20" r="20" fill="#3db56e" />
                <path
                  d="M11 20.5l6.5 6.5 11.5-13"
                  stroke="white"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-extrabold text-gray-800 mb-2">Account Created!</h2>
            <p className="text-gray-400 text-sm mb-8 leading-relaxed">
              Your email has been verified. Welcome to RestaurantApp!
            </p>
            <button
              onClick={() => { setScreen("signup"); setEmail(""); setOtp(["","","",""]); }}
              className="w-full bg-[#3db56e] hover:bg-[#33a060] text-white font-bold py-3.5 rounded-xl transition-all duration-200 shadow-lg shadow-green-200 text-sm tracking-wide"
            >
              Start Ordering →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}