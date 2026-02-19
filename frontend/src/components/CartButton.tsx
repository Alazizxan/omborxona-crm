"use client";
import Link from "next/link";
import { useCart } from "@/store/cartStore";

export default function CartButton() {
  const items = useCart(state => state.items);
  const totalUZS = useCart(state => state.totalUZS());
  const totalUSD = useCart(state => state.totalUSD());

  if (!items.length) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 bg-slate-900 text-white p-4 rounded-xl shadow-xl flex justify-between">
      <div>
        {totalUZS > 0 && <div>{totalUZS} so'm</div>}
        {totalUSD > 0 && <div>${totalUSD}</div>}
      </div>

      <div>{items.length} ta mahsulot</div>
    </div>
  );
}
