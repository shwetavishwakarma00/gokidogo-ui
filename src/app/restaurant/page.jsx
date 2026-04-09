
"use client";

import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchRestaurant } from "@/app/redux/features/restaurantSlice";
import Image from "next/image";

export default function RestaurantMenu() {
  const dispatch = useDispatch();

  const { restaurantInfo, categories, deliveryHours, zipcodes, loading } =
    useSelector((state) => state.restaurant);

  const [activeCategory, setActiveCategory] = useState(null);
  const [isSticky, setIsSticky] = useState(false);
  const sentinelRef = useRef(null);

  useEffect(() => {
    dispatch(fetchRestaurant());
  }, [dispatch]);

  useEffect(() => {
    if (categories?.length) {
      setActiveCategory(categories[0].category_id);
    }
  }, [categories]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsSticky(!entry.isIntersecting),
      { threshold: 0 }
    );
    if (sentinelRef.current) observer.observe(sentinelRef.current);
    return () => observer.disconnect();
  }, []);

  if (loading)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-purple-50 gap-4">
        <div className="w-10 h-10 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin" />
        <p className="text-purple-700 text-sm font-medium">Loading menu…</p>
      </div>
    );

  const selectedCategory = categories?.find(
    (cat) => cat.category_id === activeCategory
  );

  return (
    <div className="min-h-screen bg-[#f4f4f8] text-gray-800 font-sans">

      {/* ── HERO ── */}
      <div className="relative bg-gradient-to-br from-[#5b3fa0] via-[#6b47b8] to-[#7c5dc9] overflow-hidden">
        {/* Decorative circles */}
        <div className="absolute top-[-60px] right-[-60px] w-72 h-72 rounded-full bg-white/5 pointer-events-none" />
        <div className="absolute bottom-[-40px] left-[-40px] w-56 h-56 rounded-full bg-white/5 pointer-events-none" />

        <div className="max-w-6xl mx-auto px-6 py-14 md:py-20 flex flex-col md:flex-row items-center gap-10">
          {/* Left: text */}
          <div className="flex-1 text-white animate-[fadeUp_0.7s_ease_both]">
            {restaurantInfo ? (
              <>
                <p className="text-green-300 text-xs font-semibold tracking-widest uppercase mb-3">
                  ✦ Now Open
                </p>
                <h1 className="text-4xl md:text-5xl font-extrabold leading-tight mb-4 tracking-tight">
                  {restaurantInfo.name}
                </h1>
                <div className="flex items-center gap-2 text-white/70 text-sm mb-6">
                  <span className="text-green-300">📍</span>
                  {restaurantInfo.address}
                </div>
                <div className="inline-block bg-white/10 border border-white/20 rounded-xl px-5 py-3 text-white/80 text-sm backdrop-blur-sm">
                  🛵 Fast delivery · Fresh ingredients · Great prices
                </div>
              </>
            ) : (
              <h1 className="text-4xl font-extrabold text-white">Our Menu</h1>
            )}
          </div>

          {/* Right: hero image */}
          <div className="flex-shrink-0 w-full md:w-[380px] h-[240px] rounded-2xl overflow-hidden shadow-2xl ring-4 ring-white/20">
            <Image
              src="/image/biryani.jpg"
              width={200}
              height={150}
              alt="Food"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Bottom wave */}
        <div className="relative h-10 overflow-hidden">
          <svg viewBox="0 0 1200 40" preserveAspectRatio="none" className="absolute bottom-0 w-full h-10 fill-[#f4f4f8]">
            <path d="M0,20 C300,40 900,0 1200,20 L1200,40 L0,40 Z" />
          </svg>
        </div>
      </div>

      {/* Sentinel */}
      <div ref={sentinelRef} className="h-0" />

      {/* ── STICKY CATEGORY BAR ── */}
      <div
        id="menu"
        className={`bg-white z-40 border-b border-purple-100 transition-all duration-300 ${
          isSticky ? "sticky top-[57px] shadow-md" : ""
        }`}
      >
        <div className="max-w-6xl mx-auto px-6 py-3 flex gap-2 overflow-x-auto scrollbar-hide">
          {categories?.map((cat) => (
            <button
              key={cat.category_id}
              onClick={() => setActiveCategory(cat.category_id)}
              className={`px-5 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all duration-200 outline-none focus:outline-none border ${
                activeCategory === cat.category_id
                  ? "bg-[#6b47b8] text-white border-[#6b47b8] shadow-md shadow-purple-200"
                  : "bg-white text-gray-500 border-gray-200 hover:border-purple-300 hover:text-purple-700"
              }`}
            >
              {cat.category}
            </button>
          ))}
        </div>
      </div>

      {/* ── MENU GRID ── */}
      <div className="max-w-6xl mx-auto px-6 py-10">
        {selectedCategory && (
          <div className="flex items-center gap-3 mb-8">
            <div className="w-1 h-7 bg-[#6b47b8] rounded-full" />
            <h2 className="text-xl font-bold text-gray-800 tracking-tight">
              {selectedCategory.category}
            </h2>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {selectedCategory?.category_products?.map((item, idx) => {
            const imageUrl =
              item.image && item.sku
                ? `${item.image}${item.sku}.jpg`
                : "/food.jpg";

            return (
              <div
                key={item.mnuid}
                className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100"
                style={{ animationDelay: `${idx * 50}ms` }}
              >
                {/* Image */}
                <div className="relative h-44 overflow-hidden">
                  <Image
                    src={imageUrl}
                    width={400}
                    height={200}
                    alt={item.name}
                    onError={(e) => { e.target.src = "/food.jpg"; }}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  {/* Purple gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#5b3fa0]/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  {/* Price badge */}
                  <span className="absolute top-3 right-3 bg-[#3db56e] text-white font-bold text-sm px-3 py-1 rounded-full shadow-lg">
                    €{item.price}
                  </span>
                </div>

                {/* Body */}
                <div className="p-4">
                  <h3 className="font-bold text-gray-800 text-base leading-snug mb-1">
                    {item.name}
                  </h3>
                  {item.description && (
                    <p className="text-sm text-gray-400 leading-relaxed mb-3 line-clamp-2">
                      {item.description}
                    </p>
                  )}
                  <div className="flex items-center justify-between mt-2">
                    {item.allergy_info?.length > 0 ? (
                      <span className="text-xs text-orange-600 bg-orange-50 border border-orange-200 rounded-md px-2 py-1">
                        ⚠ {item.allergy_info.map((a) => a.name).join(", ")}
                      </span>
                    ) : (
                      <span />
                    )}
                    <button className="bg-[#6b47b8] hover:bg-[#5b3fa0] text-white text-xs font-semibold px-4 py-1.5 rounded-full transition-colors duration-200">
                      + Add
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── DELIVERY HOURS ── */}
      {deliveryHours?.length > 0 && (
        <div id="hours" className="bg-white border-t border-purple-100 py-14 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-1 h-7 bg-[#3db56e] rounded-full" />
              <h2 className="text-xl font-bold text-gray-800 tracking-tight">
                Delivery Hours
              </h2>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {deliveryHours.map((hour, i) => (
                <div
                  key={i}
                  className="bg-purple-50 border border-purple-100 rounded-xl px-4 py-4 hover:border-purple-300 transition-colors"
                >
                  <p className="font-bold text-sm text-[#6b47b8] mb-1">{hour.Day}</p>
                  <p className="text-xs text-gray-500">
                    {hour.FirstOrder} – {hour.LastOrder}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── DELIVERY AREAS ── */}
      {zipcodes?.length > 0 && (
        <div id="areas" className="bg-[#f4f4f8] border-t border-purple-100 py-14 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-1 h-7 bg-[#6b47b8] rounded-full" />
              <h2 className="text-xl font-bold text-gray-800 tracking-tight">
                Delivery Areas
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {zipcodes.map((zip, i) => (
                <div
                  key={i}
                  className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm hover:shadow-md hover:border-purple-200 transition-all"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-bold text-[#6b47b8] text-base">
                      {zip.zip_code}
                    </span>
                    <span className="text-xs bg-purple-100 text-purple-700 font-semibold px-2 py-0.5 rounded-full">
                      {zip.area_name}
                    </span>
                  </div>
                  <div className="flex gap-4 text-xs text-gray-400">
                    <span>
                      Min:{" "}
                      <strong className="text-gray-700">€{zip.minimumorder}</strong>
                    </span>
                    <span>
                      Free from:{" "}
                      <strong className="text-[#3db56e]">€{zip.getFreeFrom}</strong>
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}


      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(18px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
}