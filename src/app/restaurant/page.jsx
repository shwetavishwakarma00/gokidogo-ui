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
import { Trash2, ChevronUp, Calendar, MapPin, ShoppingBag, Users, CircleHelp } from "lucide-react";
import { useTranslation } from "../../hooks/useTranslation";
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

  // ── UI-only: Order Overview form state ──
  const todayStr = new Date().toISOString().split("T")[0];
  const [deliveryDate, setDeliveryDate] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [portionQty, setPortionQty] = useState(15);
  const [numPeople, setNumPeople] = useState(15);

  const sentinelRef = useRef(null);
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
const { subtotal, total } = useMemo(() => {
  const subtotal = cartItems.reduce(
    (sum, i) => sum + Number(i.price || 0) * Number(i.qty || 1),
    0
  );

  return { subtotal, total: subtotal };
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

  const handleScrollTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

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
    if (item?.image) return `/Image/${item.image}`;
    return "/Image/fallback.jpg";
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        {t("menu.loading") || "Loading..."}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f6f4fb] text-gray-800">

      {/* ── Sentinel ── */}
      <div ref={sentinelRef} className="h-px" />

      {/* ================= CATEGORY BAR ================= */}
      <div className={`bg-white border-b z-40 ${isSticky ? "sticky top-0 shadow-sm" : ""}`}>
        <div className="max-w-6xl mx-auto px-6 py-3 flex gap-3 overflow-x-auto hide-scrollbar scroll-smooth">
          {categories?.map((cat) => (
            <button
              key={cat.category_id}
              onClick={() => setActiveCategory(cat.category_id)}
              className={`px-4 py-2 rounded-full text-sm whitespace-nowrap transition-all duration-200 font-medium ${
                derivedActiveCategory === cat.category_id
                  ? "bg-[#5A35B5] text-white shadow"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {cat.category}
            </button>
          ))}
        </div>
      </div>

      {/* ================= MAIN ================= */}
      <div className="max-w-6xl mx-auto px-4 md:px-6 py-6 flex flex-col lg:flex-row gap-6">

        {/* ════════════════════════════════════════
            LEFT — Menu Items
        ════════════════════════════════════════ */}
        <div className="flex-1 min-w-0">

          {/* Category heading */}
          <h2 className="text-lg font-bold text-gray-900 mb-4">
            {selectedCategory?.category || ""}
          </h2>

          {/* ── Desktop list (matches screenshot layout) ── */}
          <div className="hidden lg:flex flex-col gap-3">
            {selectedCategory?.category_products?.map((item) => {
              const cartItem = cartMap[item.mnuid];
              const isInCart = cartItems.some(
                (i) => (i.cartKey || i.mnuid) === item.mnuid
              );

              return (
                <div
                  key={item.mnuid}
                  className="bg-white rounded-xl shadow-sm border border-gray-100 flex gap-4 p-4 items-start"
                >
                  {/* Image */}
                  <div className="w-28 h-24 rounded-xl overflow-hidden flex-shrink-0">
                    <Image
                      src={getImage(item)}
                      width={112}
                      height={96}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 text-sm">{item.name}</h3>
                    {item.description && (
                      <p className="text-xs text-gray-500 mt-1 leading-snug line-clamp-2">
                        {item.description}
                      </p>
                    )}
                    {item.serving && (
                      <p className="text-xs text-gray-400 mt-1">{item.serving}</p>
                    )}
                    <p className="text-sm font-bold text-[#5A35B5] mt-2">
    €{Number(item.price).toFixed(2)}
  </p>
                  </div>

                  {/* Add / qty — same logic, new look */}
                  <div className="flex-shrink-0 self-center">
                    {!isInCart ? (
                      configurableHeads.has(item.menu_head) ? (
                        <button
                          onClick={() => setConfigureItem(item)}
                          className="w-7 h-7 rounded-full bg-[#5A35B5] text-white text-xl leading-none flex items-center justify-center"
                        >
                          +
                        </button>
                      ) : (
                        <button
                          onClick={() => handleAdd(item)}
                          className="w-7 h-7 rounded-full bg-[#5A35B5] text-white text-xl leading-none flex items-center justify-center"
                        >
                          +
                        </button>
                      )
                    ) : (
                      <div className="flex items-center gap-1 bg-[#5A35B5] text-white rounded-full px-2 py-1">
                        <button onClick={() => handleDecrease(item.mnuid)} className="text-base leading-none px-0.5">−</button>
                        <span className="text-xs font-semibold min-w-[14px] text-center">{cartItem?.qty}</span>
                        <button onClick={() => handleIncrease(item.mnuid)} className="text-base leading-none px-0.5">+</button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* ── Mobile list (original style kept) ── */}
          <div className="flex lg:hidden flex-col gap-3 pb-28">
            {selectedCategory?.category_products?.map((item) => {
              const cartItem = cartMap[item.mnuid];
              const isInCart = cartItems.some(
                (i) => (i.cartKey || i.mnuid) === item.mnuid
              );

              return (
                <div key={item.mnuid} className="bg-[#e6d6f0] rounded-xl p-4 mx-1 flex gap-3">
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="font-semibold text-[#1a3a1a] text-sm leading-snug">{item.name}</h3>
                      {item.description && (
                        <p className="text-xs text-[#3a5a3a] mt-1 leading-snug line-clamp-3">{item.description}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mt-3">
                      <span className="text-[#1a3a1a] font-bold text-sm">
                        €{Number(item.price).toFixed(0)}
                      </span>
                      <button className="w-6 h-6 rounded-full bg-white border border-gray-300 text-[#3a7a3a] text-xs font-bold flex items-center justify-center flex-shrink-0">
                        i
                      </button>
                      {!isInCart ? (
                        configurableHeads.has(item.menu_head) ? (
                          <button
                            onClick={() => setConfigureItem(item)}
                            className="w-6 h-6 rounded-full bg-[#5A35B5] text-white text-lg leading-none flex items-center justify-center flex-shrink-0"
                          >+</button>
                        ) : (
                          <button
                            onClick={() => handleAdd(item)}
                            className="w-6 h-6 rounded-full bg-[#5A35B5] text-white text-lg leading-none flex items-center justify-center flex-shrink-0"
                          >+</button>
                        )
                      ) : (
                        <div className="flex items-center gap-1 bg-[#5A35B5] text-white rounded-full px-2 py-0.5">
                          <button onClick={() => handleDecrease(item.mnuid)} className="text-white text-base leading-none px-0.5">−</button>
                          <span className="text-xs font-semibold min-w-[14px] text-center">{cartItem?.qty}</span>
                          <button onClick={() => handleIncrease(item.mnuid)} className="text-white text-base leading-none px-0.5">+</button>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="w-24 h-24 rounded-xl overflow-hidden flex-shrink-0 self-center">
                    <Image src={getImage(item)} width={96} height={96} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                </div>
              );
            })}

            {/* ── Mobile Order Summary ── */}
            <hr className="mt-5" />
            {cartItems.length > 0 && (
              <div ref={mobileOrderSummaryRef} className="bg-[#ece9ee] rounded-xl shadow-md mx-1 mt-4 p-4">
                <h2 className="font-bold text-base text-gray-800 mb-3">
                  {t("menu.orderOverview") || "Order Overview"}
                </h2>
                {cartItems.map((item) => {
                  const itemTotal = Number(item.price) * Number(item.qty);
                  const cartKey = item.cartKey || item.mnuid;
                  return (
                    <div key={cartKey} className="flex items-center gap-3 mb-3 pb-3 border-b border-gray-100 last:border-b-0">
                      <Image src={getImage(item)} width={52} height={52} alt={item.name} className="rounded-lg object-cover flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start gap-1">
                          <p className="text-sm font-semibold text-gray-800 leading-snug truncate">{item.name}</p>
                          <button onClick={() => handleRemove(cartKey)} className="text-red-400 flex-shrink-0"><Trash2 size={14} /></button>
                        </div>
                        {item.addons?.length > 0 && item.addons.map((addon, i) => (
                          <p key={i} className="text-xs text-gray-400">
                            + {addon.name}{addon.price > 0 ? ` (+€${Number(addon.price).toFixed(0)})` : " (free)"}
                          </p>
                        ))}
                        <div className="flex items-center justify-between mt-1.5">
                          <p className="text-xs text-gray-500">€{itemTotal.toFixed(0)}</p>
                          <div className="flex items-center gap-1 bg-[#5A35B5] text-white rounded-full px-2 py-0.5">
                            <button onClick={() => handleDecrease(cartKey)} className="text-white text-base leading-none px-0.5">−</button>
                            <span className="text-xs font-semibold min-w-[14px] text-center">{item.qty}</span>
                            <button onClick={() => handleIncrease(cartKey)} className="text-white text-base leading-none px-0.5">+</button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
                <div className="text-sm space-y-2 mt-3 pt-3 border-t border-gray-100 text-gray-700">
                  <div className="flex justify-between"><span>{t("menu.subTotal") || "Sub Total"}</span><span>€{subtotal.toFixed(0)}</span></div>
                  <div className="flex justify-between font-bold text-gray-900 pt-2 border-t border-gray-200">
                    <span>{t("menu.total") || "Total"}</span>
  <span>€{total.toFixed(2)}</span>
                  </div>
                </div>
                <button
                  onClick={() => router.push("/checkout")}
                  className="w-full bg-[#5A35B5] hover:bg-[#7e5dd1] text-white py-2.5 rounded-xl mt-4 font-semibold text-sm transition-colors"
                >
                  {t("menu.checkout") || "Checkout"}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* ════════════════════════════════════════
            RIGHT — Order Overview panel (desktop only)
        ════════════════════════════════════════ */}
        <div className="hidden lg:block w-80 flex-shrink-0">
          <div className="bg-white rounded-2xl shadow-sm p-5 sticky top-20">

            <h2 className="text-lg font-bold text-gray-900 mb-4">
              {t("menu.orderOverview") || "Order Overview"}
            </h2>

            {/* Row 1: Delivery Date + Postal Code */}
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div>
                <label className="text-xs font-semibold text-gray-600 mb-1 block">
                  {t("menu.deliveryDate") || "Delivery Date"} <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Calendar className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#5A35B5]" />
                  <input
                    type="date"
                    min={todayStr}
                    value={deliveryDate}
                    onChange={(e) => setDeliveryDate(e.target.value)}
                    className="w-full pl-8 pr-2 py-2.5 border border-gray-200 rounded-lg text-xs text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#5A35B5]/30 focus:border-[#5A35B5] bg-white"
                  />
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-600 mb-1 block">
                  {t("menu.postalCode") || "Postal Code"} <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <MapPin className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#5A35B5]" />
                  <input
                    type="text"
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                    className="w-full pl-8 pr-2 py-2.5 border border-gray-200 rounded-lg text-xs text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#5A35B5]/30 focus:border-[#5A35B5] bg-white"
                    placeholder={t("menu.postalCode") || "Postal Code"}
                  />
                </div>
              </div>
            </div>

            {/* Row 2: Portion Qty + Number of People */}
            <div className="grid grid-cols-2 gap-3 mb-5">
              <div>
                <label className="text-xs font-semibold text-gray-600 mb-1 block">
                  {t("menu.menuPortionQty") || "Menu Portion Qty"} <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <ShoppingBag className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#5A35B5]" />
                  <input
                    type="number"
                    min={15}
                    value={portionQty}
                    onChange={(e) => setPortionQty(Number(e.target.value))}
                    className="w-full pl-8 pr-2 py-2.5 border border-gray-200 rounded-lg text-xs text-gray-700 font-semibold focus:outline-none focus:ring-2 focus:ring-[#5A35B5]/30 focus:border-[#5A35B5] bg-white"
                  />
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-600 mb-1 block">
                  {t("menu.numberOfPeople") || "Number of People"} <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Users className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#5A35B5]" />
                  <input
                    type="number"
                    min={15}
                    value={numPeople}
                    onChange={(e) => setNumPeople(Number(e.target.value))}
                    className="w-full pl-8 pr-2 py-2.5 border border-gray-200 rounded-lg text-xs text-gray-700 font-semibold focus:outline-none focus:ring-2 focus:ring-[#5A35B5]/30 focus:border-[#5A35B5] bg-white"
                  />
                </div>
              </div>
            </div>

            {/* Cart items list inside order panel */}
            {cartItems.map((item) => {
              const itemTotal = item.price * item.qty;
              const cartKey = item.cartKey || item.mnuid;
              return (
                <div key={cartKey} className="flex gap-3 mb-4 border-b pb-3">
                  <Image src={getImage(item)} width={52} height={52} alt={item.name} className="rounded-lg object-cover flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center">
                      <p className="text-xs font-semibold truncate">{item.name}</p>
                      <button onClick={() => handleRemove(cartKey)} className="text-red-400 flex-shrink-0 ml-1">
                        <Trash2 size={13} />
                      </button>
                    </div>
                    {item.addons?.length > 0 && item.addons.map((addon, i) => (
                      <p key={i} className="text-xs text-gray-400">
                        + {addon.name}{addon.price > 0 ? ` (+€${(addon.price * EURO_TO_INR).toFixed(0)})` : " (free)"}
                      </p>
                    ))}
                    <p className="text-xs text-gray-500 mt-0.5">€{itemTotal.toFixed(0)}</p>
                    <div className="flex items-center gap-1 mt-1 bg-[#5A35B5] text-white rounded-full px-2 py-0.5 w-fit">
                      <button onClick={() => handleDecrease(cartKey)} className="text-base leading-none px-0.5">−</button>
                      <span className="text-xs font-semibold min-w-[14px] text-center">{item.qty}</span>
                      <button onClick={() => handleIncrease(cartKey)} className="text-base leading-none px-0.5">+</button>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Bill breakdown */}
            <div className="text-sm space-y-2 pt-2 border-t border-gray-100 text-gray-700">
              <div className="flex justify-between">
                <span>{t("menu.subTotal") || "Sub Total"}</span>
                <span>€{subtotal.toFixed(0)}</span>
              </div>
             
              <div className="flex justify-between font-bold text-gray-900 pt-2 border-t border-gray-200">
                <span>{t("menu.total") || "Total"}</span>
                <span>€{total.toFixed(0)}</span>
              </div>
            </div>

            {/* Dishes selected status */}
            <div className="mt-4 bg-[#fff5f2] rounded-lg py-2 px-3 text-center">
              <p className="text-[#E8533A] text-xs font-semibold">
                {cartItems.length} {t("menu.outOf") || "out of"} 4 {t("menu.dishesSelected") || "dishes selected."}
              </p>
            </div>

            {/* Next button */}
            <button
              onClick={() => router.push("/checkout")}
              className="w-full mt-3 bg-[#5A35B5] hover:bg-[#7e5dd1] text-white font-semibold py-3 rounded-xl transition-colors duration-200 text-sm"
            >
              {t("menu.next") || "Next"}
            </button>
          </div>
        </div>
      </div>

      {/* ================= MOBILE STICKY CART BAR ================= */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50">
        <div className="flex justify-end px-4 mb-1">
          <button
            onClick={handleScrollTop}
            className="w-10 h-10 rounded-full bg-[#5A35B5] text-white flex items-center justify-center shadow-lg"
          >
            <ChevronUp size={20} className="transition-transform duration-300" />
          </button>
        </div>
        <div className="bg-[#5A35B5] text-white px-5 py-3 flex justify-between items-center shadow-lg">
          <span className="text-sm font-medium">
            {cartItems.reduce((s, i) => s + i.qty, 0)}{" "}
            {t("menu.itemsAdded") || "items added"}
          </span>
          <button
            onClick={handlePriceClick}
            className="font-bold text-base active:opacity-70 transition-opacity"
          >
            €{total.toFixed(0)}
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