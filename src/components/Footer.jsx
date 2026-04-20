"use client";

import { useTranslation } from "../hooks/useTranslation";

export default function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="bg-gradient-to-r from-[#5126c4] via-[#6a42d6] via-[#7b5ae0] to-[#6e4bd3] text-white pt-10 pb-8 px-4">

      <div className="max-w-6xl mx-auto text-center">

        {/* CTA */}
        <button className="bg-[#62b32c] hover:bg-[#55a528] text-white font-semibold px-12 py-3 rounded-md shadow-md">
          {t("footer.plan") || "Jetzt Event planen"}
        </button>

        {/* divider */}
        <div className="w-full h-[1px] bg-white/30 mt-8 mb-6"></div>

        {/* links */}
        <div className="flex justify-center gap-8 text-sm text-white/90">

          <a href="#" className="hover:text-white">
            {t("footer.about") || "Über uns"}
          </a>

          <a href="#" className="hover:text-white">
            {t("footer.faq") || "FAQ"}
          </a>

          <a href="#" className="hover:text-white">
            {t("footer.contact") || "Kontakt"}
          </a>

          <a href="#" className="hover:text-white">
            {t("footer.privacy") || "Datenschutz"}
          </a>

        </div>

      </div>

    </footer>
  );
}