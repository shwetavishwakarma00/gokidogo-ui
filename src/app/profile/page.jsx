"use client";

import { useEffect, useState, useRef } from "react";
import { LogOut, Lock, User, Eye, EyeOff } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import { useRouter } from "next/navigation";

const genderMap = { "1": "Male", "2": "Female", "3": "Other" };

export default function ProfilePage() {
  const router = useRouter();
  const fileInputRef = useRef(null);

  const [activeTab, setActiveTab] = useState("profile");
  const [profileImage, setProfileImage] = useState(null);
  const [showPass, setShowPass] = useState(false);

  const [form, setForm] = useState({
    firstName: "", lastName: "", email: "", mobile: "",
    dateOfBirth: "", gender: "", address: "",
    state: "", city: "", country: "",
  });

  const [passwords, setPasswords] = useState({
    newPassword: "",
    confirmPassword: ""
  });

  const initials =
    `${form.firstName?.[0] || ""}${form.lastName?.[0] || ""}`.toUpperCase() || "?";

  useEffect(() => {
    const storedImage = localStorage.getItem("profileImage");
    if (storedImage) setProfileImage(storedImage);

    const loginUser = JSON.parse(localStorage.getItem("user") || "null");
    const signupUser = JSON.parse(localStorage.getItem("signupData") || "null");

    let base = {
      firstName: "", lastName: "", email: "", mobile: "",
      dateOfBirth: "", gender: "", address: "",
      state: "", city: "", country: "",
    };

    if (signupUser) base = { ...base, ...signupUser };

    if (loginUser) {
      const nameParts = (loginUser.CustomerName || "").split(" ");
      base = {
        ...base,
        firstName: nameParts[0] || "",
        lastName: nameParts.slice(1).join(" "),
        email: loginUser.EmailAddress || "",
        mobile: loginUser.MobileNo || "",
        dateOfBirth: loginUser.DOB || "",
        gender: genderMap[loginUser.Gender] || "",
        address: loginUser.Address || "",
        state: loginUser.State || "",
        city: loginUser.City || "",
        country: loginUser.Country || "",
      };
    }

    const saved = JSON.parse(localStorage.getItem("profileData") || "null");
    setForm(saved || base);
  }, []);

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

  const saveProfile = () => {
    localStorage.setItem("profileData", JSON.stringify(form));
    toast.success("Profile saved ✅");
  };

  const changePassword = () => {
    if (!passwords.newPassword) return toast.error("Enter password");
    if (passwords.newPassword !== passwords.confirmPassword)
      return toast.error("Passwords do not match");
    toast.success("Password updated 🔐");
    setPasswords({ newPassword: "", confirmPassword: "" });
  };

  const handleLogout = () => {
    localStorage.clear();
    toast.success("Logged out 👋");
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-gray-100 p-3 sm:p-6 text-black">
      <Toaster />

      <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-lg overflow-hidden">

        {/* ── MOBILE TOP BAR (visible only on small screens) ── */}
        <div className="flex flex-col items-center pt-6 pb-4 px-4 border-b sm:hidden">

          {/* Avatar */}
          <div
            onClick={() => fileInputRef.current.click()}
            className="w-20 h-20 rounded-full bg-purple-100 flex items-center justify-center cursor-pointer overflow-hidden shadow mb-2"
          >
            {profileImage ? (
              <img src={profileImage} className="w-full h-full object-cover" alt="Profile" />
            ) : (
              <span className="text-xl font-bold text-black">{initials}</span>
            )}
          </div>

          <p className="font-semibold text-black text-sm">
            {form.firstName} {form.lastName}
          </p>
          <p className="text-xs text-gray-500 mb-4">{form.email}</p>

          {/* Tab strip */}
          <div className="flex w-full gap-2">
            <MobileTabBtn
              icon={<User size={15} />}
              label="Profile"
              active={activeTab === "profile"}
              onClick={() => setActiveTab("profile")}
            />
            <MobileTabBtn
              icon={<Lock size={15} />}
              label="Password"
              active={activeTab === "password"}
              onClick={() => setActiveTab("password")}
            />
            <MobileTabBtn
              icon={<LogOut size={15} />}
              label="Logout"
              danger
              onClick={handleLogout}
            />
          </div>
        </div>

        {/* ── DESKTOP LAYOUT (sidebar + content side by side) ── */}
        <div className="flex">

          {/* SIDEBAR — hidden on mobile */}
          <div className="hidden sm:flex w-64 border-r p-6 flex-col shrink-0">

            <div className="text-center mb-8">
              <div
                onClick={() => fileInputRef.current.click()}
                className="w-24 h-24 mx-auto rounded-full bg-purple-100 flex items-center justify-center cursor-pointer overflow-hidden shadow"
              >
                {profileImage ? (
                  <img src={profileImage} className="w-full h-full object-cover" alt="Profile" />
                ) : (
                  <span className="text-2xl font-bold text-black">{initials}</span>
                )}
              </div>
              <p className="mt-3 font-semibold text-black">
                {form.firstName} {form.lastName}
              </p>
              <p className="text-xs text-gray-600">{form.email}</p>
            </div>

            <MenuBtn icon={<User size={16} />} label="Profile" active={activeTab === "profile"} onClick={() => setActiveTab("profile")} />
            <MenuBtn icon={<Lock size={16} />} label="Password" active={activeTab === "password"} onClick={() => setActiveTab("password")} />

            <div className="flex-1" />

            <MenuBtn icon={<LogOut size={18} />} label="Logout" danger onClick={handleLogout} />
          </div>

          {/* CONTENT */}
          <div className="flex-1 p-4 sm:p-8 min-h-[500px] sm:min-h-[650px]">

            <h2 className="text-xl sm:text-2xl font-bold text-purple-900 mb-5 sm:mb-6 underline underline-offset-1 decoration-2">
              Personal Information
            </h2>

            {/* PROFILE TAB */}
            {activeTab === "profile" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">

                <Input label="First Name" name="firstName" value={form.firstName} onChange={handleChange} />
                <Input label="Last Name" name="lastName" value={form.lastName} onChange={handleChange} />
                <Input label="Email" name="email" value={form.email} onChange={handleChange} />
                <Input label="Mobile" name="mobile" value={form.mobile} onChange={handleChange} />
                <Input type="date" label="Date of Birth" name="dateOfBirth" value={form.dateOfBirth} onChange={handleChange} />

                <div>
                  <label className="text-sm font-medium text-black">Gender</label>
                  <div className="flex flex-wrap gap-3 sm:gap-4 mt-2 text-black">
                    {["Male", "Female", "Other"].map((g) => (
                      <label key={g} className="flex items-center gap-1 text-sm">
                        <input type="radio" name="gender" value={g} checked={form.gender === g} onChange={handleChange} />
                        {g}
                      </label>
                    ))}
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <Input label="Address" name="address" value={form.address} onChange={handleChange} />
                </div>

                <Input label="City" name="city" value={form.city} onChange={handleChange} />
                <Input label="State" name="state" value={form.state} onChange={handleChange} />
                <Input label="Country" name="country" value={form.country} onChange={handleChange} />

                <div className="sm:col-span-2">
                  <button
                    onClick={saveProfile}
                    className="w-full sm:w-auto bg-purple-600 hover:bg-orange-700 text-white px-6 py-2.5 rounded-xl"
                  >
                    Save Changes
                  </button>
                </div>

              </div>
            )}

            {/* PASSWORD TAB */}
            {activeTab === "password" && (
              <div className="w-full max-w-md space-y-4">

                <div className="relative">
                  <Input
                    type={showPass ? "text" : "password"}
                    label="New Password"
                    name="newPassword"
                    value={passwords.newPassword}
                    onChange={handlePasswordChange}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className="absolute right-3 top-9 text-gray-600"
                  >
                    {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>

                <div className="relative">
                  <Input
                    type={showPass ? "text" : "password"}
                    label="Confirm Password"
                    name="confirmPassword"
                    value={passwords.confirmPassword}
                    onChange={handlePasswordChange}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className="absolute right-3 top-9 text-gray-600"
                  >
                    {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>

                <button
                  onClick={changePassword}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2.5 rounded-xl"
                >
                  Update Password
                </button>

              </div>
            )}

          </div>
        </div>
      </div>

      <input type="file" ref={fileInputRef} onChange={handleImageChange} hidden />
    </div>
  );
}

/* ── COMPONENTS ── */

function MenuBtn({ icon, label, active, danger, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm mb-2
      ${danger
        ? "text-red-600 hover:bg-red-50 font-semibold"
        : active
          ? "bg-purple-100 text-purple-600 font-semibold"
          : "text-black hover:bg-gray-100"
      }`}
    >
      {icon} {label}
    </button>
  );
}

/* Compact tab button used in mobile top bar */
function MobileTabBtn({ icon, label, active, danger, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-medium
      ${danger
        ? "text-red-600 bg-red-50"
        : active
          ? "bg-purple-100 text-purple-600"
          : "text-gray-600 bg-gray-100"
      }`}
    >
      {icon} {label}
    </button>
  );
}

function Input({ label, ...props }) {
  return (
    <div>
      <label className="text-sm font-medium text-black">{label}</label>
      <input
        {...props}
        className="mt-1 w-full px-4 py-2.5 rounded-xl border border-gray-300 bg-white text-black focus:ring-2 focus:ring-purple-500 outline-none"
      />
    </div>
  );
}