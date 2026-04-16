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
        background: "linear-gradient(90deg, #6035b8 0%, #7c5cbf 100%)",
      }}
      className="w-full min-h-[50vh] md:min-h-[60vh] lg:min-h-screen pb-16 md:pb-20 lg:pb-24"
    >
      <div className="flex flex-col lg:flex-row items-center px-6 md:px-10 lg:px-16 pt-10 md:pt-14 lg:pt-16 gap-12">

        {/* LEFT */}
        <div className="flex-1 text-white relative">

          <motion.h2
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-extrabold"
          >
            {t("hero_title") || data.hero.title}
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-4 text-sm md:text-base opacity-90 max-w-md"
          >
            {t("hero_subtitle") || data.hero.subtitle}
          </motion.p>

          {/* BOOKING BOX */}
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-10 w-full max-w-[560px] lg:absolute lg:top-[65%] lg:right-[-60px] z-20"
          >
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ repeat: Infinity, duration: 4 }}
              className="bg-white rounded-2xl p-7 mt-10 shadow-2xl"
            >

              {/* ROW */}
              <div className="bg-gray-100 rounded-lg px-4 py-3 mb-4">
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">

                  {/* PEOPLE */}
                  <div className="flex items-center gap-2 sm:border-r pr-4 border-gray-800">
                    <span className="text-xs font-semibold text-gray-700">
                      {t("people") || "People"}:
                    </span>

                    <button
                      onClick={() => setPeople(Math.max(1, people - 1))}
                      className="px-2 bg-gray-400 rounded"
                    >
                      -
                    </button>

                    <span className="text-sm font-bold text-gray-900">
                      {people}
                    </span>

                    <button
                      onClick={() => setPeople(people + 1)}
                      className="px-2 bg-gray-400 rounded"
                    >
                      +
                    </button>
                  </div>

                  {/* DATE */}
                  <div className="flex items-center gap-2 sm:border-r px-4 border-gray-800">
                    <span className="text-xs font-semibold text-gray-900">
                      {t("date") || "Date"}:
                    </span>

                    <input
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="text-sm outline-none text-black font-bold"
                    />
                  </div>

                  {/* BUDGET */}
                  <div
                    ref={dropdownRef}
                    className="relative flex items-center gap-2 flex-1"
                  >
                    <span className="text-xs font-semibold text-gray-700">
                      {t("budget") || "Budget"}:
                    </span>

                    <button
                      onClick={() => setOpen(!open)}
                      className="flex items-center gap-1 text-sm font-bold text-gray-900"
                    >
                      {budget}
                      <svg
                        className={`ml-1 transition-transform ${
                          open ? "rotate-180" : ""
                        }`}
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
                      <motion.div className="absolute top-8 left-0 bg-white text-black font-bold shadow-lg rounded-md w-28 z-30 border">
                        {options.map((item, i) => (
                          <div
                            key={i}
                            onClick={() => {
                              setBudget(item);
                              setOpen(false);
                            }}
                            className="px-3 py-2 text-sm hover:bg-gray-100 cursor-pointer"
                          >
                            {item}
                          </div>
                        ))}
                      </motion.div>
                    )}
                  </div>

                </div>
              </div>

              {/* CTA */}
              <Link href="/restaurant">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="w-full cursor-pointer bg-green-600 hover:bg-orange-600 mt-5 text-white font-bold py-3 rounded-lg transition"
                >
                  {t("button") || data.hero.button}
                </motion.button>
              </Link>

            </motion.div>

            {/* NOTE */}
            <p className="text-sm text-white/80 mt-4">
              {t("note") || data.hero.note}
            </p>
          </motion.div>
        </div>

        {/* RIGHT IMAGE (UNCHANGED UI) */}
        <motion.div
          initial={{ opacity: 0, x: 60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="flex-shrink-0"
        >
          <Image
            src="/Image/hero.jpg"
            width={600}
            height={400}
            alt="food meeting"
            className="
              object-cover rounded-xl shadow-xl
              w-[280px] sm:w-[360px] md:w-[440px] lg:w-[560px]
              h-[180px] sm:h-[240px] md:h-[300px] lg:h-[360px]
            "
          />
        </motion.div>

      </div>
    </section>
  );
}