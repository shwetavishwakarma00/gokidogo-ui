"use client";

import {
  useEffect,
  useState,
  useRef,
  useMemo,
  useCallback,
} from "react";

import { useDispatch, useSelector } from "react-redux";
import { fetchRestaurantMenu } from "../redux/features/restaurantSlice";
import {
  addToCart,
  increaseQty,
  decreaseQty,
  removeFromCart,
} from "@/app/redux/features/cartSlice";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { useTranslation } from "react-i18next";

const EURO_TO_INR = 90;

export default function RestaurantMenu() {
  const { t } = useTranslation();

  const dispatch = useDispatch();
  const router = useRouter();

  const { restaurantInfo, categories, loading } =
    useSelector((state) => state.restaurant);

  const user = useSelector((state) => state.auth.user);
  const userId = user?.customerId || "guest_user";

  const cartItems = useSelector(
    (state) => state.cart.carts?.[userId] ?? []
  );

  const [activeCategory, setActiveCategory] = useState(null);
  const [isSticky, setIsSticky] = useState(false);
  const sentinelRef = useRef(null);

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
    () =>
      categories?.find(
        (cat) => cat.category_id === derivedActiveCategory
      ),
    [categories, derivedActiveCategory]
  );

  /* ================= CART MAP ================= */
  const cartMap = useMemo(() => {
    const map = {};
    cartItems.forEach((i) => {
      map[i.mnuid] = i;
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

    return {
      subtotal,
      gst,
      total: subtotal + gst,
    };
  }, [cartItems]);

  /* ================= HANDLERS ================= */
  const handleAdd = useCallback(
  (item) => dispatch(addToCart({ userId, item })),
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

      {/* ================= HERO (1ST CODE STYLE PRESERVED) ================= */}
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
              🛵 {t("Fast delivery · Fresh food · Best prices") || "Fast delivery · Fresh food · Best prices"}
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
      {/* <div className={`bg-white border-b z-40 ${isSticky ? "sticky top-0 shadow-md" : ""}`}>
        <div className="max-w-6xl mx-auto px-6 py-3 flex gap-2 overflow-auto">

          {categories?.map((cat) => (
            <button
              key={cat.category_id}
              onClick={() => setActiveCategory(cat.category_id)}
              className={`px-4 py-2 rounded-full text-sm ${
                derivedActiveCategory === cat.category_id
                  ? "bg-purple-600 text-white"
                  : "bg-gray-100"
              }`}
            >
              {cat.category}
            </button>
          ))}

        </div>
      </div> */}

      <div className={`bg-white border-b z-40 ${isSticky ? "sticky top-0 shadow-sm" : ""}`}>
  <div className="max-w-6xl mx-auto px-6 py-3 flex gap-3 overflow-x-auto hide-scrollbar scroll-smooth">
    {categories?.map((cat) => (
      <button
        key={cat.category_id}
        onClick={() => setActiveCategory(cat.category_id)}
        className={`px-4 py-2 rounded-full text-sm whitespace-nowrap transition-all duration-200
        ${
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
      <div className="max-w-6xl mx-auto px-6 py-10 grid grid-cols-1 lg:grid-cols-4 gap-6">

        {/* ================= ORDER SUMMARY ================= */}
        <div className="lg:col-span-1 order-2 lg:order-1">
          <div className="bg-white rounded-xl shadow p-4 sticky top-24">

            <h2 className="font-bold text-lg mb-4">
              {t("Order Summary") || "Order Summary"}
            </h2>

            {cartItems.map((item) => {
              const itemTotal =
                item.price * item.qty * EURO_TO_INR;

              return (
                <div
                  key={item.mnuid}
                  className="flex gap-3 mb-4 border-b pb-3"
                >

                  <Image
                    src={getImage(item)}
                    width={60}
                    height={60}
                    alt={item.name}
                    className="rounded-lg object-cover"
                  />

                  <div className="flex-1">

                    <div className="flex justify-between items-center">
                      <p className="text-sm font-semibold">
                        {item.name}
                      </p>

                      <button
                        onClick={() => handleRemove(item.mnuid)}
                        className="text-red-500"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>

                    <p className="text-xs text-gray-500">
                      ₹{itemTotal.toFixed(0)}
                    </p>

                    <div className="flex gap-2 mt-1">
                      <button onClick={() => handleDecrease(item.mnuid)}>-</button>
                      <span>{item.qty}</span>
                      <button onClick={() => handleIncrease(item.mnuid)}>+</button>
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

        {/* ================= MENU ================= */}
        <div className="lg:col-span-3 order-1 lg:order-2">

          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-5">

            {selectedCategory?.category_products?.map((item) => {
              const cartItem = cartMap[item.mnuid];

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

                    {!cartItem ? (
                      <button
                        onClick={() => handleAdd(item)}
                        className="bg-purple-600 text-white px-3 py-1 rounded mt-2"
                      >
                        {t("Add") || "Add"}
                      </button>
                    ) : (
                      <div className="flex gap-2 mt-2">
                        <button onClick={() => handleDecrease(item.mnuid)}>-</button>
                        <span>{cartItem.qty}</span>
                        <button onClick={() => handleIncrease(item.mnuid)}>+</button>
                      </div>
                    )}

                  </div>

                </div>
              );
            })}

          </div>

        </div>

      </div>
    </div>
  );
}