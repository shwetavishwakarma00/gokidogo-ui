"use client";

import { useEffect, useState, useRef } from "react";
import { LogOut, Lock, User, Camera, Eye, EyeOff } from "lucide-react";
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

  const inputCls =
    "w-full px-4 py-2.5 rounded-xl bg-white border border-gray-300 text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500";

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
    if (!passwords.newPassword)
      return toast.error("Enter password");

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
    <div className="min-h-screen bg-gray-100 p-6 text-black">
      <Toaster />

      <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-lg flex overflow-hidden">

        {/* SIDEBAR */}
        <div className="w-64 border-r p-6 flex flex-col">

          {/* PROFILE TOP */}
          <div className="text-center mb-8">
            <div
              onClick={() => fileInputRef.current.click()}
              className="w-24 h-24 mx-auto rounded-full bg-purple-100 flex items-center justify-center cursor-pointer overflow-hidden shadow"
            >
              {profileImage ? (
                <img src={profileImage} className="w-full h-full object-cover" />
              ) : (
                <span className="text-2xl font-bold text-black">
                  {initials}
                </span>
              )}
            </div>

            <p className="mt-3 font-semibold text-black">
              {form.firstName} {form.lastName}
            </p>
            <p className="text-xs text-gray-600">{form.email}</p>
          </div>

          {/* MENU */}
          <MenuBtn icon={<User size={16} />} label="Profile" active={activeTab === "profile"} onClick={() => setActiveTab("profile")} />
          <MenuBtn icon={<Lock size={16} />} label="Password" active={activeTab === "password"} onClick={() => setActiveTab("password")} />

          <div className="flex-1" />

          <MenuBtn icon={<LogOut size={18} />} label="Logout" danger onClick={handleLogout} />
        </div>

        {/* CONTENT */}
        <div className="flex-1 p-8 min-h-[650px]">

          {/* TITLE */}
          <h2 className="text-2xl font-bold text-purple-900 mb-6 underline underline-offset-1 decoration-2">
            Personal Information
          </h2>
          
          {/* PROFILE */}
          {activeTab === "profile" && (
            <div className="grid md:grid-cols-2 gap-5">

              <Input label="First Name" name="firstName" value={form.firstName} onChange={handleChange} />
              <Input label="Last Name" name="lastName" value={form.lastName} onChange={handleChange} />
              <Input label="Email" name="email" value={form.email} onChange={handleChange} />
              <Input label="Mobile" name="mobile" value={form.mobile} onChange={handleChange} />

              <Input type="date" label="Date of Birth" name="dateOfBirth" value={form.dateOfBirth} onChange={handleChange} />

              <div>
                <label className="text-sm font-medium text-black">Gender</label>
                <div className="flex gap-4 mt-2 text-black">
                  {["Male", "Female", "Other"].map((g) => (
                    <label key={g} className="flex items-center gap-1">
                      <input type="radio" name="gender" value={g} checked={form.gender === g} onChange={handleChange} />
                      {g}
                    </label>
                  ))}
                </div>
              </div>

              <div className="md:col-span-2">
                <Input label="Address" name="address" value={form.address} onChange={handleChange} />
              </div>

              <Input label="City" name="city" value={form.city} onChange={handleChange} />
              <Input label="State" name="state" value={form.state} onChange={handleChange} />
              <Input label="Country" name="country" value={form.country} onChange={handleChange} />

              <div className="md:col-span-2">
                <button
                  onClick={saveProfile}
                  className="bg-purple-600 hover:bg-orange-700 text-white px-6 py-2.5 rounded-xl"
                >
                  Save Changes
                </button>
              </div>

            </div>
          )}

          {/* PASSWORD */}
          {activeTab === "password" && (
            <div className="max-w-md space-y-4">

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

      <input type="file" ref={fileInputRef} onChange={handleImageChange} hidden />
    </div>
  );
}

/* COMPONENTS */

function MenuBtn({ icon, label, active, danger, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm mb-2
      ${danger ? "text-red-600 hover:bg-red-50 font-semibold"
        : active ? "bg-purple-100 text-purple-600 font-semibold"
        : "text-black hover:bg-gray-100"}`}
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
