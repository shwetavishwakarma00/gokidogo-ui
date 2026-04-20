

"use client";

import * as Icons from "lucide-react";
import { useTranslation } from "../hooks/useTranslation";

export default function Sustainability() {
  const { t } = useTranslation();

  const icons = [Icons.Recycle, Icons.Info, Icons.Leaf];

  const items = t("sustainable_fair.items");

  return (
    <section className="bg-[#f6f4fb] py-5 px-4 md:px-16">
      <div className="max-w-7xl mx-auto">

        {/* Title */}
        <div className="flex items-center gap-4 mb-8">
          <h2 className="text-[18px] sm:text-[20px] md:text-[22px] font-semibold text-[#5b3dbd] whitespace-nowrap">
            {t("sustainable_fair.title")}
          </h2>
          <div className="w-full h-[1px] bg-[#dcd7f3]" />
        </div>

        <div className="bg-[#ece8f9] rounded-lg px-4 sm:px-6 py-4">

          <div className="flex flex-col md:flex-row md:items-center md:justify-between">

            {items?.map((item, i) => {
              const Icon = icons[i];

              return (
                <div key={i} className="flex items-center gap-3 w-full py-2 md:py-0">

                  <div className="bg-[#dcd7f3] p-2 rounded-full">
                    <Icon size={18} />
                  </div>

                  <p className="text-[#4b3fb3] text-sm sm:text-base">
                    {item.label}
                  </p>

                </div>
              );
            })}

          </div>

        </div>

      </div>
    </section>
  );
}

