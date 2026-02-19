"use client";

import { useCart } from "@/store/cartStore";

export default function ProductCard({ product }: any) {
  const { items, add, updateQty } = useCart();

  const cartItem = items.find(
    i => i.productId === product.id
  );

  return (
    <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl border border-gray-200 space-y-2">

      <div>
        <h3 className="font-medium">
          {product.name}
        </h3>

        <p className="text-sm text-gray-500">
          {product.price} {product.currency === "USD" ? "$" : "so'm"} / {product.unit}
        </p>

        <div className="text-xs text-gray-400">
          Mavjud: {product.quantity} {product.unit}
        </div>
      </div>

      {/* BUTTON AREA */}
      {!cartItem ? (
        <button
          onClick={() =>
            add({
              productId: product.id,
              name: product.name,
              price: product.price,
              currency: product.currency,
              quantity: 1,
            })
          }
          className="w-full bg-black text-white py-2 rounded-lg"
        >
          +
        </button>
      ) : (
        <div className="flex items-center gap-2">

          <button
            onClick={() =>
              updateQty(product.id, cartItem.quantity - 1)
            }
            className="w-7 h-7 bg-red-600 rounded flex items-center justify-center text-sm"
          >
            -
          </button>

          <span className="w-6 text-center text-sm">
            {cartItem.quantity}
          </span>

          <button
            onClick={() =>
              updateQty(product.id, cartItem.quantity + 1)
            }
            className="w-7 h-7 bg-green-600 rounded flex items-center justify-center text-sm"
          >
            +
          </button>

        </div>

      )}
    </div>
  );
}
