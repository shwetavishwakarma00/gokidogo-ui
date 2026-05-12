
"use client";

import { ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import { useTranslation } from "../hooks/useTranslation";

export default function Steps() {
  const { t } = useTranslation();

  const steps = [
    { img: "/Image/Step_1.png", title: t("steps.step1.title"), desc: t("steps.step1.desc") },
    { img: "/Image/Step_2.png", title: t("steps.step2.title"), desc: t("steps.step2.desc") },
    { img: "/Image/Step_3.png", title: t("steps.step3.title"), desc: t("steps.step3.desc") },
  ];

  return (
    <section className="w-full bg-[#f6f4fb] py-2 px-4 md:px-16">

  {/* HEADER */}
      <div className="flex items-center gap-4 mb-8">
        <h2 className="text-[20px] font-semibold text-[#5b3dbd] whitespace-nowrap">
      {t("steps.title")}
    </h2>
    <div className="flex-1 h-[1px] bg-[#d6d1ee]" />
  </div>

  {/* STEPS */}
  <div className="flex flex-col md:flex-row items-center justify-center gap-12 md:gap-0">

    {steps.map((step, index) => (
      <div key={index} className="flex items-center">

        {/* CARD WRAPPER */}
        <div className="relative flex flex-col items-center pt-[8px]">

          {/* IMAGE (UNCHANGED) */}
          <img
            src={step.img}
            alt={step.title}
            className="absolute top-[0px] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150px] h-auto object-contain z-10"
          />

          {/* CARD */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            viewport={{ once: true }}
            className="bg-[#dcd6f3] rounded-[8px] w-[300px] h-[110px] px-2 pb-5 pt-5 flex flex-col justify-end text-center"
          >
            <p className="text-[15px] font-bold text-[#1e1256] mb-1">
              {step.title}
            </p>

            <p className="text-[13px] text-[#6f6a8a] flex items-center justify-center">
              <span className="mr-1">✓</span>
              {step.desc}
            </p>
          </motion.div>
        </div>

        {/* ARROW */}
        {index < steps.length - 1 && (
          <div className="hidden md:flex items-center px-2 text-[#1e1256]">
            <ChevronRight className="w-[40px] h-[40px]" />
          </div>
        )}

      </div>
    ))}

  </div>

</section>
  );
}   





