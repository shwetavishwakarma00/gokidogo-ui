"use client";

import Image from "next/image";
import { useState, useRef, useEffect, useContext } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import data from "@/data/home.json";

import { LanguageContext } from "../context/LanguageContext";
import { useTranslation } from "../hooks/useTranslation";

export default function Hero() {
  const [open, setOpen] = useState(false);
  const [budget, setBudget] = useState("₹12");
  const [people, setPeople] = useState(12);
  const [date, setDate] = useState("2024-07-17");

  const dropdownRef = useRef(null);
  const options = ["₹12", "₹25", "₹50", "₹100"];

  const { lang, setLang } = useContext(LanguageContext);
  const { t } = useTranslation();

  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

return (
<section
  style={{
    background: "linear-gradient(90deg,#5A35B5 40%,#7C5CC2 60%)",
  }}
  className="w-full pt-15 pb-20"
>
  <div className="max-w-[1200px] mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center">

    {/* LEFT */}
    <div className="text-white">

      <motion.h2
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-4xl md:text-5xl font-extrabold leading-tight"
      >
        {t("hero_title") || data.hero.title}
      </motion.h2>

      <p className="mt-4 opacity-90 max-w-[520px]">
        {t("hero_subtitle") || data.hero.subtitle}
      </p>

      {/* BOOKING BOX */}
      <motion.div
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-10 w-full"
      >

        <div className="bg-white rounded-xl shadow-xl p-6 w-full">

          {/* INPUT ROW */}
          <div className="bg-[#F3F4F6] rounded-lg px-4 py-3 w-full">
            <div className="flex flex-wrap md:flex-nowrap items-center gap-4">

              {/* PEOPLE */}
              <div className="flex items-center gap-2 border-r pr-4 border-gray-300">
                <span className="text-xs font-semibold text-gray-600">
                  {t("people") || "People"}:
                </span>

                <button
                  onClick={() => setPeople(Math.max(1, people - 1))}
                  className="px-2 bg-gray-300 rounded"
                >
                  -
                </button>

                <span className="font-bold text-gray-900">
                  {people}
                </span>

                <button
                  onClick={() => setPeople(people + 1)}
                  className="px-2 bg-gray-300 rounded"
                >
                  +
                </button>
              </div>

              {/* DATE */}
              <div className="flex items-center gap-2 border-r px-4 border-gray-300">
                <span className="text-xs font-semibold text-gray-600">
                  {t("date") || "Date"}:
                </span>

                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="outline-none text-sm text-black bg-transparent"
                />
              </div>

              {/* BUDGET */}
              <div
                ref={dropdownRef}
                className="relative flex items-center gap-2"
              >
                <span className="text-xs font-semibold text-gray-600">
                  {t("budget") || "Budget"}:
                </span>

                <button
                  onClick={() => setOpen(!open)}
                  className="flex items-center gap-1 text-sm font-bold text-gray-900"
                >
                  {budget}

                  <svg
                    className={`${open ? "rotate-180" : ""}`}
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke="currentColor"
                      strokeWidth={2.5}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                {open && (
                  <div className="absolute top-8 left-0 bg-white shadow-md rounded-md w-28 border">
                    {options.map((item, i) => (
                      <div
                        key={i}
                        onClick={() => {
                          setBudget(item);
                          setOpen(false);
                        }}
                        className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                      >
                        {item}
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>
          </div>

          {/* BUTTON */}
          <Link href="/restaurant">
            <button className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-lg mt-5">
              {t("Suggest Menu") || data.hero.button}
            </button>
          </Link>

        </div>

        <p className="text-sm text-white/80 mt-4">
          {t("In 2 minutes, ready to go – from $9.90 per person.") ||
            data.hero.note}
        </p>

      </motion.div>
    </div>

    {/* RIGHT IMAGE */}
    <div className="w-full">
      <Image
        src="/Image/hero.jpg"
        width={600}
        height={400}
        alt="food meeting"
        className="w-full h-[300px] md:h-[360px] object-cover rounded-xl shadow-xl"
      />
    </div>

  </div>
</section>
)
}