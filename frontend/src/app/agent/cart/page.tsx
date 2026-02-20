"use client";

import { useCart } from "@/store/cartStore";
import { useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { api } from "../../../lib/api";

export default function CartPage() {
  const { items, remove, increase, decrease, totalUZS, totalUSD } = useCart();
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  // 🔽 CLIENT DROPDOWN STATE
  const [open, setOpen] = useState(false);
  const [clientSearch, setClientSearch] = useState("");
  const [clients, setClients] = useState<any[]>([]);
  const [selectedClient, setSelectedClient] = useState<any>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // 🔄 Initial load (alfavit tartib backendda bo‘lsin)
  useEffect(() => {
    loadClients();
  }, []);

  const loadClients = (search?: string) => {
    api
      .get("/clients", {
        params: { search },
      })
      .then((res) => setClients(res.data))
      .catch(() => setClients([]));
  };

  // 🔎 Debounced server-side search
  useEffect(() => {
    const timeout = setTimeout(() => {
      loadClients(clientSearch);
    }, 300);

    return () => clearTimeout(timeout);
  }, [clientSearch]);

  // 🚪 Outside click → close dropdown
  useEffect(() => {
    function handleClickOutside(event: any) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const createOrder = async () => {
    if (!items.length) return;
    if (!selectedClient) {
      alert("Mijoz tanlang");
      return;
    }

    const token = localStorage.getItem("token");
    setLoading(true);

    try {
      await api.post(
        "/orders",
        {
          clientId: selectedClient.id,
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

      useCart.setState({ items: [] });
      alert("Buyurtma yaratildi!");
      router.push("/agent/orders");
    } catch (err: any) {
      alert(err.response?.data?.message || "Xatolik yuz berdi");
    }

    setLoading(false);
  };

  if (items.length === 0) {
    return (
      <div className="p-6 text-slate-400">
        Savatcha bo‘sh
      </div>
    );
  }

  return (
    <div className="space-y-6">

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
          <div className="flex justify-between font-semibold">
            <span>Jami (UZS)</span>
            <span>{totalUZS()} so'm</span>
          </div>
        )}
        {totalUSD() > 0 && (
          <div className="flex justify-between font-semibold">
            <span>Jami (USD)</span>
            <span>${totalUSD()}</span>
          </div>
        )}
      </div>

      {/* CLIENT SELECT */}
      <div
        ref={dropdownRef}
        className="relative bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-3"
      >
        <div className="font-medium">Mijoz tanlash</div>

        <div className="relative">
          <input
            placeholder="Mijoz qidirish..."
            value={selectedClient ? selectedClient.name : clientSearch}
            onFocus={() => setOpen(true)}
            onChange={(e) => {
              setSelectedClient(null);
              setClientSearch(e.target.value);
              setOpen(true);
            }}
            className="w-full bg-slate-800 border border-slate-700 p-2 rounded"
          />

          {open && (
            <div className="absolute z-50 mt-2 w-full bg-slate-800 border border-slate-700 rounded-lg shadow-lg max-h-60 overflow-y-auto">

              {clients.length > 0 ? (
                clients.map((c) => (
                  <div
                    key={c.id}
                    onClick={() => {
                      setSelectedClient(c);
                      setClientSearch("");
                      setOpen(false);
                    }}
                    className="px-3 py-2 hover:bg-slate-700 cursor-pointer text-sm border-b border-slate-700"
                  >
                    <div className="font-medium">{c.name}</div>
                    <div className="text-xs text-slate-400">
                      {c.phone}
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-3 text-sm text-slate-400">
                  Mijoz topilmadi
                  <button
                    onClick={() =>
                      router.push("/agent/clients/create")
                    }
                    className="block text-blue-400 mt-2"
                  >
                    + Mijoz qo‘shish
                  </button>
                </div>
              )}

            </div>
          )}
        </div>

        {selectedClient && (
          <div className="text-sm text-slate-400 pt-2 border-t border-slate-800 space-y-1">
            <div>{selectedClient.phone}</div>
            <div>{selectedClient.storeName}</div>
            <div>{selectedClient.address}</div>
          </div>
        )}

        <button
          onClick={createOrder}
          disabled={loading}
          className="w-full bg-white text-black py-2 rounded-lg hover:bg-slate-200 transition"
        >
          {loading ? "Yaratilmoqda..." : "Buyurtma yaratish"}
        </button>
      </div>
    </div>
  );
}