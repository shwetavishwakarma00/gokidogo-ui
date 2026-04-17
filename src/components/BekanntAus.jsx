"use client";

import Image from "next/image";
import { useTranslation } from "../hooks/useTranslation";

export default function BekanntAus() {
  const { t } = useTranslation();

  const logos = [
    { src: "/Image/fr.png", alt: "FR" },
    { src: "/Image/rheinmain.png", alt: "RheinMain" },
    { src: "/Image/startupweek.png", alt: "StartupWeek" },
    { src: "/Image/startupfrankfurt.png", alt: "StartupWeek Frankfurt RheinMain" },
  ];

  return (
    <section className="bg-[#f3f1fa] py-6 px-4">
      <div className="max-w-6xl mx-auto">

        {/* Title + line */}
        <div className="flex items-center gap-4 mb-6">
          <h2 className="text-[16px] font-semibold text-[#4b3fb3] whitespace-nowrap">
            {t("BekanntAus") || "Nachhaltig & Fair:"}
          </h2>
          <div className="w-full h-[1px] bg-[#dcd7f3]"></div>
        </div>

        {/* Logos */}
        <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-10 md:gap-12">
          {logos.map((logo, i) => (
            <div
              key={i}
              className="
              relative
              w-[120px] h-[60px]
              sm:w-[150px] sm:h-[70px]
              md:w-[180px] md:h-[80px]
              lg:w-[200px] lg:h-[100px]
              "
            >
              <Image
                src={logo.src}
                alt={logo.alt}
                fill
                className="object-contain"
              />
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}