"use client";

import Link from "next/link";
import { useState } from "react";
import { useSelector } from "react-redux";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const user = useSelector((state) => state.auth?.user);

  return (
    <nav className="sticky top-0 z-50  bg-gradient-to-r from-[#69529d] to-[#7c5bc9] text-white shadow-md">

      <div className="flex items-center justify-between 
      px-4 sm:px-6 md:px-10 lg:px-16 
      py-3 md:py-4">

        {/* LOGO */}
        <Link href="/">
          <div className="flex items-center gap-1 cursor-pointer">
            <span className="text-lg md:text-xl font-bold tracking-wide">
              gokidogo
            </span>
            <span className="text-xs md:text-sm opacity-80 tracking-wider">
              EVENTS
            </span>
          </div>
        </Link>

        {/* DESKTOP MENU */}
        <div className="hidden md:flex items-center gap-6 lg:gap-10 
        text-sm font-medium tracking-wide">

          <a href="#" className="hover:opacity-80 transition">How it works</a>
          <a href="#" className="hover:opacity-80 transition">For Businesses</a>
          <a href="#" className="hover:opacity-80 transition">Sustainability</a>

          {/* ✅ Login ya Profile */}
          {user ? (
            <Link href="/profile">
              <div className="flex items-center gap-2 bg-white/20 hover:bg-white/30 
              px-3 py-1.5 rounded-lg transition cursor-pointer">
                {/* Avatar circle with first letter */}
                <div className="w-7 h-7 rounded-full bg-white text-purple-700 
                flex items-center justify-center font-bold text-sm">
                  {user?.FirstName?.[0]?.toUpperCase() || 
                   user?.EmailAddress?.[0]?.toUpperCase() || "U"}
                </div>
                <span className="text-white font-semibold text-sm">
                  {user?.FirstName || "Profile"}
                </span>
              </div>
            </Link>
          ) : (
            <Link href="/login">
              <span className="bg-white text-purple-700 px-4 py-1.5 
              rounded-lg font-semibold hover:bg-gray-100 transition">
                Login
              </span>
            </Link>
          )}
        </div>

        {/* MOBILE BUTTON */}
        <button
          className="md:hidden text-xl"
          onClick={() => setOpen(!open)}
        >
          ☰
        </button>
      </div>

      {/* MOBILE MENU */}
      {open && (
        <div className="md:hidden flex flex-col gap-4 
        px-4 pb-4 text-sm bg-[#6b46c1] font-medium">

          <a href="#">How it works</a>
          <a href="#">For Businesses</a>
          <a href="#">Sustainability</a>

          {/* ✅ Mobile: Login ya Profile */}
          {user ? (
            <Link href="/profile" onClick={() => setOpen(false)}>
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-white text-purple-700 
                flex items-center justify-center font-bold text-sm">
                  {user?.FirstName?.[0]?.toUpperCase() || 
                   user?.EmailAddress?.[0]?.toUpperCase() || "U"}
                </div>
                <span>{user?.FirstName || "Profile"}</span>
              </div>
            </Link>
          ) : (
            <Link href="/login" onClick={() => setOpen(false)}>
              Login
            </Link>
          )}
        </div>
      )}
    </nav>
  );
}