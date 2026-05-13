"use client";

import Link from "next/link";
import { useState, useContext, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { LanguageContext } from "../context/LanguageContext";
import { useTranslation } from "../hooks/useTranslation";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [localUser, setLocalUser] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const reduxUser = useSelector((state) => state.auth?.user);
  const { lang, setLang } = useContext(LanguageContext);
  const { t } = useTranslation();

  // ✅ localStorage sync
  useEffect(() => {
    const sync = () => {
      const stored = localStorage.getItem("user");
      setLocalUser(stored ? JSON.parse(stored) : null);
    };
    sync();
    window.addEventListener("userChanged", sync);
    return () => window.removeEventListener("userChanged", sync);
  }, []);

  useEffect(() => {
    if (reduxUser) setLocalUser(reduxUser);
  }, [reduxUser]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const user = localUser || reduxUser;

  const userInitial =
    user?.FirstName?.[0]?.toUpperCase() ||
    user?.EmailAddress?.[0]?.toUpperCase() ||
    "U";

  const handleLogout = () => {
    localStorage.removeItem("user");
    setLocalUser(null);
    setDropdownOpen(false);
    window.dispatchEvent(new Event("userChanged"));
    window.location.replace("/"); // ← router nahi, hard redirect
  };

  return (
    <nav className="sticky top-0 z-50 bg-[linear-gradient(90deg,#5A35B5_40%,#7C5CC2_60%)] text-white shadow-md">
      <div className="flex items-center justify-between px-4 sm:px-6 md:px-10 lg:px-16 py-3 md:py-4">

        {/* LOGO */}
        <Link href="/">
          <div className="flex items-center gap-1 cursor-pointer">
            <span className="text-lg md:text-xl font-bold tracking-wide">gokidogo</span>
            {/* <span className="text-xs md:text-sm opacity-80 tracking-wider">EVENTS</span> */}
          </div>
        </Link>

        {/* DESKTOP MENU */}
        <div className="hidden md:flex items-center gap-6 lg:gap-10 text-sm font-medium tracking-wide">
          <a href="#" className="hover:opacity-80 transition">{t("navbar.howItWorks")}</a>
          <a href="#" className="hover:opacity-80 transition">{t("navbar.forBusinesses")}</a>
          <a href="#" className="hover:opacity-80 transition">{t("navbar.sustainability")}</a>

          <select
            value={lang}
            onChange={(e) => setLang(e.target.value)}
            className="text-white px-2 py-1 rounded bg-transparent border border-white/40"
          >
            <option value="en" className="text-black">EN</option>
            <option value="de" className="text-black">DE</option>
          </select>

          {user ? (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="w-9 h-9 rounded-full bg-white text-purple-700 flex items-center justify-center font-bold text-sm hover:scale-105 transition"
              >
                {userInitial}
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-44 bg-white text-gray-800 rounded-xl shadow-lg py-2 z-50">
                  <p className="px-4 py-2 text-xs text-gray-400 border-b">
                    {user?.FirstName} {user?.LastName}
                  </p>
                  <Link
                    href="/profile"
                    onClick={() => setDropdownOpen(false)}
                    className="block px-4 py-2 text-sm hover:bg-purple-50 transition"
                  >
                    My Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-50 transition"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link href="/login">
              <span className="bg-white text-purple-700 px-4 py-1.5 rounded-lg font-semibold hover:bg-gray-100 transition">
                {t("navbar.login")}
              </span>
            </Link>
          )}
        </div>

        {/* MOBILE BUTTON */}
        <button className="md:hidden text-xl" onClick={() => setOpen(!open)}>☰</button>
      </div>

      {/* MOBILE MENU */}
      {open && (
        <div className="md:hidden flex flex-col gap-4 px-4 pb-4 text-sm bg-[#6b46c1] font-medium">
          <a>{t("navbar.howItWorks")}</a>
          <a>{t("navbar.forBusinesses")}</a>
          <a>{t("navbar.sustainability")}</a>

          <div className="flex items-center gap-2 pt-2 border-t border-white/20">
            <span className="text-xs opacity-80">Language:</span>
            <select
              value={lang}
              onChange={(e) => setLang(e.target.value)}
              className="text-black px-2 py-1 rounded text-xs"
            >
              <option value="en">EN</option>
              <option value="de">DE</option>
            </select>
          </div>

          <div className="pt-2 border-t border-white/20">
            {user ? (
              <div className="flex items-center justify-between">
                <Link href="/profile" onClick={() => setOpen(false)}>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-white text-purple-700 flex items-center justify-center font-bold text-sm">
                      {userInitial}
                    </div>
                    <span>{user?.FirstName || t("navbar.profile")}</span>
                  </div>
                </Link>
                <button onClick={handleLogout} className="text-red-300 text-xs">
                  Logout
                </button>
              </div>
            ) : (
              <Link href="/login" onClick={() => setOpen(false)}>
                {t("navbar.login")}
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}