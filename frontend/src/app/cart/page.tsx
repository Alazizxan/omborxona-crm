"use client";

import { useState } from "react";
import { useCart } from "../../store/cartStore";
import { api } from "../../lib/api";
import { useRouter } from "next/navigation";

export default function CartPage() {
  const { items, total, clear } = useCart();
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

  return (
    <div className="p-4 bg-gray-50 min-h-screen">
      <h1 className="text-lg font-semibold mb-4">Savatcha</h1>

      <div className="space-y-3">
        {items.map(item => (
          <div
            key={item.productId}
            className="bg-white p-3 rounded-xl border border-gray-200"
          >
            <div className="flex justify-between">
              <span>{item.name}</span>
              <span>
                {item.quantity} x {item.price}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 bg-white p-4 rounded-xl border border-gray-200 space-y-3">
        <input
          placeholder="Mijoz ismi"
          className="w-full p-2 border rounded-lg"
          onChange={e => setForm({ ...form, clientName: e.target.value })}
        />

        <input
          placeholder="Telefon"
          className="w-full p-2 border rounded-lg"
          onChange={e => setForm({ ...form, clientPhone: e.target.value })}
        />

        <input
          placeholder="Do'kon nomi"
          className="w-full p-2 border rounded-lg"
          onChange={e => setForm({ ...form, storeName: e.target.value })}
        />

        <input
          placeholder="Manzil"
          className="w-full p-2 border rounded-lg"
          onChange={e => setForm({ ...form, address: e.target.value })}
        />

        <div className="flex justify-between font-semibold">
          <span>Jami:</span>
          <span>{total()} so'm</span>
        </div>

        <button
          onClick={handleOrder}
          disabled={loading}
          className="w-full bg-black text-white py-3 rounded-xl"
        >
          {loading ? "Yaratilmoqda..." : "Buyurtma yaratish"}
        </button>
      </div>
    </div>
  );
}
