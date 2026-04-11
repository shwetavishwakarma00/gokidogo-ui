"use client";

import { useSelector, useDispatch } from "react-redux";
import { increaseQty, decreaseQty } from "@/app/redux/features/cartSlice";
import { useRouter } from "next/navigation";

export default function CartSidebar() {

  const dispatch = useDispatch();
  const router = useRouter();

  const userId = "guest";

  const items = useSelector(
    (state) => state.cart.carts[userId] || []
  );

  const total = items.reduce(
    (sum, i) => sum + i.price * i.qty,
    0
  );

  return (
    <div className="bg-white p-5 rounded-xl shadow sticky top-24">

      <h2 className="font-bold text-lg mb-4">
        Order Summary
      </h2>

      {items.length === 0 && (
        <p className="text-gray-400 text-sm">
          Cart empty
        </p>
      )}

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
                    id: item.mnuid
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
                    id: item.mnuid
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

      {items.length > 0 && (
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
  );
}