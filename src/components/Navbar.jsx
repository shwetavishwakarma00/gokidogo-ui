"use client";

import Link from "next/link";
import { useState, useEffect, useContext } from "react";
import { useSelector } from "react-redux";
import { LanguageContext } from "../context/LanguageContext";
import { useTranslation } from "../hooks/useTranslation";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const user = useSelector((state) => state.auth?.user);

  const { lang, setLang } = useContext(LanguageContext);
  const { t } = useTranslation();

  if (!mounted) return null;

  const userInitial =
    user?.FirstName?.[0]?.toUpperCase() ||
    user?.EmailAddress?.[0]?.toUpperCase() ||
    "U";

  return (
    <nav className="sticky top-0 z-50 bg-gradient-to-r from-[#69529d] to-[#7c5bc9] text-white shadow-md">

      <div className="flex items-center justify-between px-4 sm:px-6 md:px-10 lg:px-16 py-3 md:py-4">

        {/* LOGO (EXACT SAME UI) */}
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

        {/* DESKTOP MENU (EXACT SAME UI) */}
        <div className="hidden md:flex items-center gap-6 lg:gap-10 text-sm font-medium tracking-wide">

          <a href="#" className="hover:opacity-80 transition">
            {t("navbar.howItWorks")}
          </a>

          <a href="#" className="hover:opacity-80 transition">
            {t("navbar.forBusinesses")}
          </a>

          <a href="#" className="hover:opacity-80 transition">
            {t("navbar.sustainability")}
          </a>

          {/* LANGUAGE SWITCH */}
          <select
            value={lang}
            onChange={(e) => setLang(e.target.value)}
            className="text-black px-2 py-1 rounded"
          >
            <option value="en">EN</option>
            <option value="de">DE</option>
          </select>

          {/* LOGIN / PROFILE (EXACT SAME UI) */}
          {user ? (
            <Link href="/profile">
              <div className="flex items-center gap-2 bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-lg transition cursor-pointer">

                <div className="w-7 h-7 rounded-full bg-white text-purple-700 flex items-center justify-center font-bold text-sm">
                  {userInitial}
                </div>

                <span className="text-white font-semibold text-sm">
                  {user?.FirstName || t("navbar.profile")}
                </span>

              </div>
            </Link>
          ) : (
            <Link href="/login">
              <span className="bg-white text-purple-700 px-4 py-1.5 rounded-lg font-semibold hover:bg-gray-100 transition">
                {t("navbar.login")}
              </span>
            </Link>
          )}
        </div>

        {/* MOBILE BUTTON */}
        <button className="md:hidden text-xl" onClick={() => setOpen(!open)}>
          ☰
        </button>
      </div>

      {/* MOBILE MENU (EXACT SAME UI) */}
      {open && (
        <div className="md:hidden flex flex-col gap-4 px-4 pb-4 text-sm bg-[#6b46c1] font-medium">

          <a>{t("navbar.howItWorks")}</a>
          <a>{t("navbar.forBusinesses")}</a>
          <a>{t("navbar.sustainability")}</a>

          <div className="pt-2 border-t border-white/20">

            {user ? (
              <Link href="/profile" onClick={() => setOpen(false)}>
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-white text-purple-700 flex items-center justify-center font-bold text-sm">
                    {userInitial}
                  </div>
                  <span>{user?.FirstName || t("navbar.profile")}</span>
                </div>
              </Link>
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