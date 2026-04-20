"use client";
import Image from "next/image";
import Link from "next/link";
import data from "@/data/home.json";
import { useTranslation } from "../hooks/useTranslation";

export default function Partners() {
  const { t } = useTranslation();

  const badgeStyles = [
    { text: "text-[#7c3aed]", italic: true },   // PastaCultura — purple italic
    { text: "text-[#16a34a]", italic: false },   // GreenGarden — green
    { text: "text-[#e11d48]", italic: true },    // Tavola Rustica — red italic
  ];

  return (
    <section className="w-full bg-[#f6f4fb] py-5 px-4 md:px-16">

      {/* Heading */}
      <div className="flex items-center gap-4 mb-8">
        <h2 className="text-[20px] font-semibold text-[#5b3dbd] whitespace-nowrap">
          {t("partners.title") || "Unser Frankfurter Genuss-Partner:"}
        </h2>
        <div className="flex-1 h-[1px] bg-[#d8d2ea]" />
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">

        {data.partners.map((partner, index) => (
          <Link key={index} href={`/restaurant/${index}`}>

            {/* Card */}
            <div className="relative pb-7">

              {/* IMAGE */}
              <div className="relative w-full h-[200px] rounded-2xl overflow-hidden shadow-md">
                <Image
                  src={partner.image}
                  fill
                  alt={partner.name}
                  className="object-cover"
                />
              </div>

              {/* BADGE */}
              <div className="absolute -bottom-0 left-1/2 -translate-x-1/2 z-20 whitespace-nowrap">                
              <div className="bg-white shadow-lg rounded-xl px-8 py-3 flex items-center gap-2">
                  
                  {index === 1 && (
                    <span className="w-4 h-4 rounded-full bg-green-500 flex items-center justify-center shrink-0">
                      <svg viewBox="0 0 24 24" className="w-3 h-3 fill-white">
                        <path d="M17 8C8 10 5.9 16.17 3.82 19.34L5.71 21l1-1.3A4.49 4.49 0 0 0 8 20c4 0 4-2 8-2s4 2 8 2v-2c-4 0-4-2-8-2a10.71 10.71 0 0 0-3 .4C14.32 13.17 16 11 21 10z"/>
                      </svg>
                    </span>
                  )}

                  <span
                    className={`font-bold text-[15px] tracking-wide 
                    ${index === 0 ? "italic text-[#7c3aed]" : ""}
                    ${index === 1 ? "text-[#16a34a]" : ""}
                    ${index === 2 ? "italic text-[#e11d48]" : ""}
                    `}
                  >
                    {partner.name}
                  </span>
                </div>
              </div>

            </div>
          </Link>
        ))}

      </div>
    </section>
  );
}