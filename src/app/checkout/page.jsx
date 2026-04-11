"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { checkoutThunk } from "@/app/redux/features/checkoutSlice";
import { clearCart } from "@/app/redux/features/cartSlice";
import { fetchProfileThunk } from "@/app/redux/features/authSlice";
import toast, { Toaster } from "react-hot-toast";

export default function CheckoutPage() {
  const dispatch = useDispatch();
  const router = useRouter();

  const userRedux = useSelector((state) => state.auth?.user);
  const profile = useSelector((state) => state.auth?.profile);
  const { loading, success } = useSelector((state) => state.checkout);

  const [user, setUser] = useState(null);
  const [paymentType, setPaymentType] = useState("cash");
  const [remark, setRemark] = useState("");

  const [form, setForm] = useState({
    salutation: "",
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    street: "",
    streetNo: "",
    houseNumber: "",
    floorNo: "",
    city: "Frankfurt",
    zip: "60311",
  });

  // ── Load user
  useEffect(() => {
    let u = userRedux;
    if (!u && typeof window !== "undefined") {
      const stored = localStorage.getItem("user");
      if (stored) u = JSON.parse(stored);
    }
    if (u) {
      setUser(u);
      dispatch(fetchProfileThunk({
        customer_ID: u.CustomerId,
        email: u.EmailAddress,
        apikey: u.apikey,
        deviceId: "web123",
      }));
    }
  }, [userRedux, dispatch]);

  // ── Auto-fill from profile
  useEffect(() => {
    if (profile) {
      const p = Array.isArray(profile) ? profile[0] : profile;
      setForm((prev) => ({
        ...prev,
        salutation: p?.title || "",
        firstName: p?.firstName || "",
        lastName: p?.lastName || "",
        phone: p?.mobile || "",
        email: user?.EmailAddress || "",
      }));
    }
  }, [profile, user]);

  const userId = user?.customerId;
  const cartItems = useSelector((state) => state.cart.carts[userId] || []);
  const { restaurantId } = useSelector((state) => state.restaurant);

  const subtotal = cartItems.reduce((sum, i) => sum + parseFloat(i.price) * i.qty, 0);
  const deliveryCharge = 0;
  const total = subtotal + deliveryCharge;

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleCheckout = async () => {
    if (!user) return toast.error("Please login first");
    if (cartItems.length === 0) return toast.error("Cart is empty!");

    if (!form.firstName || !form.phone || !form.street || !form.city) {
      return toast.error("Please fill all required fields");
    }

    const orderPayload = {
      Order: [
        {
          customer_ID: user.CustomerId,
          order_type: "Delivery",
          salutation: form.salutation,
          First_Name: form.firstName,
          Last_Name: form.lastName,
          Name: `${form.firstName} ${form.lastName}`,
          Phone: form.phone,
          email: form.email,
          street: form.street,
          street_no: form.streetNo,
          house_number: form.houseNumber,
          floor_no: form.floorNo,
          City: form.city,
          State: form.city,
          Location: form.city,
          delivery_area_ZIP: form.zip,
          remark: remark,
          payment_type: paymentType,
          time_rebate: "0",
          delivery_area_id: "2",
          min_order: "0",
          get_Free_From: "0",
          payment_price: "0",
          firm_name: "",
          net_amt: subtotal.toFixed(2),
          current_discount: "0",
          Delivery_time: new Date().toLocaleTimeString("de-DE", { hour: "2-digit", minute: "2-digit" }),
          discount: "0",
          promo_code: "",
          promoDiscount: "0",
          net_after_discount: subtotal.toFixed(2),
          vat_normal: "0.07",
          vat_007_after_dsicount: "0",
          vat_019_after_dsicount: "0",
          vat_total_after_dsicount: "0",
          tiffin_cost: "",
          total: total.toFixed(2),
          delivery_charge: deliveryCharge.toFixed(2),
          final_amount: total.toFixed(2),
          Restaurant: "1",
          Restaurant_location: "2",
          currency: "€",
          attendedBy: "",
          // DeviceId: user.CustomerId,
          DeviceId:"Device123",
          TipAmt: "0",
        },
      ],
      details: cartItems.map((item, index) => ({
        toppos: "0",
        is_addon: "0",
        id: String(index + 1),
        product_id: String(item.mnuid),
        sku: item.sku || "",
        name: item.name,
        short_name: item.name?.substring(0, 12) + " ...",
        price: String(item.price),
        count: String(item.qty),
        sum: (parseFloat(item.price) * item.qty).toFixed(2),
        pax: "",
      })),
    };

    const result = await dispatch(checkoutThunk(orderPayload));

    if (checkoutThunk.fulfilled.match(result)) {
      toast.success("Order placed successfully! 🎉");
      dispatch(clearCart(userId));
      setTimeout(() => router.push("/"), 1500);
    } else {
      toast.error("Order failed. Please try again ❌");
    }
  };

  return (
    <div className="min-h-screen bg-[#f4f4f8] py-10 px-4 font-sans">
      <Toaster />

      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.back()}
            className="text-sm text-purple-600 hover:underline mb-2 flex items-center gap-1"
          >
            ← Back to Menu
          </button>
          <h1 className="text-3xl font-extrabold text-gray-800">Checkout</h1>
          <p className="text-gray-400 text-sm mt-1">Review your order and confirm details</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* ── LEFT: FORM ── */}
          <div className="lg:col-span-2 flex flex-col gap-6">

            {/* Delivery Info */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h2 className="font-bold text-gray-800 text-lg mb-5 flex items-center gap-2">
                <span className="w-7 h-7 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center text-sm font-bold">1</span>
                Delivery Details
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                <div className="flex flex-col gap-1">
                  <label className="text-xs text-gray-500 font-semibold uppercase tracking-wide">Title</label>
                  <select
                    name="salutation"
                    value={form.salutation}
                    onChange={handleChange}
                    className="border border-gray-200 rounded-xl p-3 text-gray-800 text-sm focus:ring-2 focus:ring-purple-400 outline-none"
                  >
                    <option value="">Select</option>
                    <option value="Mr">Mr</option>
                    <option value="Mrs">Mrs</option>
                    <option value="Ms">Ms</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-xs text-gray-500 font-semibold uppercase tracking-wide">Phone *</label>
                  <input
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="Phone number"
                    className="border border-gray-200 rounded-xl p-3 text-gray-800 text-sm focus:ring-2 focus:ring-purple-400 outline-none"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-xs text-gray-500 font-semibold uppercase tracking-wide">First Name *</label>
                  <input
                    name="firstName"
                    value={form.firstName}
                    onChange={handleChange}
                    placeholder="First Name"
                    className="border border-gray-200 rounded-xl p-3 text-gray-800 text-sm focus:ring-2 focus:ring-purple-400 outline-none"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-xs text-gray-500 font-semibold uppercase tracking-wide">Last Name</label>
                  <input
                    name="lastName"
                    value={form.lastName}
                    onChange={handleChange}
                    placeholder="Last Name"
                    className="border border-gray-200 rounded-xl p-3 text-gray-800 text-sm focus:ring-2 focus:ring-purple-400 outline-none"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-xs text-gray-500 font-semibold uppercase tracking-wide">Email</label>
                  <input
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="Email"
                    className="border border-gray-200 rounded-xl p-3 text-gray-800 text-sm focus:ring-2 focus:ring-purple-400 outline-none"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-xs text-gray-500 font-semibold uppercase tracking-wide">City *</label>
                  <input
                    name="city"
                    value={form.city}
                    onChange={handleChange}
                    placeholder="City"
                    className="border border-gray-200 rounded-xl p-3 text-gray-800 text-sm focus:ring-2 focus:ring-purple-400 outline-none"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-xs text-gray-500 font-semibold uppercase tracking-wide">Street *</label>
                  <input
                    name="street"
                    value={form.street}
                    onChange={handleChange}
                    placeholder="Street name"
                    className="border border-gray-200 rounded-xl p-3 text-gray-800 text-sm focus:ring-2 focus:ring-purple-400 outline-none"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-xs text-gray-500 font-semibold uppercase tracking-wide">Street No</label>
                  <input
                    name="streetNo"
                    value={form.streetNo}
                    onChange={handleChange}
                    placeholder="Street number"
                    className="border border-gray-200 rounded-xl p-3 text-gray-800 text-sm focus:ring-2 focus:ring-purple-400 outline-none"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-xs text-gray-500 font-semibold uppercase tracking-wide">House No</label>
                  <input
                    name="houseNumber"
                    value={form.houseNumber}
                    onChange={handleChange}
                    placeholder="House number"
                    className="border border-gray-200 rounded-xl p-3 text-gray-800 text-sm focus:ring-2 focus:ring-purple-400 outline-none"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-xs text-gray-500 font-semibold uppercase tracking-wide">Floor No</label>
                  <input
                    name="floorNo"
                    value={form.floorNo}
                    onChange={handleChange}
                    placeholder="Floor"
                    className="border border-gray-200 rounded-xl p-3 text-gray-800 text-sm focus:ring-2 focus:ring-purple-400 outline-none"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-xs text-gray-500 font-semibold uppercase tracking-wide">ZIP Code</label>
                  <input
                    name="zip"
                    value={form.zip}
                    onChange={handleChange}
                    placeholder="ZIP"
                    className="border border-gray-200 rounded-xl p-3 text-gray-800 text-sm focus:ring-2 focus:ring-purple-400 outline-none"
                  />
                </div>

              </div>

              {/* Remark */}
              <div className="flex flex-col gap-1 mt-4">
                <label className="text-xs text-gray-500 font-semibold uppercase tracking-wide">Remark / Note</label>
                <textarea
                  value={remark}
                  onChange={(e) => setRemark(e.target.value)}
                  placeholder="Any special instructions..."
                  rows={3}
                  className="border border-gray-200 rounded-xl p-3 text-gray-800 text-sm focus:ring-2 focus:ring-purple-400 outline-none resize-none"
                />
              </div>
            </div>

            {/* Payment */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h2 className="font-bold text-gray-800 text-lg mb-5 flex items-center gap-2">
                <span className="w-7 h-7 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center text-sm font-bold">2</span>
                Payment Method
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { value: "cash", label: "💵 Cash on Delivery" },
                  { value: "card", label: "💳 Credit / Debit Card" },
                  { value: "online", label: "📱 Online Payment" },
                ].map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => setPaymentType(opt.value)}
                    className={`border-2 rounded-xl p-4 text-sm font-semibold transition-all text-left ${
                      paymentType === opt.value
                        ? "border-purple-500 bg-purple-50 text-purple-700"
                        : "border-gray-200 text-gray-500 hover:border-purple-300"
                    }`}
                  >
                    {opt.label}
                    {opt.value !== "cash" && (
                      <span className="block text-xs font-normal text-gray-400 mt-1">Coming soon</span>
                    )}
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* ── RIGHT: ORDER SUMMARY ── */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm p-6 sticky top-24">

              <h2 className="font-bold text-gray-800 text-lg mb-5 flex items-center gap-2">
                <span className="w-7 h-7 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center text-sm font-bold">3</span>
                Your Order
              </h2>

              {cartItems.length === 0 ? (
                <p className="text-gray-400 text-sm text-center py-6">Cart is empty 🛒</p>
              ) : (
                <div className="flex flex-col gap-3">
                  {cartItems.map((item) => (
                    <div key={item.mnuid} className="flex justify-between items-start gap-2">
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-gray-800 leading-tight">{item.name}</p>
                        <p className="text-xs text-gray-400">€{item.price} × {item.qty}</p>
                      </div>
                      <p className="text-sm font-bold text-gray-800 whitespace-nowrap">
                        €{(parseFloat(item.price) * item.qty).toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              {cartItems.length > 0 && (
                <>
                  <div className="border-t mt-4 pt-4 flex flex-col gap-2 text-sm">
                    <div className="flex justify-between text-gray-500">
                      <span>Subtotal</span>
                      <span>€{subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-gray-500">
                      <span>Delivery</span>
                      <span className="text-green-500 font-semibold">Free</span>
                    </div>
                    <div className="flex justify-between font-extrabold text-gray-800 text-base mt-1">
                      <span>Total</span>
                      <span>€{total.toFixed(2)}</span>
                    </div>
                  </div>

                  <button
                    onClick={handleCheckout}
                    disabled={loading || cartItems.length === 0}
                    className="mt-6 w-full bg-gradient-to-r from-[#69529d] to-[#7c5bc9] text-white py-3.5 rounded-xl font-bold text-base hover:opacity-90 transition disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Placing Order...
                      </>
                    ) : (
                      "Place Order 🎉"
                    )}
                  </button>

                  <p className="text-xs text-gray-400 text-center mt-3">
                    By placing your order, you agree to our terms & conditions
                  </p>
                </>
              )}

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}