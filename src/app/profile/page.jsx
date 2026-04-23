"use client";

import { useEffect, useState, useRef } from "react";
import { LogOut, Lock, User, Eye, EyeOff, ArrowLeft, Mail } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { sendOTP, verifyOTP } from "@/app/redux/features/authSlice";

const genderMap = { "1": "Male", "2": "Female", "3": "Other" };

export default function ProfilePage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const fileInputRef = useRef(null);
  const emailOtpRefs = [useRef(null), useRef(null), useRef(null), useRef(null), useRef(null), useRef(null)];

  const [activeTab, setActiveTab] = useState("profile");
  const [profileImage, setProfileImage] = useState(null);
  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);

  // Email change flow
  const [emailChangeStep, setEmailChangeStep] = useState("form"); // form | otp
  const [newEmail, setNewEmail] = useState("");
  const [emailOtp, setEmailOtp] = useState(Array(6).fill(""));
  const [emailOtpTimer, setEmailOtpTimer] = useState(30);
  const [emailOtpCanResend, setEmailOtpCanResend] = useState(false);
  const [emailOtpLoading, setEmailOtpLoading] = useState(false);

  const [form, setForm] = useState({
    firstName: "", lastName: "", email: "", mobile: "",
    dateOfBirth: "", gender: "", address: "",
    state: "", city: "", country: "", zip: "",
  });

  const [passwords, setPasswords] = useState({
    newPassword: "",
    confirmPassword: "",
  });

  const initials =
    `${form.firstName?.[0] || ""}${form.lastName?.[0] || ""}`.toUpperCase() || "?";

  /* ─── LOAD DATA ─── */
  useEffect(() => {
    const storedImage = localStorage.getItem("profileImage");
    if (storedImage) setProfileImage(storedImage);

    const loginUser = JSON.parse(localStorage.getItem("user") || "null");
    const signupData = JSON.parse(localStorage.getItem("signupData") || "null");
    const savedProfile = JSON.parse(localStorage.getItem("profileData") || "null");

    // If user has manually saved profile data, use that as priority
    if (savedProfile) {
      setForm(savedProfile);
      return;
    }

    let base = {
      firstName: "", lastName: "", email: "", mobile: "",
      dateOfBirth: "", gender: "", address: "",
      state: "", city: "", country: "", zip: "",
    };

    // Fill from signupData first (has all signup form fields)
    if (signupData) {
      base = {
        ...base,
        firstName: signupData.firstName || "",
        lastName: signupData.lastName || "",
        email: signupData.email || "",
        mobile: signupData.mobile || "",
        gender: signupData.gender || "",
        address: signupData.address || "",
        state: signupData.state || "",
        city: signupData.city || "",
        country: signupData.country || "",
        zip: signupData.zip || "",
      };
    }

    // Overlay with API login data (overrides where available)
    if (loginUser) {
      const nameParts = (loginUser.CustomerName || "").split(" ");
      base = {
        ...base,
        firstName: nameParts[0] || base.firstName,
        lastName: nameParts.slice(1).join(" ") || base.lastName,
        email: loginUser.EmailAddress || base.email,
        mobile: loginUser.MobileNo || base.mobile,
        dateOfBirth: loginUser.DOB || base.dateOfBirth,
        gender: genderMap[loginUser.Gender] || base.gender,
        address: loginUser.Address || base.address,
        state: loginUser.State || base.state,
        city: loginUser.City || base.city,
        country: loginUser.Country || base.country,
      };
    }

    setForm(base);
  }, []);

  /* ─── EMAIL OTP TIMER ─── */
  useEffect(() => {
    if (activeTab !== "changeEmail" || emailChangeStep !== "otp") return;
    if (emailOtpTimer <= 0) { setEmailOtpCanResend(true); return; }
    const interval = setInterval(() => setEmailOtpTimer((p) => p - 1), 1000);
    return () => clearInterval(interval);
  }, [activeTab, emailChangeStep, emailOtpTimer]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handlePasswordChange = (e) =>
    setPasswords({ ...passwords, [e.target.name]: e.target.value });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setProfileImage(reader.result);
      localStorage.setItem("profileImage", reader.result);
      toast.success("Profile photo updated 📸");
    };
    reader.readAsDataURL(file);
  };

  /* ─── SAVE PROFILE ─── */
  const saveProfile = () => {
    localStorage.setItem("profileData", JSON.stringify(form));
    localStorage.setItem("signupData", JSON.stringify(form));
    toast.success("Profile saved ✅");
  };

  /* ─── CHANGE PASSWORD ─── */
  const changePassword = () => {
    if (!passwords.newPassword) return toast.error("Enter new password");
    if (passwords.newPassword.length < 6)
      return toast.error("Password must be at least 6 characters");
    if (passwords.newPassword !== passwords.confirmPassword)
      return toast.error("Passwords do not match");
    localStorage.setItem("userPassword", passwords.newPassword);
    toast.success("Password updated 🔐 — use this password next time you login");
    setPasswords({ newPassword: "", confirmPassword: "" });
  };

  /* ─── SEND EMAIL CHANGE OTP ─── */
  const sendEmailChangeOtp = async () => {
    if (!newEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newEmail))
      return toast.error("Enter a valid new email");
    if (newEmail === form.email)
      return toast.error("New email is same as current email");
    try {
      setEmailOtpLoading(true);
      await dispatch(sendOTP({ email: newEmail })).unwrap();
      toast.success("OTP sent to new email 🚀");
      setEmailChangeStep("otp");
      setEmailOtpTimer(30);
      setEmailOtpCanResend(false);
      setEmailOtp(Array(6).fill(""));
    } catch {
      toast.error("Failed to send OTP");
    } finally {
      setEmailOtpLoading(false);
    }
  };

  /* ─── VERIFY EMAIL CHANGE OTP ─── */
  const verifyEmailChangeOtp = async () => {
    const code = emailOtp.join("");
    if (code.length !== 6) return toast.error("Enter valid 6-digit OTP");
    try {
      setEmailOtpLoading(true);
      await dispatch(verifyOTP({ email: newEmail, otp: code })).unwrap();

      const updatedForm = { ...form, email: newEmail };
      setForm(updatedForm);
      localStorage.setItem("profileData", JSON.stringify(updatedForm));
      localStorage.setItem("signupData", JSON.stringify(updatedForm));

      const storedUser = JSON.parse(localStorage.getItem("user") || "null");
      if (storedUser) {
        storedUser.EmailAddress = newEmail;
        localStorage.setItem("user", JSON.stringify(storedUser));
      }

      toast.success("Email updated successfully ✅");
      setEmailChangeStep("form");
      setNewEmail("");
      setActiveTab("profile");
    } catch {
      toast.error("Invalid OTP");
    } finally {
      setEmailOtpLoading(false);
    }
  };

  /* ─── RESEND EMAIL OTP ─── */
  const resendEmailOtp = async () => {
    if (!emailOtpCanResend) return;
    try {
      setEmailOtpLoading(true);
      await dispatch(sendOTP({ email: newEmail })).unwrap();
      toast.success("OTP Resent");
      setEmailOtpTimer(30);
      setEmailOtpCanResend(false);
      setEmailOtp(Array(6).fill(""));
    } catch {
      toast.error("Failed to resend OTP");
    } finally {
      setEmailOtpLoading(false);
    }
  };

  /* ─── EMAIL OTP PASTE ─── */
  const handleEmailOtpPaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (!pasted) return;
    const newOtp = Array(6).fill("");
    pasted.split("").forEach((char, i) => (newOtp[i] = char));
    setEmailOtp(newOtp);
    const focusIdx = Math.min(pasted.length, 5);
    setTimeout(() => emailOtpRefs[focusIdx]?.current?.focus(), 0);
  };

  const handleLogout = () => {
    localStorage.clear();
    toast.success("Logged out 👋");
    router.push("/login");
  };

  const inputCls =
    "mt-1 w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-black focus:ring-2 focus:ring-purple-500 outline-none transition";

  return (
    <div className="min-h-screen bg-gray-50 p-3 sm:p-6 text-black">
      <Toaster position="top-center" />

      <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-lg overflow-hidden">
        {/* Top accent */}
        <div className="h-1 bg-gradient-to-r from-purple-500 via-fuchsia-500 to-purple-700" />

        {/* ── MOBILE TOP BAR ── */}
        <div className="flex flex-col items-center pt-6 pb-4 px-4 border-b sm:hidden">
          <div
            onClick={() => fileInputRef.current.click()}
            className="w-20 h-20 rounded-full bg-purple-100 flex items-center justify-center cursor-pointer overflow-hidden shadow-md mb-2 ring-2 ring-purple-300"
          >
            {profileImage ? (
              <img src={profileImage} className="w-full h-full object-cover" alt="Profile" />
            ) : (
              <span className="text-xl font-bold text-purple-700">{initials}</span>
            )}
          </div>
          <p className="font-semibold text-black text-sm">{form.firstName} {form.lastName}</p>
          <p className="text-xs text-gray-500 mb-4">{form.email}</p>

          <div className="flex w-full gap-2">
            <MobileTabBtn icon={<User size={15} />} label="Profile" active={activeTab === "profile"} onClick={() => setActiveTab("profile")} />
            <MobileTabBtn icon={<Lock size={15} />} label="Password" active={activeTab === "password"} onClick={() => setActiveTab("password")} />
            <MobileTabBtn icon={<Mail size={15} />} label="Email" active={activeTab === "changeEmail"} onClick={() => setActiveTab("changeEmail")} />
            <MobileTabBtn icon={<LogOut size={15} />} label="Logout" danger onClick={handleLogout} />
          </div>
        </div>

        {/* ── DESKTOP LAYOUT ── */}
        <div className="flex">

          {/* SIDEBAR */}
          <div className="hidden sm:flex w-64 border-r p-6 flex-col shrink-0 bg-gray-50/60">
            <div className="text-center mb-8">
              <div
                onClick={() => fileInputRef.current.click()}
                className="w-24 h-24 mx-auto rounded-full bg-purple-100 flex items-center justify-center cursor-pointer overflow-hidden shadow-md ring-2 ring-purple-300 hover:ring-purple-500 transition"
              >
                {profileImage ? (
                  <img src={profileImage} className="w-full h-full object-cover" alt="Profile" />
                ) : (
                  <span className="text-2xl font-bold text-purple-700">{initials}</span>
                )}
              </div>
              <p className="mt-3 font-semibold text-black">{form.firstName} {form.lastName}</p>
              <p className="text-xs text-gray-500 mt-0.5">{form.email}</p>
              <p className="text-xs text-purple-500 mt-1 cursor-pointer hover:underline" onClick={() => fileInputRef.current.click()}>
                Change photo
              </p>
            </div>

            <MenuBtn icon={<User size={16} />} label="My Profile" active={activeTab === "profile"} onClick={() => setActiveTab("profile")} />
            <MenuBtn icon={<Lock size={16} />} label="Change Password" active={activeTab === "password"} onClick={() => setActiveTab("password")} />
            <MenuBtn icon={<Mail size={16} />} label="Change Email" active={activeTab === "changeEmail"} onClick={() => setActiveTab("changeEmail")} />
            <div className="flex-1" />
            <MenuBtn icon={<LogOut size={18} />} label="Logout" danger onClick={handleLogout} />
          </div>

          {/* CONTENT */}
          <div className="flex-1 p-4 sm:p-8 min-h-[500px] sm:min-h-[650px]">

            {/* ══════════ PROFILE TAB ══════════ */}
            {activeTab === "profile" && (
              <>
                <h2 className="text-xl sm:text-2xl font-bold text-purple-900 mb-6">
                  Personal Information
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                  <Field label="First Name" name="firstName" value={form.firstName} onChange={handleChange} />
                  <Field label="Last Name" name="lastName" value={form.lastName} onChange={handleChange} />

                  {/* Email — read-only, change via tab */}
                  <div>
                    <label className="text-sm font-medium text-gray-700">Email Address</label>
                    <div className="flex gap-2 mt-1">
                      <input
                        value={form.email}
                        readOnly
                        className={`${inputCls} mt-0 flex-1 bg-gray-50 cursor-not-allowed text-gray-600`}
                      />
                      <button
                        onClick={() => setActiveTab("changeEmail")}
                        className="px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white text-xs rounded-xl transition whitespace-nowrap font-medium"
                      >
                        Change
                      </button>
                    </div>
                  </div>

                  <Field label="Mobile Number" name="mobile" value={form.mobile} onChange={handleChange} />
                  <Field type="date" label="Date of Birth" name="dateOfBirth" value={form.dateOfBirth} onChange={handleChange} />

                  {/* Gender */}
                  <div>
                    <label className="text-sm font-medium text-gray-700">Gender</label>
                    <div className="flex flex-wrap gap-3 mt-2">
                      {["Male", "Female", "Other"].map((g) => (
                        <label
                          key={g}
                          className={`flex items-center gap-2 px-4 py-2 rounded-xl border-2 cursor-pointer transition text-sm font-medium select-none
                            ${form.gender === g
                              ? "border-purple-500 bg-purple-50 text-purple-700"
                              : "border-gray-200 text-gray-600 hover:border-purple-300"}`}
                        >
                          <input type="radio" name="gender" value={g} checked={form.gender === g} onChange={handleChange} className="hidden" />
                          {g === "Male" ? "👨" : g === "Female" ? "👩" : "🧑"} {g}
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="sm:col-span-2">
                    <Field label="Address" name="address" value={form.address} onChange={handleChange} />
                  </div>

                  <Field label="City" name="city" value={form.city} onChange={handleChange} />
                  <Field label="State" name="state" value={form.state} onChange={handleChange} />
                  <Field label="Country" name="country" value={form.country} onChange={handleChange} />
                  <Field label="ZIP Code" name="zip" value={form.zip} onChange={handleChange} />

                  <div className="sm:col-span-2 pt-2">
                    <button
                      onClick={saveProfile}
                      className="bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-700 hover:to-fuchsia-700 text-white px-8 py-2.5 rounded-xl font-semibold shadow-md shadow-purple-200 transition"
                    >
                      Save Changes
                    </button>
                  </div>
                </div>
              </>
            )}

            {/* ══════════ PASSWORD TAB ══════════ */}
            {activeTab === "password" && (
              <>
                <h2 className="text-xl sm:text-2xl font-bold text-purple-900 mb-6">
                  Change Password
                </h2>

                <div className="w-full max-w-md space-y-5">
                  <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-sm text-amber-700">
                    💡 After updating, use your new password when you sign in next time.
                  </div>

                  <div className="relative">
                    <label className="text-sm font-medium text-gray-700">New Password</label>
                    <input
                      type={showNewPass ? "text" : "password"}
                      name="newPassword"
                      value={passwords.newPassword}
                      onChange={handlePasswordChange}
                      placeholder="Min 6 characters"
                      className={inputCls}
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPass((p) => !p)}
                      className="absolute right-3 top-9 text-gray-400 hover:text-purple-600 transition"
                    >
                      {showNewPass ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>

                  <div className="relative">
                    <label className="text-sm font-medium text-gray-700">Confirm Password</label>
                    <input
                      type={showConfirmPass ? "text" : "password"}
                      name="confirmPassword"
                      value={passwords.confirmPassword}
                      onChange={handlePasswordChange}
                      placeholder="Re-enter new password"
                      className={inputCls}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPass((p) => !p)}
                      className="absolute right-3 top-9 text-gray-400 hover:text-purple-600 transition"
                    >
                      {showConfirmPass ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>

                  <button
                    onClick={changePassword}
                    className="w-full bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-700 hover:to-fuchsia-700 text-white py-2.5 rounded-xl font-semibold shadow-md shadow-purple-200 transition"
                  >
                    Update Password
                  </button>
                </div>
              </>
            )}

            {/* ══════════ CHANGE EMAIL TAB ══════════ */}
            {activeTab === "changeEmail" && (
              <>
                {emailChangeStep === "otp" && (
                  <button
                    onClick={() => { setEmailChangeStep("form"); setEmailOtp(Array(6).fill("")); }}
                    className="flex items-center gap-1.5 text-purple-700 hover:text-purple-900 text-sm font-medium mb-5 transition group"
                  >
                    <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-1" />
                    Back
                  </button>
                )}

                <h2 className="text-xl sm:text-2xl font-bold text-purple-900 mb-6">
                  Change Email Address
                </h2>

                {/* Step 1 — Enter new email */}
                {emailChangeStep === "form" && (
                  <div className="w-full max-w-md space-y-5">
                    <div className="p-4 bg-purple-50 border border-purple-200 rounded-xl">
                      <p className="text-sm text-gray-600">Current email:</p>
                      <p className="font-semibold text-purple-800">{form.email}</p>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-700">New Email Address</label>
                      <input
                        type="email"
                        value={newEmail}
                        onChange={(e) => setNewEmail(e.target.value)}
                        placeholder="Enter new email address"
                        className={inputCls}
                        onKeyDown={(e) => e.key === "Enter" && sendEmailChangeOtp()}
                      />
                    </div>

                    <button
                      onClick={sendEmailChangeOtp}
                      disabled={emailOtpLoading}
                      className="w-full bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-700 hover:to-fuchsia-700 text-white py-2.5 rounded-xl font-semibold shadow-md shadow-purple-200 transition disabled:opacity-60"
                    >
                      {emailOtpLoading ? (
                        <span className="flex items-center justify-center gap-2">
                          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                          </svg>
                          Sending OTP...
                        </span>
                      ) : "Send Verification OTP"}
                    </button>
                  </div>
                )}

                {/* Step 2 — OTP verification */}
                {emailChangeStep === "otp" && (
                  <div className="w-full max-w-md space-y-6">
                    <div className="text-center">
                      <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-purple-100 mb-3">
                        <Mail className="w-7 h-7 text-purple-600" />
                      </div>
                      <p className="text-sm text-gray-500">Verification code sent to</p>
                      <p className="font-bold text-purple-700">{newEmail}</p>
                    </div>

                    {/* OTP Inputs */}
                    <div className="flex justify-center gap-2 sm:gap-3">
                      {emailOtp.map((d, i) => (
                        <input
                          key={i}
                          ref={emailOtpRefs[i]}
                          maxLength={1}
                          inputMode="numeric"
                          className={`w-11 h-14 sm:w-12 sm:h-14 border-2 text-center text-xl font-bold rounded-xl text-black outline-none transition
                            ${d ? "border-purple-500 bg-purple-50" : "border-gray-200 bg-gray-50 focus:border-purple-400 focus:bg-white"}`}
                          value={d}
                          onChange={(e) => {
                            const val = e.target.value;
                            if (!/^[0-9]?$/.test(val)) return;
                            const n = [...emailOtp];
                            n[i] = val;
                            setEmailOtp(n);
                            if (val && i < 5) emailOtpRefs[i + 1].current.focus();
                          }}
                          onKeyDown={(e) => {
                            if (e.key === "Backspace" && !emailOtp[i] && i > 0)
                              emailOtpRefs[i - 1].current.focus();
                          }}
                          onPaste={handleEmailOtpPaste}
                        />
                      ))}
                    </div>

                    <button
                      onClick={verifyEmailChangeOtp}
                      disabled={emailOtpLoading || emailOtp.join("").length !== 6}
                      className="w-full bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-700 hover:to-fuchsia-700 text-white py-3 rounded-xl font-semibold shadow-md shadow-purple-200 transition disabled:opacity-60"
                    >
                      {emailOtpLoading ? "Verifying..." : "Verify & Update Email"}
                    </button>

                    {/* Resend with red countdown */}
                    <div className="text-center">
                      {emailOtpCanResend ? (
                        <button
                          onClick={resendEmailOtp}
                          disabled={emailOtpLoading}
                          className="text-sm font-semibold text-purple-600 hover:text-fuchsia-600 transition underline underline-offset-2"
                        >
                          Resend OTP
                        </button>
                      ) : (
                        <p className="text-sm text-gray-500">
                          Resend available in{" "}
                          <span className="font-bold text-red-500 tabular-nums">{emailOtpTimer}s</span>
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </>
            )}

          </div>
        </div>
      </div>

      <input type="file" accept="image/*" ref={fileInputRef} onChange={handleImageChange} hidden />
    </div>
  );
}

/* ── Sub-components ── */

function MenuBtn({ icon, label, active, danger, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm mb-1.5 w-full transition font-medium
      ${danger
        ? "text-red-600 hover:bg-red-50"
        : active
          ? "bg-purple-100 text-purple-700"
          : "text-gray-600 hover:bg-gray-100"
      }`}
    >
      {icon} {label}
    </button>
  );
}

function MobileTabBtn({ icon, label, active, danger, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`flex-1 flex items-center justify-center gap-1 py-2 rounded-xl text-xs font-medium transition
      ${danger
        ? "text-red-600 bg-red-50 hover:bg-red-100"
        : active
          ? "bg-purple-100 text-purple-700"
          : "text-gray-600 bg-gray-100 hover:bg-gray-200"
      }`}
    >
      {icon} {label}
    </button>
  );
}

function Field({ label, ...props }) {
  return (
    <div>
      <label className="text-sm font-medium text-gray-700">{label}</label>
      <input
        {...props}
        className="mt-1 w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-black focus:ring-2 focus:ring-purple-500 outline-none transition"
      />
    </div>
  );
}
