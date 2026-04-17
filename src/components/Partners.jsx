"use client";
import Image from "next/image";
import Link from "next/link";
import data from "@/data/home.json";
import { useTranslation } from "../hooks/useTranslation";

export default function Partners() {
  const { t } = useTranslation();

  return (
    <section className="bg-[#f6f4fb] py-5 px-4 md:px-16">

      {/* Heading with line */}
      <div className="flex items-center gap-4 mb-8">
        <h2 className="text-[20px] font-semibold text-[#5b3dbd] whitespace-nowrap">
          {t("partners.title") || "Unser Frankfurter Genuss-Partner:"}
        </h2>
        <div className="flex-1 h-[1px] bg-[#d8d2ea]" />
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

        {data.partners.map((partner, index) => (
          <Link key={index} href={`/restaurant/${index}`}>
  <div className="bg-white rounded-[14px] shadow-sm overflow-visible">

    {/* IMAGE WRAPPER */}
    <div className="relative w-full h-[180px] overflow-hidden rounded-t-[14px]">

      <Image
        src={partner.image}
        fill
        alt={partner.name}
        className="object-cover"
      />

      </div>
      {/* Badge */}
      <div className="absolute   left-1/2 -translate-x-1/2 z-20">
        <span
          className={`bg-white shadow-lg px-6 py-3 rounded-lg font-semibold text-sm
          ${
            index === 0
              ? "text-purple-700"
              : index === 1
              ? "text-green-600"
              : "text-red-500"
          }`}
        >
          {partner.name}
        </span>
      </div>

  </div>
</Link>
        ))}

      </div>
    </section>
  );
}