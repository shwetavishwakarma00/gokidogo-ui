
"use client";

import { ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import { useTranslation } from "../hooks/useTranslation";

export default function Steps() {
  const { t } = useTranslation();

  const steps = [
    {
      img: "/Image/step1.png",
      title: t("steps.step1.title"),
      desc: t("steps.step1.desc"),
    },
    {
      img: "/Image/step2.png",
      title: t("steps.step2.title"),
      desc: t("steps.step2.desc"),
    },
    {
      img: "/Image/step3.png",
      title: t("steps.step3.title"),
      desc: t("steps.step3.desc"),
    },
  ];

  return (
    <section className="w-full bg-[#f3f1fa] py-12 px-4 sm:px-8 md:px-14 lg:px-20">

      {/* HEADER */}
      <div className="flex items-center gap-4 mb-12">
        <h2 className="text-lg sm:text-xl font-semibold text-[#2d1c6b] whitespace-nowrap">
          {t("steps.title")}
        </h2>
        <div className="h-[1px] bg-[#cfc6ea] w-full" />
      </div>

      {/* ROW */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-8">

        {steps.map((step, index) => (
          <div key={index} className="flex items-center w-full">

            {/* WRAPPER */}
            <div className="relative w-full">

              {/* CARD (balanced padding) */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-[#e4ddf7] rounded-xl px-6 pt-20 pb-6 w-full text-center shadow-sm"
              >

                {/* TITLE */}
                <p className="font-semibold text-[#2d1c6b] text-[15px] mb-1">
                  {step.title}
                </p>

                {/* DESC */}
                <p className="text-[13px] text-[#6b6b6b]">
                  <span className="text-[#6c3fc5]">✓</span> {step.desc}
                </p>

              </motion.div>

              {/* FLOATING IMAGE (medium-big balanced) */}
              <div className="absolute -top-28 left-1/2 -translate-x-1/2">
                <img
                  src={step.img}
                  alt={step.title}
                  className="w-[240px] h-[240px] object-contain drop-shadow-md"
                />
              </div>

            </div>

            {/* ARROW */}
            {index < steps.length - 1 && (
              <div className="hidden sm:flex items-center justify-center px-4 text-[#2d1c6b]">
                <ChevronRight
                  className="w-6 h-6 opacity-70"
                  strokeWidth={2.5}
                />
              </div>
            )}

          </div>
        ))}

      </div>
    </section>
  );
}
