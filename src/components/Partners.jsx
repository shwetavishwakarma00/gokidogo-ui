"use client";
import { useTranslation } from "../hooks/useTranslation";

const FingerfoodIcon = [
  "/Image/finger_food-Basic.png",
  "/Image/finger_food-Classic.png",
  "/Image/finger_food-Prime.png",
];

const CheckIcon = () => (
  <svg
    className="w-4 h-4 text-[#5A35B5] shrink-0 mt-0.5"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
  >
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const plans = [
  { key: "basic", bestseller: false },
  { key: "classic", bestseller: true },
  { key: "premium", bestseller: false },
];

export default function FingerfoodSection() {
  const { t } = useTranslation();

  return (
    <section className="w-full bg-[#f6f4fb] py-14 px-4 md:px-10 lg:px-16">
      {/* Header */}
      <div className="text-center mb-4">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
          {t("fingerfood.title")}
        </h2>
        <p className="text-gray-500 text-sm md:text-base max-w-xl mx-auto">
          {t("fingerfood.subtitle")}
        </p>
      </div>

      {/* Choose text */}
      <p className="text-center font-semibold text-gray-800 text-sm md:text-base mb-2">
        {t("fingerfood.choose")}
      </p>

      {/* Delivery text */}
      <p className="text-center text-gray-500 text-sm md:text-base max-w-2xl mx-auto mb-12">
        {t("fingerfood.delivery")}
      </p>

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {plans.map(({ key, bestseller }, index) => (
          <div
            key={key}
            className="relative bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow border border-gray-100 overflow-hidden flex flex-col"
          >
            {/* Bestseller Badge — only on Classic (index 1) */}
            {bestseller && (
              <div className="absolute top-3 right-3 z-10">
                <span className="bg-[#E8533A] text-white text-xs font-semibold px-3 py-1 rounded-md">
                  Bestseller
                </span>
              </div>
            )}

            {/* Icon Area — mint green bg same as screenshot for all cards */}
            <div className="bg-[#f1f0fa] flex items-center justify-center py-8">
              <img
                src={FingerfoodIcon[index]}
                alt={key}
                className="w-36 h-36 object-contain"
              />
            </div>

            {/* Content */}
            <div className="p-5 flex flex-col flex-1">
              <h3 className="text-lg font-bold text-gray-900 mb-1">
                {t(`fingerfood.${key}.title`)}
              </h3>

              <p className="text-gray-400 text-sm mb-4 leading-snug">
                {t(`fingerfood.${key}.desc`)}
              </p>

              {/* Features */}
              <div className="flex flex-col gap-2 mb-5">
                <div className="flex items-start gap-2">
                  <CheckIcon />
                  <span className="text-sm text-gray-700">
                    {t(`fingerfood.${key}.items`)}
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckIcon />
                  <span className="text-sm text-gray-700">
                    {t(`fingerfood.${key}.dishes`)}
                  </span>
                </div>
              </div>

              {/* Pricing */}
              <div className="mt-auto">
                <p className="text-xl font-bold text-gray-900">
                  {t(`fingerfood.${key}.price`)}
                </p>
                <p className="text-xs text-gray-400 mb-1">
                  {t("fingerfood.exclVat")}
                </p>
                <p className="text-sm text-gray-500 mb-4">
                  {t("fingerfood.minimum")}
                </p>

                <button className="w-full bg-[#5A35B5] hover:bg-[#7e5dd1] text-white font-semibold py-3 rounded-xl transition-colors duration-200 text-sm">
                  {t("fingerfood.button")}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}