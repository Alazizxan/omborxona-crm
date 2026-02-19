"use client";

import { useCart } from "@/store/cartStore";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { api } from "../../../lib/api";

export default function CartPage() {
  const { items, remove, increase, decrease, totalUZS, totalUSD } = useCart();
  const router = useRouter();

  const [clientName, setClientName] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [storeName, setStoreName] = useState("");
  const [address, setAddress] = useState("");

  const createOrder = async () => {
    const token = localStorage.getItem("token");

    try {
      await api.post(
        "/orders",
        {
          clientName,
          clientPhone,
          storeName,
          address,
          items: items.map((i) => ({
            productId: i.productId,
            quantity: i.quantity,
            price: i.price,
          })),
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      useCart.setState({ items: [] }); // clear
      alert("Buyurtma yaratildi!");
      router.push("/agent/orders");
    } catch (err: any) {
      alert(err.response?.data?.message || "Xatolik yuz berdi");
    }
  };

  if (items.length === 0)
    return <div className="p-6 text-slate-400">Savatcha bo‘sh</div>;

  return (
    <div className="space-y-4">

      {/* ITEMS */}
      {items.map((item) => (
        <div
          key={item.productId}
          className="bg-slate-900 border border-slate-800 p-4 rounded-xl"
        >
          <div className="flex justify-between items-center">
            <div>
              <div className="font-medium">{item.name}</div>
              <div className="text-sm text-slate-400">
                {item.price} {item.currency}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => decrease(item.productId)}
                className="px-2 py-1 bg-slate-800 hover:bg-red-600 rounded"
              >
                -
              </button>

              <span>{item.quantity}</span>

              <button
                onClick={() => increase(item.productId)}
                className="px-2 py-1 bg-slate-800 hover:bg-green-600 rounded"
              >
                +
              </button>

              <button
                onClick={() => remove(item.productId)}
                className="text-red-400 text-xs ml-2"
              >
                O‘chirish
              </button>
            </div>
          </div>
        </div>
      ))}

      {/* TOTAL */}
      <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-1">
        {totalUZS() > 0 && (
          <div className="font-semibold">
            Jami: {totalUZS()} so'm
          </div>
        )}
        {totalUSD() > 0 && (
          <div className="font-semibold">
            Jami: {totalUSD()} $
          </div>
        )}
      </div>

      {/* CLIENT FORM */}
      <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-3">
        <input
          placeholder="Mijoz ismi"
          value={clientName}
          onChange={(e) => setClientName(e.target.value)}
          className="w-full bg-slate-800 border border-slate-700 p-2 rounded"
        />

        <input
          placeholder="Telefon"
          value={clientPhone}
          onChange={(e) => setClientPhone(e.target.value)}
          className="w-full bg-slate-800 border border-slate-700 p-2 rounded"
        />

        <input
          placeholder="Do'kon nomi"
          value={storeName}
          onChange={(e) => setStoreName(e.target.value)}
          className="w-full bg-slate-800 border border-slate-700 p-2 rounded"
        />

        <input
          placeholder="Manzil"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className="w-full bg-slate-800 border border-slate-700 p-2 rounded"
        />

        <button
          onClick={createOrder}
          className="w-full bg-white text-black py-2 rounded-lg hover:bg-slate-200 transition"
        >
          Buyurtma yaratish
        </button>
      </div>
    </div>
  );
}
