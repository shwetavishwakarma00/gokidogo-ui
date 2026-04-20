"use client";

import data from "@/data/home.json";
import { CalendarDays, UtensilsCrossed, Truck, ChevronRight, Check } from "lucide-react";
import { motion } from "framer-motion";
import { useTranslation } from "../hooks/useTranslation";

export default function Steps() {
  const { t } = useTranslation();

  const steps = [
    {
      icon: CalendarDays,
      title: t("steps.step1.title"),
      desc: t("steps.step1.desc"),
    },
    {
      icon: UtensilsCrossed,
      title: t("steps.step2.title"),
      desc: t("steps.step2.desc"),
    },
    {
      icon: Truck,
      title: t("steps.step3.title"),
      desc: t("steps.step3.desc"),
    },
  ];

  return (
    <section className="bg-[#f0edf8] py-10 px-4 sm:px-8 md:px-14 lg:px-20">

      {/* Section heading */}
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
        className="text-lg sm:text-xl font-semibold text-[#2d1c6b] mb-8 text-center sm:text-left"
      >
        {t("steps.title")}
      </motion.h2>

      {/* Cards row */}
      <div className="flex flex-col sm:flex-row items-stretch justify-center">

        {steps.map((step, index) => {
          const Icon = step.icon;

          return (
            <div
              key={index}
              className="flex items-center flex-col sm:flex-row w-full sm:flex-1 max-w-xs sm:max-w-none mx-auto sm:mx-0"
            >

              {/* CARD */}
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: index * 0.15 }}
                viewport={{ once: true }}
                className="flex flex-col items-center text-center bg-white rounded-2xl px-6 pt-6 pb-5 w-full shadow-sm"
              >

                {/* Icon box */}
                <div className="h-[90px] flex items-center justify-center mb-4">
                  <div className="w-[72px] h-[72px] rounded-2xl bg-[#ede8f8] flex items-center justify-center">
                    <Icon className="w-9 h-9 text-[#4c2fa0]" strokeWidth={1.6} />
                  </div>
                </div>

                {/* Title */}
                <p className="font-bold text-[#2d1c6b] text-[15px] leading-snug mb-1.5">
                  {step.title}
                </p>

                {/* Desc with checkmark */}
                <div className="flex items-center gap-1.5 justify-center">
                  <Check className="w-3.5 h-3.5 text-[#6c3fc5] shrink-0" strokeWidth={3} />
                  <span className="text-[13px] text-[#444] leading-tight">
                    {step.desc}
                  </span>
                </div>

              </motion.div>

              {/* Arrow */}
              {index < steps.length - 1 && (
                <div className="flex items-center justify-center sm:px-2 md:px-3 py-2 sm:py-0 text-[#2d1c6b] shrink-0">
                  <ChevronRight
                    className="w-6 h-6 rotate-90 sm:rotate-0 opacity-80"
                    strokeWidth={2.5}
                  />
                </div>
              )}

            </div>
          );
        })}
      </div>
    </section>
  );
}