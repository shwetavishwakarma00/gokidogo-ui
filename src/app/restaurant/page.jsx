"use client";

import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchRestaurant } from "@/app/redux/features/restaurantSlice";
import { addToCart, increaseQty, decreaseQty } from "@/app/redux/features/cartSlice";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function RestaurantMenu() {
  const dispatch = useDispatch();
  const router = useRouter();

  const { restaurantInfo, categories, deliveryHours, zipcodes, loading } =
    useSelector((state) => state.restaurant);

  const user = useSelector((state) => state.auth.user);
  const userId = user?.customerId;

  const cartItems = useSelector(
    (state) => state.cart.carts[userId] || []
  );

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

  const total = cartItems.reduce(
    (sum, i) => sum + i.price * i.qty,
    0
  );

  return (
    <div className="min-h-screen bg-[#f4f4f8] text-gray-800 font-sans">

      {/* ── HERO (UNCHANGED) ── */}
      <div className="relative bg-gradient-to-br from-[#5b3fa0] via-[#6b47b8] to-[#7c5dc9] overflow-hidden">
        <div className="absolute top-[-60px] right-[-60px] w-72 h-72 rounded-full bg-white/5 pointer-events-none" />
        <div className="absolute bottom-[-40px] left-[-40px] w-56 h-56 rounded-full bg-white/5 pointer-events-none" />

        <div className="max-w-6xl mx-auto px-6 py-14 md:py-20 flex flex-col md:flex-row items-center gap-10">

          <div className="flex-1 text-white">
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

        <div className="relative h-10 overflow-hidden">
          <svg viewBox="0 0 1200 40" preserveAspectRatio="none" className="absolute bottom-0 w-full h-10 fill-[#f4f4f8]">
            <path d="M0,20 C300,40 900,0 1200,20 L1200,40 L0,40 Z" />
          </svg>
        </div>
      </div>

      {/* Sentinel */}
      <div ref={sentinelRef} className="h-0" />

      {/* ── CATEGORY SCROLLER (UNCHANGED) ── */}
      <div
        className={`bg-white z-40 border-b border-purple-100 transition-all duration-300 ${
          isSticky ? "sticky top-[57px] shadow-md" : ""
        }`}
      >
        <div className="max-w-6xl mx-auto px-6 py-3 flex gap-2 overflow-x-auto scrollbar-hide">

          {categories?.map((cat) => (
            <button
              key={cat.category_id}
              onClick={() => setActiveCategory(cat.category_id)}
              className={`px-5 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all duration-200 border ${
                activeCategory === cat.category_id
                  ? "bg-[#6b47b8] text-white border-[#6b47b8]"
                  : "bg-white text-gray-500 border-gray-200"
              }`}
            >
              {cat.category}
            </button>
          ))}

        </div>
      </div>

      {/* ── MAIN GRID ── */}
      <div className="max-w-6xl mx-auto px-6 py-10 grid grid-cols-4 gap-8">

        {/* MENU */}
        <div className="col-span-3">

          {selectedCategory && (
            <div className="flex items-center gap-3 mb-8">
              <div className="w-1 h-7 bg-[#6b47b8] rounded-full" />
              <h2 className="text-xl font-bold text-gray-800">
                {selectedCategory.category}
              </h2>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">

            {selectedCategory?.category_products?.map((item) => {

              const imageUrl =
                item.image && item.sku
                  ? `${item.image}${item.sku}.jpg`
                  : "/food.jpg";

              const cartItem = cartItems.find(
                (i) => i.mnuid === item.mnuid
              );

              return (
                <div
                  key={item.mnuid}
                  className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100"
                >

                  <div className="relative h-44 overflow-hidden">

                    <Image
                      src={imageUrl}
                      width={400}
                      height={200}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />

                    <span className="absolute top-3 right-3 bg-[#3db56e] text-white font-bold text-sm px-3 py-1 rounded-full shadow-lg">
                      €{item.price}
                    </span>

                  </div>

                  <div className="p-4">

                    <h3 className="font-bold text-gray-800 text-base mb-1">
                      {item.name}
                    </h3>

                    {item.description && (
                      <p className="text-sm text-gray-400 mb-3 line-clamp-2">
                        {item.description}
                      </p>
                    )}

                    <div className="flex items-center justify-between mt-2">

                      <span />

                      {!cartItem ? (
                        <button
                          onClick={() =>
                            dispatch(
                              addToCart({
                                userId,
                                item
                              })
                            )
                          }
                          className="bg-[#6b47b8] hover:bg-[#5b3fa0] text-white text-xs font-semibold px-4 py-1.5 rounded-full"
                        >
                          + Add
                        </button>
                      ) : (
                        <div className="flex items-center gap-2">

                          <button
                            onClick={() =>
                              dispatch(
                                decreaseQty({
                                  userId,
                                  id: item.mnuid
                                })
                              )
                            }
                            className="w-6 h-6 border rounded"
                          >
                            -
                          </button>

                          <span>{cartItem.qty}</span>

                          <button
                            onClick={() =>
                              dispatch(
                                increaseQty({
                                  userId,
                                  id: item.mnuid
                                })
                              )
                            }
                            className="w-6 h-6 border rounded"
                          >
                            +
                          </button>

                        </div>
                      )}

                    </div>

                  </div>

                </div>
              );
            })}

          </div>

        </div>

        {/* CART SUMMARY */}
        <div className="col-span-1">

          <div className="bg-white rounded-xl shadow p-5 sticky top-24">

            <h2 className="font-bold text-lg mb-4">
              Order Summary
            </h2>

            {cartItems.length === 0 && (
              <p className="text-gray-400 text-sm">
                Cart Empty
              </p>
            )}

            {cartItems.map((item) => (
              <div
                key={item.mnuid}
                className="flex justify-between mb-3"
              >

                <div>
                  <p className="text-sm font-semibold">
                    {item.name}
                  </p>

                  <p className="text-xs text-gray-400">
                    €{item.price}
                  </p>
                </div>

                <div className="flex items-center gap-2">

                  <button
                    onClick={() =>
                      dispatch(
                        decreaseQty({
                          userId,
                          id: item.mnuid
                        })
                      )
                    }
                    className="border w-6 h-6 rounded"
                  >
                    -
                  </button>

                  <span>{item.qty}</span>

                  <button
                    onClick={() =>
                      dispatch(
                        increaseQty({
                          userId,
                          id: item.mnuid
                        })
                      )
                    }
                    className="border w-6 h-6 rounded"
                  >
                    +
                  </button>

                </div>

              </div>
            ))}

            {cartItems.length > 0 && (
              <>
                <div className="border-t pt-3 flex justify-between font-bold">
                  <span>Total</span>
                  <span>€{total.toFixed(2)}</span>
                </div>

                <button
                  onClick={() => router.push("/checkout")}
                  className="w-full bg-green-500 text-white py-2 rounded mt-4"
                >
                  Checkout
                </button>
              </>
            )}

          </div>

        </div>

      </div>

    </div>
  );
}