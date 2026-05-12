"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useTranslation } from "../hooks/useTranslation";

const fadeInLeft = {
  initial: { opacity: 0, x: -40 },
  whileInView: { opacity: 1, x: 0 },
  viewport: { once: true },
  transition: { duration: 0.5 },
};

const fadeInRight = {
  initial: { opacity: 0, x: 40 },
  whileInView: { opacity: 1, x: 0 },
  viewport: { once: true },
  transition: { duration: 0.5 },
};

export default function InfoSections() {
  const { t } = useTranslation();

  return (
    <section className="w-full bg-[#f6f4fb] py-5 px-4 md:px-16">

         <div className="flex items-center gap-4 mb-8">
        <h2 className="text-[20px] font-semibold text-[#5b3dbd] whitespace-nowrap">
          {t("Information.title") || "Unser Frankfurter Genuss-Partner:"}
        </h2>
        <div className="flex-1 h-[1px] bg-[#d8d2ea]" />
      </div>

      {/* ── SECTION 1 ── Text Left · Image Right */}
      <section className="w-full py-14 px-4 md:px-16 max-w-[1200px] mx-auto">
        <div className="flex flex-col md:flex-row items-center gap-10">
          <motion.div {...fadeInLeft} className="w-full md:w-[55%]">
            <h2 className="text-[22px] md:text-[28px] font-bold text-black leading-snug mb-4">
              {t("section1.title")}
            </h2>
            <p className="text-[14px] text-black leading-relaxed mb-6">
              {t("section1.desc")}
            </p>
            <button className="bg-[#5A35B5] hover:bg-[#7e5dd1] text-white text-[14px] font-semibold px-5 py-2.5 rounded-[6px] transition-colors">
              {t("section1.button")}
            </button>
          </motion.div>
          <motion.div {...fadeInRight} className="w-full md:w-[45%] shrink-0">
            <Image
              src="/Image/section1.png"
              alt={t("section1.title")}
              width={540}
              height={360}
              className="w-full h-[260px] md:h-[300px] object-cover rounded-[8px]"
            />
          </motion.div>
        </div>
      </section>

      <div className="w-full h-[1px] bg-[#efefef]" />

      {/* ── SECTION 2 ── Image Left · Text Right */}
      <section className="w-full py-14 px-4 md:px-16 max-w-[1200px] mx-auto">
        <div className="flex flex-col md:flex-row items-center gap-10">
          <motion.div {...fadeInLeft} className="w-full md:w-[45%] shrink-0">
            <Image
              src="/Image/section2.png"
              alt={t("section2.title")}
              width={540}
              height={360}
              className="w-full h-[260px] md:h-[300px] object-cover rounded-[8px]"
            />
          </motion.div>
          <motion.div {...fadeInRight} className="w-full md:w-[55%]">
            <h2 className="text-[22px] md:text-[28px] font-bold text-black leading-snug mb-4">
              {t("section2.title")}
            </h2>
            <p className="text-[14px] text-black leading-relaxed mb-3">
              {t("section2.desc")}
            </p>
            <p className="text-[14px] font-semibold text-black mb-6">
              {t("section2.cta_text")}
            </p>
            <button className="bg-[#5A35B5] hover:bg-[#7e5dd1] text-white text-[14px] font-semibold px-5 py-2.5 rounded-[6px] transition-colors">
              {t("section2.button")}
            </button>
          </motion.div>
        </div>
      </section>

      <div className="w-full h-[1px] bg-[#efefef]" />

{/* SECTION 3 ── Text Left · Image Right */}
{/* SECTION 3 ── Text Left · Image Right */}
<section className="w-full py-14 px-4 md:px-16 max-w-[1200px] mx-auto">
  <div className="flex flex-col md:flex-row-reverse items-center gap-10">

    {/* Image */}
    <motion.div
      {...fadeInRight}
      className="w-full md:w-[45%] shrink-0"
    >
      <Image
        src="/Image/section3.png"
        alt={t("section3.title")}
        width={540}
        height={360}
        className="w-full h-[260px] md:h-[300px] object-cover rounded-[8px]"
      />
    </motion.div>

    {/* Content */}
    <motion.div
      {...fadeInLeft}
      className="w-full md:w-[55%]"
    >
      <h2 className="text-[22px] md:text-[28px] font-bold text-black leading-snug mb-4">
        {t("section3.title")}
      </h2>

      <p className="text-[14px] text-black leading-relaxed mb-5">
        {t("section3.desc")}
      </p>

      <ul className="space-y-4 mb-6">

        {/* STEP 1 */}
        <li className="text-[14px] text-black leading-relaxed flex gap-2">
          <span className="text-[#e8630a] font-bold shrink-0">•</span>

          <span>
            <strong className="text-black">
              {t("section3.step1.label")}
            </strong>{" "}
            {t("section3.step1.desc")}
          </span>
        </li>

        {/* STEP 2 */}
        <li className="text-[14px] text-black leading-relaxed flex gap-2">
          <span className="text-[#e8630a] font-bold shrink-0">•</span>

          <span>
            <strong className="text-black">
              {t("section3.step2.label")}
            </strong>{" "}
            {t("section3.step2.desc")}
          </span>
        </li>

        {/* STEP 3 */}
        <li className="text-[14px] text-black leading-relaxed flex gap-2">
          <span className="text-[#e8630a] font-bold shrink-0">•</span>

          <span>{t("section3.step3")}</span>
        </li>

      </ul>

      <button className="bg-[#5A35B5] hover:bg-[#7e5dd1] text-white text-[14px] font-semibold px-5 py-2.5 rounded-[6px] transition-colors">
        {t("section3.button")}
      </button>
    </motion.div>

  </div>
</section>

<div className="w-full h-[1px] bg-[#efefef]" />

     {/* SECTION 4 ── Image left · Text right */}
<section className="w-full py-14 px-4 md:px-16 max-w-[1200px] mx-auto">
  <div className="flex flex-col md:flex-row items-center gap-10">

    {/* Image Left */}
    <motion.div
      {...fadeInLeft}
      className="w-full md:w-[45%] shrink-0"
    >
      <Image
        src="/Image/section4.png"
        alt={t("section4.title")}
        width={540}
        height={360}
        className="w-full h-[260px] md:h-[300px] object-cover rounded-[8px]"
      />
    </motion.div>

    {/* Text Right */}
    <motion.div
      {...fadeInRight}
      className="w-full md:w-[55%]"
    >
      <h2 className="text-[22px] md:text-[28px] font-bold text-black leading-snug mb-4">
        {t("section4.title")}
      </h2>

      <p className="text-[14px] text-black leading-relaxed mb-6">
        {t("section4.desc")}
      </p>

      <button className="bg-[#5A35B5] hover:bg-[#7e5dd1] text-white text-[14px] font-semibold px-5 py-2.5 rounded-[6px] transition-colors">
        {t("section4.button")}
      </button>
    </motion.div>

  </div>
</section>

<div className="w-full h-[1px] bg-[#efefef]" />

      {/* ── SECTION 5 ── Image Left · Text Right */}
<section className="w-full py-14 px-4 md:px-16 max-w-[1200px] mx-auto">
  <div className="flex flex-col md:flex-row items-center gap-10">

    {/* LEFT CONTENT */}
    <motion.div
      {...fadeInLeft}
      className="w-full md:w-[55%]"
    >
      <h2 className="text-[22px] md:text-[28px] font-bold text-black leading-snug mb-4">
        {t("section5.title")}
      </h2>

      <p className="text-[14px] text-black leading-relaxed mb-4">
        {t("section5.intro")}
      </p>

      
      <button className="bg-[#5A35B5] hover:bg-[#7e5dd1] text-white text-[14px] font-semibold px-5 py-2.5 rounded-[6px] transition-colors">
        {t("section5.button")}
      </button>
    </motion.div>

    {/* RIGHT IMAGE */}
    <motion.div
      {...fadeInRight}
      className="w-full md:w-[45%] shrink-0"
    >
      <Image
        src="/Image/section5.png"
        alt={t("section5.title")}
        width={540}
        height={360}
        className="w-full h-[260px] md:h-[300px] object-cover rounded-[8px]"
      />
    </motion.div>

  </div>
</section>

    </section>
  );
}