"use client";

import Image from "next/image";
import data from "@/data/home.json";
import { useTranslation } from "../hooks/useTranslation";

const eventKeys = [
  "events.teammeeting",
  "events.hackathon",
  "events.workshop",
  "events.officeLunch",
];

const defaultPrices = [
  "ab 9,90 € P.P.",
  "ab 8,90 € P.P.",
  "ab 10,90 € P.P.",
  "ab 9,90 € P.P.",
];

export default function Events() {
  
  const { t } = useTranslation();

  return (
    <section className="w-full bg-[#f6f4fb] py-2 px-4 md:px-16">

      {/* Heading with lines */}
      <div className="flex items-center gap-4 mb-8">
        <h2 className="text-[20px] font-semibold text-[#5b3dbd] whitespace-nowrap">
          {t("events.title") || "Perfekt für eure Events:"}
        </h2>
        <div className="flex-1 h-[1px] bg-[#d8d2ea]" />
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">

        {data.events.map((event, index) => (
          <div
            key={index}
            className="bg-white rounded-[14px] overflow-hidden shadow-sm " 
          >

            {/* Image */}
            <div className="relative w-full h-[170px]">
              <Image
                src={event.image}
                fill
                alt={t(eventKeys[index])}
                className="object-cover"
              />
            </div>

            {/* Bottom Purple Bar */}
            <div className="bg-gradient-to-r from-[#5c3ab5] to-[#6d4fd6] text-white text-center py-3">

              <h3 className="font-semibold text-[15px]">
                {t(eventKeys[index])}
              </h3>
              <div className="w-40 h-[1px] bg-[#9782f6] mx-auto"></div>
              <p className="text-[13px] opacity-90">
                {defaultPrices[index]}
              </p>

            </div>

          </div>
        ))}

      </div>
    </section>
  );
}
