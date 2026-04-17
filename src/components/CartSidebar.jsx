"use client";

import { useSelector, useDispatch } from "react-redux";
import { increaseQty, decreaseQty } from "@/app/redux/features/cartSlice";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";

export default function CartSidebar() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { t } = useTranslation();

  const userId = "guest_user";

  const items = useSelector(
    (state) => state.cart.carts?.[userId] || []
  );

  const total = items.reduce(
    (sum, i) => sum + (i.price || 0) * (i.qty || 1),
    0
  );

  return (
    <div className="bg-white p-5 rounded-xl shadow sticky top-24">

      {/* TITLE (i18n enabled) */}
      <h2 className="font-bold text-lg mb-4">
        {t("cart.title") || "Order Summary"}
      </h2>

      {/* EMPTY STATE */}
      {items.length === 0 && (
        <p className="text-gray-400 text-sm">
          {t("Empty cart") || "Cart is empty"}
        </p>
      )}

      {/* ITEMS */}
      {items.map((item) => (
        <div
          key={item.mnuid}
          className="flex justify-between items-center mb-3"
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
                    id: item.mnuid,
                  })
                )
              }
              className="w-6 h-6 border rounded"
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
              className="w-6 h-6 border rounded"
            >
              +
            </button>

          </div>
        </div>
      ))}

      {/* TOTAL + CHECKOUT */}
      {items.length > 0 && (
        <>
          <div className="border-t pt-3 flex justify-between font-bold">
            <span>{t("cart.total") || "Total"}</span>
            <span>€{total.toFixed(2)}</span>
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
  );
}