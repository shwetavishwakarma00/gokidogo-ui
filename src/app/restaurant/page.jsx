"use client";

import { useEffect, useState, useRef, useMemo, useCallback } from "react";

import { useDispatch, useSelector } from "react-redux";
import { fetchRestaurantMenu } from "../redux/features/restaurantSlice";
import {
  addToCart,
  increaseQty,
  decreaseQty,
  removeFromCart,
} from "@/app/redux/features/cartSlice";
import { useMenuConfig } from "@/hooks/useMenuConfig";
import ConfigureModal from "@/components/ConfigureModal";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { Trash2, ChevronUp } from "lucide-react";
import { useTranslation } from "react-i18next";

const EURO_TO_INR = 90;

export default function RestaurantMenu() {
  const { t } = useTranslation();

  const dispatch = useDispatch();
  const router = useRouter();

  const { restaurantInfo, categories, loading } = useSelector(
    (state) => state.restaurant
  );

  const user = useSelector((state) => state.auth.user);
  const userId = user?.customerId || "guest_user";

  const cartItems = useSelector((state) => state.cart.carts?.[userId] ?? []);

  const [activeCategory, setActiveCategory] = useState(null);
  const [isSticky, setIsSticky] = useState(false);
  const [configureItem, setConfigureItem] = useState(null);
  const sentinelRef = useRef(null);

  // Ref for mobile order summary section (scroll target)
  const mobileOrderSummaryRef = useRef(null);

  const { configurableHeads } = useMenuConfig(restaurantInfo?.id);

  /* ================= FETCH ================= */
  useEffect(() => {
    dispatch(fetchRestaurantMenu());
  }, [dispatch]);

  /* ================= STICKY CATEGORY ================= */
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsSticky(!entry.isIntersecting),
      { threshold: 0 }
    );
    if (sentinelRef.current) observer.observe(sentinelRef.current);
    return () => observer.disconnect();
  }, []);

  /* ================= ACTIVE CATEGORY ================= */
  const derivedActiveCategory = useMemo(
    () => activeCategory ?? categories?.[0]?.category_id,
    [activeCategory, categories]
  );

  const selectedCategory = useMemo(
    () => categories?.find((cat) => cat.category_id === derivedActiveCategory),
    [categories, derivedActiveCategory]
  );

  /* ================= CART MAP ================= */
  const cartMap = useMemo(() => {
    const map = {};
    cartItems.forEach((i) => {
      const key = i.cartKey || i.mnuid;
      map[key] = i;
    });
    return map;
  }, [cartItems]);

  /* ================= TOTALS ================= */
  const { subtotal, gst, total } = useMemo(() => {
    const subtotal = cartItems.reduce(
      (sum, i) => sum + (i.price || 0) * (i.qty || 1) * EURO_TO_INR,
      0
    );
    const gst = subtotal * 0.05;
    return { subtotal, gst, total: subtotal + gst };
  }, [cartItems]);

  /* ================= HANDLERS ================= */
  const handleAdd = useCallback(
    (item) => dispatch(addToCart({ userId, item })),
    [dispatch, userId]
  );

  const handleConfiguredAdd = useCallback(
    (configuredItem) => dispatch(addToCart({ userId, item: configuredItem })),
    [dispatch, userId]
  );

  const handleIncrease = useCallback(
    (id) => dispatch(increaseQty({ userId, id })),
    [dispatch, userId]
  );

  const handleDecrease = useCallback(
    (id) => dispatch(decreaseQty({ userId, id })),
    [dispatch, userId]
  );

  const handleRemove = useCallback(
    (id) => dispatch(removeFromCart({ userId, id })),
    [dispatch, userId]
  );

  /* ================= SCROLL TO TOP ================= */
  const handleScrollTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  /* ================= SCROLL TO MOBILE ORDER SUMMARY ================= */
  const handlePriceClick = useCallback(() => {
    if (mobileOrderSummaryRef.current) {
      mobileOrderSummaryRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, []);

  /* ================= IMAGE ================= */
  const getImage = (item) => {
    if (item?.image && item?.sku) {
      return `${item.image}${item.sku}.jpg`;
    }
    return "/fallback.jpg";
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        {t("Loading") || "Loading..."}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f4f4f8] text-gray-800">

      {/* ================= HERO ================= */}
      <div className="relative bg-gradient-to-br from-[#5b3fa0] via-[#6b47b8] to-[#7c5dc9] overflow-hidden">
        <div className="absolute top-[-60px] right-[-60px] w-72 h-72 rounded-full bg-white/5" />
        <div className="absolute bottom-[-40px] left-[-40px] w-56 h-56 rounded-full bg-white/5" />

        <div className="max-w-6xl mx-auto px-6 py-14 md:py-20 flex flex-col md:flex-row items-center gap-10">
          <div className="flex-1 text-white">
            <p className="text-green-300 text-xs font-semibold uppercase mb-3">
              ✦ {t("Restaurant Open Now") || "Now Open"}
            </p>
            <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
              {restaurantInfo?.name}
            </h1>
            <div className="text-white/70 text-sm mb-6">
              📍 {restaurantInfo?.address}
            </div>
            <div className="bg-white/10 border border-white/20 rounded-xl px-5 py-3 text-sm backdrop-blur-sm">
              🛵 {t("Fast delivery · Fresh food · Best prices") ||
                "Fast delivery · Fresh food · Best prices"}
            </div>
          </div>

          <div className="w-full md:w-[380px] h-[240px] rounded-2xl overflow-hidden shadow-xl">
            <Image
              src="/Image/biryani.jpg"
              width={400}
              height={200}
              alt="food"
              className="w-full h-full object-cover"
              priority
            />
          </div>
        </div>
      </div>

      <div ref={sentinelRef} />

      {/* ================= CATEGORY BAR ================= */}
      <div className={`bg-white border-b z-40 ${isSticky ? "sticky top-0 shadow-sm" : ""}`}>
        <div className="max-w-6xl mx-auto px-6 py-3 flex gap-3 overflow-x-auto hide-scrollbar scroll-smooth">
          {categories?.map((cat) => (
            <button
              key={cat.category_id}
              onClick={() => setActiveCategory(cat.category_id)}
              className={`px-4 py-2 rounded-full text-sm whitespace-nowrap transition-all duration-200 ${
                derivedActiveCategory === cat.category_id
                  ? "bg-purple-600 text-white shadow"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {cat.category}
            </button>
          ))}
        </div>
      </div>

      {/* ================= MAIN ================= */}
      <div className="max-w-6xl mx-auto px-4 md:px-6 py-6 md:py-10 grid grid-cols-1 lg:grid-cols-4 gap-6">

        {/* ================= ORDER SUMMARY — desktop only ================= */}
        <div className="lg:col-span-1 order-2 lg:order-1 hidden lg:block">
          <div className="bg-white rounded-xl shadow p-4 sticky top-24">
            <h2 className="font-bold text-lg mb-4">
              {t("Order Summary") || "Order Summary"}
            </h2>

            {cartItems.map((item) => {
              const itemTotal = item.price * item.qty * EURO_TO_INR;
              const cartKey = item.cartKey || item.mnuid;

              return (
                <div key={cartKey} className="flex gap-3 mb-4 border-b pb-3">
                  <Image
                    src={getImage(item)}
                    width={60}
                    height={60}
                    alt={item.name}
                    className="rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    <div className="flex justify-between items-center">
                      <p className="text-sm font-semibold">{item.name}</p>
                      <button onClick={() => handleRemove(cartKey)} className="text-red-500">
                        <Trash2 size={16} />
                      </button>
                    </div>

                    {item.addons?.length > 0 && (
                      <div className="mt-1">
                        {item.addons.map((addon, i) => (
                          <p key={i} className="text-xs text-gray-400">
                            + {addon.name}
                            {addon.price > 0
                              ? ` (+₹${(addon.price * EURO_TO_INR).toFixed(0)})`
                              : " (free)"}
                          </p>
                        ))}
                      </div>
                    )}

                    <p className="text-xs text-gray-500 mt-1">₹{itemTotal.toFixed(0)}</p>

                    <div className="flex gap-2 mt-1">
                      <button onClick={() => handleDecrease(cartKey)}>-</button>
                      <span>{item.qty}</span>
                      <button onClick={() => handleIncrease(cartKey)}>+</button>
                    </div>
                  </div>
                </div>
              );
            })}

            {cartItems.length > 0 && (
              <>
                <div className="text-sm space-y-2 mt-3">
                  <div className="flex justify-between">
                    <span>{t("Sub Total")}</span>
                    <span>₹{subtotal.toFixed(0)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{t("GST")}</span>
                    <span>₹{gst.toFixed(0)}</span>
                  </div>
                  <div className="flex justify-between font-bold">
                    <span>{t("Total")}</span>
                    <span>₹{total.toFixed(0)}</span>
                  </div>
                </div>
                <button
                  onClick={() => router.push("/checkout")}
                  className="w-full bg-green-500 text-white py-2 rounded mt-4"
                >
                  {t("Checkout") || "Checkout"}
                </button>
              </>
            )}
          </div>
        </div>

        {/* ================= MENU ITEMS ================= */}
        <div className="lg:col-span-3 order-1 lg:order-2">

          {/* Desktop grid */}
          <div className="hidden lg:grid lg:grid-cols-3 gap-5">
            {selectedCategory?.category_products?.map((item) => {
              const cartItem = cartMap[item.mnuid];
              const isInCart = cartItems.some(
                (i) => (i.cartKey || i.mnuid) === item.mnuid
              );

              return (
                <div key={item.mnuid} className="bg-white rounded-xl shadow">
                  <Image
                    src={getImage(item)}
                    width={300}
                    height={200}
                    alt={item.name}
                    className="w-full h-40 object-cover rounded-t-xl"
                  />
                  <div className="p-3">
                    <h3 className="font-semibold">{item.name}</h3>
                    <p className="text-sm text-gray-500">
                      ₹{(item.price * EURO_TO_INR).toFixed(0)}
                    </p>
                    {!isInCart ? (
                      configurableHeads.has(item.menu_head) ? (
                        <button
                          onClick={() => setConfigureItem(item)}
                          className="bg-purple-600 text-white px-3 py-1 rounded mt-2 text-sm w-full"
                        >
                          Configure
                        </button>
                      ) : (
                        <button
                          onClick={() => handleAdd(item)}
                          className="bg-purple-600 text-white px-3 py-1 rounded mt-2 text-sm"
                        >
                          {t("Add") || "Add"}
                        </button>
                      )
                    ) : (
                      <div className="flex gap-2 mt-2">
                        <button onClick={() => handleDecrease(item.mnuid)}>-</button>
                        <span>{cartItem?.qty}</span>
                        <button onClick={() => handleIncrease(item.mnuid)}>+</button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Mobile list */}
          <div className="flex lg:hidden flex-col gap-3 pb-28">

            {selectedCategory?.category_products?.map((item) => {
              const cartItem = cartMap[item.mnuid];
              const isInCart = cartItems.some(
                (i) => (i.cartKey || i.mnuid) === item.mnuid
              );

              return (
                <div
                  key={item.mnuid}
                  className="bg-[#e6d6f0] rounded-xl p-4 mx-1 flex gap-3"
                >
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="font-semibold text-[#1a3a1a] text-sm leading-snug">
                        {item.name}
                      </h3>
                      {item.description && (
                        <p className="text-xs text-[#3a5a3a] mt-1 leading-snug line-clamp-3">
                          {item.description}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-2 mt-3">
                      <span className="text-[#1a3a1a] font-bold text-sm">
                        ₹{(item.price * EURO_TO_INR).toFixed(0)}
                      </span>

                      <button className="w-6 h-6 rounded-full bg-white border border-gray-300 text-[#3a7a3a] text-xs font-bold flex items-center justify-center flex-shrink-0">
                        i
                      </button>

                      {!isInCart ? (
                        configurableHeads.has(item.menu_head) ? (
                          <button
                            onClick={() => setConfigureItem(item)}
                            className="w-6 h-6 rounded-full bg-[#5b3fa0] text-white text-lg leading-none flex items-center justify-center flex-shrink-0"
                          >
                            +
                          </button>
                        ) : (
                          <button
                            onClick={() => handleAdd(item)}
                            className="w-6 h-6 rounded-full bg-[#5b3fa0] text-white text-lg leading-none flex items-center justify-center flex-shrink-0"
                          >
                            +
                          </button>
                        )
                      ) : (
                        <div className="flex items-center gap-1 bg-[#5b3fa0] text-white rounded-full px-2 py-0.5">
                          <button
                            onClick={() => handleDecrease(item.mnuid)}
                            className="text-white text-base leading-none px-0.5"
                          >
                            −
                          </button>
                          <span className="text-xs font-semibold min-w-[14px] text-center">
                            {cartItem?.qty}
                          </span>
                          <button
                            onClick={() => handleIncrease(item.mnuid)}
                            className="text-white text-base leading-none px-0.5"
                          >
                            +
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="w-24 h-24 rounded-xl overflow-hidden flex-shrink-0 self-center">
                    <Image
                      src={getImage(item)}
                      width={96}
                      height={96}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              );
            })}

            {/* ===== MOBILE ORDER SUMMARY — scroll target ===== */}
          <hr className="mt-5 " />
            {cartItems.length > 0 && (
              <div
                ref={mobileOrderSummaryRef}
                className="bg-[#ece9ee] rounded-xl shadow-md mx-1 mt-4 p-4"
              >
                <h2 className="font-bold text-base text-gray-800 mb-3">
                  {t("Order Summary") || "Order Summary"}
                </h2>

                {cartItems.map((item) => {
                  const itemTotal = item.price * item.qty * EURO_TO_INR;
                  const cartKey = item.cartKey || item.mnuid;

                  return (
                    <div
                      key={cartKey}
                      className="flex items-center gap-3 mb-3 pb-3 border-b border-gray-100 last:border-b-0"
                    >
                      <Image
                        src={getImage(item)}
                        width={52}
                        height={52}
                        alt={item.name}
                        className="rounded-lg object-cover flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start gap-1">
                          <p className="text-sm font-semibold text-gray-800 leading-snug truncate">
                            {item.name}
                          </p>
                          <button
                            onClick={() => handleRemove(cartKey)}
                            className="text-red-400 flex-shrink-0"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>

                        {item.addons?.length > 0 && (
                          <div className="mt-0.5">
                            {item.addons.map((addon, i) => (
                              <p key={i} className="text-xs text-gray-400">
                                + {addon.name}
                                {addon.price > 0
                                  ? ` (+₹${(addon.price * EURO_TO_INR).toFixed(0)})`
                                  : " (free)"}
                              </p>
                            ))}
                          </div>
                        )}

                        <div className="flex items-center justify-between mt-1.5">
                          <p className="text-xs text-gray-500">₹{itemTotal.toFixed(0)}</p>
                          <div className="flex items-center gap-1 bg-[#5b3fa0] text-white rounded-full px-2 py-0.5">
                            <button
                              onClick={() => handleDecrease(cartKey)}
                              className="text-white text-base leading-none px-0.5"
                            >
                              −
                            </button>
                            <span className="text-xs font-semibold min-w-[14px] text-center">
                              {item.qty}
                            </span>
                            <button
                              onClick={() => handleIncrease(cartKey)}
                              className="text-white text-base leading-none px-0.5"
                            >
                              +
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}

                {/* Bill breakdown */}
                <div className="text-sm space-y-2 mt-3 pt-3 border-t border-gray-100 text-gray-700">
                  <div className="flex justify-between">
                    <span>{t("Sub Total")}</span>
                    <span>₹{subtotal.toFixed(0)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{t("GST (5%)")}</span>
                    <span>₹{gst.toFixed(0)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-gray-900 pt-2 border-t border-gray-200">
                    <span>{t("Total")}</span>
                    <span>₹{total.toFixed(0)}</span>
                  </div>
                </div>

                <button
                  onClick={() => router.push("/checkout")}
                  className="w-full bg-green-500 text-white py-2.5 rounded-xl mt-4 font-semibold text-sm"
                >
                  {t("Checkout") || "Checkout"}
                </button>
              </div>
            )}

          </div>
        </div>
      </div>

      {/* ================= MOBILE STICKY CART BAR ================= */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50">

        {/* Up arrow — scrolls page to TOP */}
        <div className="flex justify-end px-4 mb-1">
          <button
            onClick={handleScrollTop}
            className="w-10 h-10 rounded-full bg-[#5b3fa0] text-white flex items-center justify-center shadow-lg"
          >
            <ChevronUp size={20} className="transition-transform duration-300" />
          </button>
        </div>

        {/* Green cart bar */}
        <div className="bg-green-500 text-white px-5 py-3 flex justify-between items-center shadow-lg">
          <span className="text-sm font-medium">
            {cartItems.reduce((s, i) => s + i.qty, 0)}{" "}
            {t("items added") || "items added"}
          </span>

          {/* Clicking price scrolls to mobile order summary */}
          <button
            onClick={handlePriceClick}
            className="font-bold text-base active:opacity-70 transition-opacity"
          >
            ₹{total.toFixed(0)}
          </button>
        </div>
      </div>

      {/* ================= CONFIGURE MODAL ================= */}
      {configureItem && (
        <ConfigureModal
          item={configureItem}
          restaurantId={restaurantInfo?.id || "20"}
          onClose={() => setConfigureItem(null)}
          onAddToCart={handleConfiguredAdd}
        />
      )}

    </div>
  );
}