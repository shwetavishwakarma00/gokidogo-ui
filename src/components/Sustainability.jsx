"use client";

import { Leaf, Gift, Shield } from "lucide-react";
import { useTranslation } from "../hooks/useTranslation";

export default function Sustainability() {
  const { t } = useTranslation();

  return (
    <section className="relative bg-gradient-to-br from-[#f6f4fb] via-[#f3f0ff] to-[#eef2ff] px-4 sm:px-6 md:px-10 lg:px-16 py-10 md:py-14 overflow-hidden">

      {/* Glow Background Effect (EXACT SAME UI) */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-purple-200 rounded-full blur-3xl opacity-30"></div>
      <div className="absolute bottom-0 right-0 w-72 h-72 bg-indigo-200 rounded-full blur-3xl opacity-30"></div>

      {/* Heading (EXACT SAME UI) */}
      <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-purple-900 mb-8 relative z-10">
        {t("sustainability.title") || "Sustainable & Fair"}
      </h2>

      {/* Card (EXACT SAME UI STRUCTURE) */}
      <div className="relative z-10 backdrop-blur-lg bg-white/80 border border-white/40 rounded-2xl p-6 sm:p-8 md:p-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 md:gap-8 shadow-lg hover:shadow-xl transition-all duration-300">

        {/* ITEM 1 */}
        <div className="group flex items-center gap-4 w-full md:w-auto transition-all duration-300 hover:scale-105">

          <div className="bg-purple-100 text-purple-700 p-3 rounded-full group-hover:bg-purple-700 group-hover:text-white transition-all duration-300">
            <Leaf className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>

          <p className="text-sm sm:text-base text-gray-700 font-medium">
            {t("sustainability.reuse") || "Reusable instead of disposable"}
          </p>

        </div>

        {/* Divider (EXACT SAME UI) */}
        <div className="hidden md:block h-12 w-px bg-gradient-to-b from-transparent via-gray-300 to-transparent"></div>

        {/* ITEM 2 */}
        <div className="group flex items-center gap-4 w-full md:w-auto transition-all duration-300 hover:scale-105">

          <div className="bg-purple-100 text-purple-700 p-3 rounded-full group-hover:bg-purple-700 group-hover:text-white transition-all duration-300">
            <Gift className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>

          <p className="text-sm sm:text-base text-gray-700 font-medium">
            {t("sustainability.education") || "2.5× for education projects"}
          </p>

        </div>

        {/* Divider (EXACT SAME UI) */}
        <div className="hidden md:block h-12 w-px bg-gradient-to-b from-transparent via-gray-300 to-transparent"></div>

        {/* ITEM 3 */}
        <div className="group flex items-center gap-4 w-full md:w-auto transition-all duration-300 hover:scale-105">

          <div className="bg-purple-100 text-purple-700 p-3 rounded-full group-hover:bg-purple-700 group-hover:text-white transition-all duration-300">
            <Shield className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>

          <p className="text-sm sm:text-base text-gray-700 font-medium">
            {t("sustainability.waste") || (
              <>
                Already saved{" "}
                <span className="text-purple-800 font-semibold">
                  12.4 tons
                </span>{" "}
                of waste!
              </>
            )}
          </p>

        </div>

      </div>
    </section>
  );
}