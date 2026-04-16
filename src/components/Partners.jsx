"use client";

import Image from "next/image";
import Link from "next/link";
import data from "@/data/home.json";
import { useTranslation } from "../hooks/useTranslation";

export default function Partners() {
  const { t } = useTranslation();

  return (
    <section className="bg-[#f6f4fb] px-4 sm:px-6 md:px-10 lg:px-16 py-10 md:py-14">

      {/* Heading (EXACT UI preserved) */}
      <h2 className="text-base sm:text-lg md:text-xl font-semibold text-purple-900 mb-6 md:mb-10 text-center md:text-left">
        {t("partners.title") || "Our Frankfurt Gourmet Partners:"}
      </h2>

      {/* Grid (EXACT UI preserved) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">

        {data.partners.map((partner, index) => (
          <Link
            key={index}
            href={`/restaurant/${index}`}
            className="block"
          >
            <div
              className="bg-white rounded-2xl shadow-sm overflow-hidden 
              transition duration-300 hover:shadow-lg hover:-translate-y-1
              min-h-[240px] sm:min-h-[260px] md:min-h-[280px]
              cursor-pointer"
            >

              {/* Image (EXACT UI preserved) */}
              <Image
                src={partner.image}
                width={400}
                height={200}
                alt={partner.name}
                className="w-full h-[160px] sm:h-[180px] md:h-[200px] object-cover"
              />

              {/* Label (EXACT UI preserved) */}
              <div className="flex justify-center py-4">
                <span
                  className={`bg-white shadow px-4 py-1 rounded-lg font-semibold text-sm sm:text-base
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

