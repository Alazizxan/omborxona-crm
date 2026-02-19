"use client";

import { useState } from "react";
import { useCart } from "../../store/cartStore";
import { api } from "../../lib/api";
import { useRouter } from "next/navigation";

export default function CartPage() {
  const { items, totalUZS, totalUSD, clear } = useCart();
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    clientName: "",
    clientPhone: "",
    storeName: "",
    address: "",
    lat: 41.3,
    lng: 69.2,
  });

  const handleOrder = async () => {
    if (!items.length) return;

    setLoading(true);

    try {
      const token = localStorage.getItem("token");

      await api.post(
        "/orders",
        {
          ...form,
          items: items.map(i => ({
            productId: i.productId,
            quantity: i.quantity,
            price: i.price,
          })),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      clear();
      alert("Buyurtma muvaffaqiyatli yaratildi");
      router.push("/");
    } catch (e) {
      alert("Xatolik yuz berdi");
    }

    setLoading(false);
  };

  const uzs = totalUZS();
  const usd = totalUSD();

  return (
    <div className="p-4 bg-slate-950 min-h-screen text-slate-100">
      <h1 className="text-xl font-semibold mb-6">Savatcha</h1>

      {/* ITEMS */}
      <div className="space-y-3">
        {items.map(item => (
          <div
            key={item.productId}
            className="bg-slate-900 p-4 rounded-2xl border border-slate-800"
          >
            <div className="flex justify-between">
              <span className="font-medium">{item.name}</span>
              <span className="text-sm text-slate-400">
                {item.quantity} × {item.price} {item.currency}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* FORM + TOTAL */}
      <div className="mt-8 bg-slate-900 p-5 rounded-2xl border border-slate-800 space-y-4">

        <input
          placeholder="Mijoz ismi"
          className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl"
          onChange={e => setForm({ ...form, clientName: e.target.value })}
        />

        <input
          placeholder="Telefon"
          className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl"
          onChange={e => setForm({ ...form, clientPhone: e.target.value })}
        />

        <input
          placeholder="Do'kon nomi"
          className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl"
          onChange={e => setForm({ ...form, storeName: e.target.value })}
        />

        <input
          placeholder="Manzil"
          className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl"
          onChange={e => setForm({ ...form, address: e.target.value })}
        />

        {/* TOTAL */}
        <div className="pt-4 border-t border-slate-800 space-y-1 text-sm">
          {uzs > 0 && (
            <div className="flex justify-between">
              <span>Jami (UZS)</span>
              <span className="font-semibold">{uzs} so'm</span>
            </div>
          )}

          {usd > 0 && (
            <div className="flex justify-between">
              <span>Jami (USD)</span>
              <span className="font-semibold">${usd}</span>
            </div>
          )}
        </div>

        <button
          onClick={handleOrder}
          disabled={loading}
          className="w-full bg-white text-black py-3 rounded-xl font-medium hover:opacity-90 transition"
        >
          {loading ? "Yaratilmoqda..." : "Buyurtma yaratish"}
        </button>
      </div>
    </div>
  );
}
