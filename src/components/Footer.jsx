"use client";

import { useTranslation } from "../hooks/useTranslation";

export default function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="bg-gradient-to-r from-[#5329c0] to-[#7352c2] text-center py-6 px-4 sm:px-6 md:px-10 text-white">

      {/* CTA Button */}
      <button className="cursor-pointer bg-green-600 hover:bg-orange-700 px-6 sm:px-8 py-2 sm:py-3 rounded-lg font-semibold shadow text-sm sm:text-base">
        {t("footer.plan")}
      </button>

      <hr className="my-5 border-gray-300 w-full max-w-5xl mx-auto" />

      {/* Links */}
      <div className="flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-8 mt-6 text-sm opacity-90 font-bold">
        <a href="#">{t("footer.about")}</a>
        <a href="#">{t("footer.faq")}</a>
        <a href="#">{t("footer.contact")}</a>
        <a href="#">{t("footer.privacy")}</a>
      </div>

    </footer>
  );
}