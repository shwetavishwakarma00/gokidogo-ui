"use client";

import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchRestaurant } from "@/app/redux/features/restaurantSlice";
import {
  addToCart,
  increaseQty,
  decreaseQty,
  removeFromCart,
} from "@/app/redux/features/cartSlice";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react"; // ✅ delete icon

export default function RestaurantMenu() {
  const dispatch = useDispatch();
  const router = useRouter();

  const { restaurantInfo, categories, loading } =
    useSelector((state) => state.restaurant);

  const user = useSelector((state) => state.auth.user);
  const userId = user?.customerId;

  const cartItems = useSelector(
    (state) => state.cart.carts[userId] || []
  );

  const [activeCategory, setActiveCategory] = useState(null);
  const [isSticky, setIsSticky] = useState(false);
  const sentinelRef = useRef(null);

  const EURO_TO_INR = 90;

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
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );

  const selectedCategory = categories?.find(
    (cat) => cat.category_id === activeCategory
  );

  const getImage = (item) => {
    if (item?.image && item?.sku) {
      return `${item.image}${item.sku}.jpg`;
    }
    return "/fallback.jpg";
  };

  const subtotal = cartItems.reduce(
    (sum, i) => sum + i.price * i.qty * EURO_TO_INR,
    0
  );

  const gst = subtotal * 0.05;
  const total = subtotal + gst;

  return (
    <div className="min-h-screen bg-[#f4f4f8] text-gray-800">

      {/* HERO */}
      <div className="relative bg-gradient-to-br from-[#5b3fa0] via-[#6b47b8] to-[#7c5dc9] overflow-hidden">

        <div className="absolute top-[-60px] right-[-60px] w-72 h-72 rounded-full bg-white/5" />
        <div className="absolute bottom-[-40px] left-[-40px] w-56 h-56 rounded-full bg-white/5" />

        <div className="max-w-6xl mx-auto px-6 py-14 md:py-20 flex flex-col md:flex-row items-center gap-10">

          <div className="flex-1 text-white">
            <p className="text-green-300 text-xs font-semibold uppercase mb-3">
              ✦ Now Open
            </p>

            <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
              {restaurantInfo?.name}
            </h1>

            <div className="text-white/70 text-sm mb-6">
              📍 {restaurantInfo?.address}
            </div>

            <div className="bg-white/10 border border-white/20 rounded-xl px-5 py-3 text-sm backdrop-blur-sm">
              🛵 Fast delivery · Fresh food · Best prices
            </div>
          </div>

          <div className="w-full md:w-[380px] h-[240px] rounded-2xl overflow-hidden shadow-xl">
            <Image
              src="/image/biryani.jpg"
              width={400}
              height={200}
              alt="food"
              className="w-full h-full object-cover"
            />
          </div>

        </div>

        <div className="h-10">
          <svg viewBox="0 0 1200 40" className="w-full h-10 fill-[#f4f4f8]">
            <path d="M0,20 C300,40 900,0 1200,20 L1200,40 L0,40 Z" />
          </svg>
        </div>
      </div>

      <div ref={sentinelRef} />

      {/* CATEGORY */}
      <div
        className={`bg-white border-b z-40 ${
          isSticky ? "sticky top-0 shadow-md" : ""
        }`}
      >
        <div className="max-w-6xl mx-auto px-6 py-3 flex gap-2 overflow-auto">
          {categories?.map((cat) => (
            <button
              key={cat.category_id}
              onClick={() => setActiveCategory(cat.category_id)}
              className={`px-4 py-2 rounded-full text-sm ${
                activeCategory === cat.category_id
                  ? "bg-purple-600 text-white"
                  : "bg-gray-100"
              }`}
            >
              {cat.category}
            </button>
          ))}
        </div>
      </div>

      {/* MAIN */}
      <div className="max-w-6xl mx-auto px-6 py-10 grid grid-cols-1 lg:grid-cols-4 gap-6">

        {/* ✅ ORDER SUMMARY LEFT */}
        <div className="lg:col-span-1 order-2 lg:order-1">

          <div className="bg-white rounded-xl shadow p-4 sticky top-24">

            <h2 className="font-bold text-lg mb-4">
              Order Summary
            </h2>

            {cartItems.map((item) => {
              const itemTotal =
                item.price * item.qty * EURO_TO_INR;

              return (
                <div
                  key={item.mnuid}
                  className="flex gap-3 mb-4 border-b pb-3"
                >

                  {/* ✅ IMAGE */}
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

                      {/* ✅ DELETE ICON */}
                      <button
                        onClick={() =>
                          dispatch(
                            removeFromCart({
                              userId,
                              id: item.mnuid,
                            })
                          )
                        }
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>

                    <p className="text-xs text-gray-500">
                      ₹{itemTotal.toFixed(0)}
                    </p>

                    {/* QTY */}
                    <div className="flex gap-2 mt-1">
                      <button
                        onClick={() =>
                          dispatch(
                            decreaseQty({
                              userId,
                              id: item.mnuid,
                            })
                          )
                        }
                        className="border w-6 h-6"
                      >
                        -
                      </button>

                      <span>{item.qty}</span>

                      <button
                        onClick={() =>
                          dispatch(
                            increaseQty({
                              userId,
                              id: item.mnuid,
                            })
                          )
                        }
                        className="border w-6 h-6"
                      >
                        +
                      </button>
                    </div>

                  </div>
                </div>
              );
            })}

            {cartItems.length > 0 && (
              <>
                <div className="text-sm space-y-2 mt-3">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>₹{subtotal.toFixed(0)}</span>
                  </div>

                  <div className="flex justify-between">
                    <span>GST</span>
                    <span>₹{gst.toFixed(0)}</span>
                  </div>

                  <div className="flex justify-between font-bold">
                    <span>Total</span>
                    <span>₹{total.toFixed(0)}</span>
                  </div>
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

        {/* MENU RIGHT */}
        <div className="lg:col-span-3 order-1 lg:order-2">

          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-5">
            {selectedCategory?.category_products?.map((item) => {

              const cartItem = cartItems.find(
                (i) => i.mnuid === item.mnuid
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

                    {!cartItem ? (
                      <button
                        onClick={() =>
                          dispatch(addToCart({ userId, item }))
                        }
                        className="bg-purple-600 text-white px-3 py-1 rounded mt-2"
                      >
                        Add
                      </button>
                    ) : (
                      <div className="flex gap-2 mt-2">
                        <button
                          onClick={() =>
                            dispatch(
                              decreaseQty({ userId, id: item.mnuid })
                            )
                          }
                          className="border w-6 h-6"
                        >
                          -
                        </button>

                        <span>{cartItem.qty}</span>

                        <button
                          onClick={() =>
                            dispatch(
                              increaseQty({ userId, id: item.mnuid })
                            )
                          }
                          className="border w-6 h-6"
                        >
                          +
                        </button>
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