"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProfileThunk, updateProfileThunk } from "@/app/redux/features/authSlice";
import toast, { Toaster } from "react-hot-toast";

export default function ProfilePage() {
  const dispatch = useDispatch();
  const profile = useSelector((state) => state.auth?.profile);
  const userRedux = useSelector((state) => state.auth?.user);

  const [user, setUser] = useState(null);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    mobile: "",
    dateOfBirth: "",
    title: "",
    gender: "",
  });

  useEffect(() => {
    let u = userRedux;
    if (!u) {
      const stored = localStorage.getItem("user");
      if (stored) u = JSON.parse(stored);
    }
    if (u) {
      setUser(u);
      dispatch(fetchProfileThunk({
        customer_ID: u.CustomerId,
        email: u.EmailAddress,
        apikey: u.apikey,
        deviceId: "web123", // server expects deviceid
      }));
    }
  }, [userRedux, dispatch]);

  useEffect(() => {
  if (profile) {
    const p = Array.isArray(profile) ? profile[0] : profile;
    setForm({
      firstName: p?.firstName || "",   // ✅ camelCase
      lastName: p?.lastName || "",
      mobile: p?.mobile || "",
      dateOfBirth: p?.dateOfBirth || "",
      title: p?.title || "",
      gender: p?.gender || "",
    });
  }
}, [profile]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const updateProfile = () => {
    if (!user) return toast.error("User not loaded");
    dispatch(updateProfileThunk({
  customer_ID: user.CustomerId,
  email: user.EmailAddress,
  apikey: user.apikey,
  deviceId: user.CustomerId,

  firstName: form.firstName,
  lastName: form.lastName,
  mobile: form.mobile,
  dateOfBirth: form.dateOfBirth,
  title: form.title,
  gender: form.gender
}));

console.log({
  customer_ID: user.CustomerId,
  email: user.EmailAddress,
  apikey: user.apikey,
  deviceId: user.CustomerId,
  firstName: form.firstName,
  lastName: form.lastName,
  mobile: form.mobile,
  dateOfBirth: form.dateOfBirth,
  title: form.title,
  gender: form.gender
});
    toast.success("Profile Updated ✅");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 py-10 px-4">
      <Toaster />
      <div className="max-w-2xl mx-auto bg-white rounded-3xl shadow-xl overflow-hidden">

        {/* Header */}
        <div className="bg-gradient-to-r from-[#69529d] to-[#7c5bc9] px-8 py-8 text-white">
          <div className="flex items-center gap-5">
            <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center text-4xl font-bold">
              {form.firstName?.[0]?.toUpperCase() || "?"}
            </div>
            <div>
              <h1 className="text-2xl font-bold">{form.firstName} {form.lastName}</h1>
              <p className="text-purple-200 text-sm mt-1">{user?.EmailAddress || ""}</p>
              <span className="mt-2 inline-block bg-white/20 text-white text-xs px-3 py-1 rounded-full">
                {form.title || "Member"}
              </span>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="px-8 py-8">
          <h2 className="text-lg font-semibold text-gray-700 mb-6 border-b pb-2">Edit Profile</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">

            <div className="flex flex-col gap-1">
              <label className="text-sm text-gray-500 font-medium">First Name</label>
              <input
                name="firstName"
                value={form.firstName}
                onChange={handleChange}
                placeholder="First Name"
                className="border border-gray-200 p-3 rounded-xl text-black focus:ring-2 focus:ring-purple-400 outline-none"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm text-gray-500 font-medium">Last Name</label>
              <input
                name="lastName"
                value={form.lastName}
                onChange={handleChange}
                placeholder="Last Name"
                className="border border-gray-200 p-3 rounded-xl text-black focus:ring-2 focus:ring-purple-400 outline-none"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm text-gray-500 font-medium">Mobile</label>
              <input
                name="mobile"
                value={form.mobile}
                onChange={handleChange}
                placeholder="Mobile"
                className="border border-gray-200 p-3 rounded-xl text-black focus:ring-2 focus:ring-purple-400 outline-none"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm text-gray-500 font-medium">Date of Birth</label>
              <input
                type="date"
                name="dateOfBirth"
                value={form.dateOfBirth}
                onChange={handleChange}
                className="border border-gray-200 p-3 rounded-xl text-black focus:ring-2 focus:ring-purple-400 outline-none"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm text-gray-500 font-medium">Title</label>
              <select
                name="title"
                value={form.title}
                onChange={handleChange}
                className="border border-gray-200 p-3 rounded-xl text-black focus:ring-2 focus:ring-purple-400 outline-none"
              >
                <option value="">Select Title</option>
                <option>Mr</option>
                <option>Mrs</option>
                <option>Ms</option>
              </select>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm text-gray-500 font-medium">Gender</label>
              <select
                name="gender"
                value={form.gender}
                onChange={handleChange}
                className="border border-gray-200 p-3 rounded-xl text-black focus:ring-2 focus:ring-purple-400 outline-none"
              >
                <option value="">Select Gender</option>
                <option value="M">Male</option>
                <option value="F">Female</option>
              </select>
            </div>

          </div>

          <button
            onClick={updateProfile}
            disabled={!user}
            className="mt-8 w-full bg-gradient-to-r from-[#69529d] to-[#7c5bc9] text-white py-3 rounded-xl font-semibold text-lg hover:opacity-90 transition disabled:opacity-50"
          >
            Update Profile
          </button>
        </div>

      </div>
    </div>
  );
}