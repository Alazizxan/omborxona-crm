"use client";

import { useRouter } from "next/navigation";
import { useCart } from "@/store/cartStore";

export default function AgentTopbar() {
  const router = useRouter();
  const items = useCart((s) => s.items);

  const count = items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800 bg-slate-950 sticky top-0 z-40">

      {/* BACK */}
      <button
        onClick={() => router.back()}
        className="text-sm text-slate-400 hover:text-white"
      >
        ← Orqaga
      </button>

      {/* CART */}
      <button
        onClick={() => router.push("/agent/cart")}
        className="relative"
      >
        🛒

        {count > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-600 text-xs text-white rounded-full px-1.5 py-0.5">
            {count}
          </span>
        )}
      </button>
    </div>
  );
}