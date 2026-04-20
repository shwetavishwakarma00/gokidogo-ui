

"use client";

import Image from "next/image";
import { useTranslation } from "../hooks/useTranslation";

export default function BekanntAus() {
  const { t, locale } = useTranslation(); // 👈 assuming your hook gives locale

  const logos = [
    { src: "/Image/FAIR1.png", alt: "FR" },
    { src: "/Image/FAIR2.png", alt: "RheinMain" },
    { src: "/Image/FAIR3.png", alt: "StartupWeek" },
    { src: "/Image/FAIR4.png", alt: "StartupWeek Frankfurt RheinMain" },
  ];


  return (
    <section className="bg-[#f6f4fb] py-6 sm:py-8 md:py-12 px-4 md:px-16">
      <div className="max-w-7xl mx-auto">

        {/* Title */}
        <div className="flex items-center gap-4 mb-8">
          <h2 className="text-[18px] sm:text-[20px] md:text-[22px] font-semibold text-[#5b3dbd] whitespace-nowrap">
            {t("media.title") || "Bekannt aus"}
          </h2>
          <div className="w-full h-[1px] bg-[#dcd7f3]" />
        </div>

        {/* Center wrapper */}
        <div className="flex justify-center">

          {/* Logos Grid */}
          <div
            className="
              grid
              grid-cols-2
              sm:grid-cols-3
              md:grid-cols-4
              gap-6 sm:gap-8 md:gap-10 lg:gap-12
              justify-items-center
              items-center
            "
          >
            {logos.map((logo, i) => (
              <div
                key={i}
                className="
                  relative
                  w-[120px]
                  sm:w-[140px]
                  md:w-[160px]
                  lg:w-[180px]
                  aspect-[3/1]
                  flex items-center justify-center
                "
              >
                <Image
                  src={logo.src}
                  alt={logo.alt}
                  fill
                  sizes="(max-width: 640px) 50vw,(max-width: 768px) 33vw,(max-width: 1024px) 25vw,(max-width: 1280px) 20vw,16vw"
                  className="object-contain"
                  priority={i === 0}
                />
              </div>
            ))}
          </div>

        </div>

      </div>
    </section>
  );
}

