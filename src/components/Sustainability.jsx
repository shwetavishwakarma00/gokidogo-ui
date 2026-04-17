"use client";

import { Leaf, Info, Recycle } from "lucide-react";
import { useTranslation } from "../hooks/useTranslation";

export default function Sustainability() {
  const { t } = useTranslation();

  return (
    <section className="w-full bg-[#f3f1fa] py-12 px-4">

      <div className="max-w-6xl mx-auto">

        {/* Title + line */}
        <div className="flex items-center gap-4 mb-4">
          <h2 className="text-[18px] font-semibold text-[#4b3fb3] whitespace-nowrap">
            {t("Sustainable & Fair") || "Nachhaltig & Fair:"}
          </h2>
          <div className="w-full h-[1px] bg-[#dcd7f3]"></div>
        </div>

        {/* Info bar */}
        <div className="bg-[#ece8f9] rounded-lg px-6 py-3 flex flex-col md:flex-row items-center justify-between gap-6">

          {/* item 1 */}
          <div className="flex items-center gap-3 text-[#4b3fb3] text-sm">
            <div className="bg-[#dcd7f3] p-2 rounded-full">
              <Recycle size={18} />
            </div>
            <p>{t("Reusable instead of single-use") || "Mehrweg statt Einweg"}</p>
          </div>

          <div className="hidden md:block w-[1px] h-6 bg-[#dcd7f3]"></div>

          {/* item 2 */}
          <div className="flex items-center gap-3 text-[#4b3fb3] text-sm">
            <div className="bg-[#dcd7f3] p-2 rounded-full">
              <Info size={18} />
            </div>
            <p>{t("2.5x for educational projects") || "2,5 X für Bildungsprojekte"}</p>
          </div>

          <div className="hidden md:block w-[1px] h-6 bg-[#dcd7f3]"></div>

          {/* item 3 */}
          <div className="flex items-center gap-3 text-[#4b3fb3] text-sm">
            <div className="bg-[#dcd7f3] p-2 rounded-full">
              <Leaf size={18} />
            </div>
            <p>
              {t("Already saved 12.4 tons of waste !") || (
                <>
                  Schon <span className="font-semibold">12.4 Tonnen</span> Müll gespart!
                </>
              )}
            </p>
          </div>

        </div>

      </div>
    </section>
  );
}