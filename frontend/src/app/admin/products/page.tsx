"use client";

import { useEffect, useState } from "react";
import { api } from "../../../lib/api";
import Link from "next/link";

export default function ProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    load();
  }, [search]);

  const load = () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    api
      .get("/products/all", {
        params: { search },
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(res => setProducts(res.data));
  };

  const remove = async (id: string) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    await api.delete(`/products/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    load();
  };

  return (
    <div>

      <div className="flex justify-between items-center mb-4">
        <h1 className="text-lg font-semibold text-white">
          Mahsulotlar
        </h1>

        <Link
          href="/admin/products/create"
          className="bg-white text-black px-4 py-2 rounded-lg text-sm hover:bg-gray-200 transition"
        >
          + Yangi mahsulot
        </Link>
      </div>

      {/* SEARCH */}
      <input
        placeholder="Qidirish..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        className="w-full bg-slate-900 border border-slate-700 text-white p-2 rounded-lg mb-4 focus:outline-none focus:ring-1 focus:ring-white/20"
      />

      {/* LIST */}
      <div className="space-y-2">
        {products.map(p => (
          <div
            key={p.id}
            className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex justify-between items-center hover:border-slate-600 transition"
          >
            <div>
              <div className="font-medium text-white">
                {p.name}
              </div>

              <div className="text-sm text-slate-400">
                {p.price} {p.currency === "USD" ? "$" : "so'm"} / {p.unit}
              </div>

              <div className="text-xs text-slate-500">
                {p.category?.name}
              </div>

              <div className="text-xs mt-1">
                {p.quantity <= 5 ? (
                  <span className="text-red-400 font-semibold">
                    Omborda kam: {p.quantity} {p.unit}
                  </span>
                ) : (
                  <span className="text-slate-400">
                    Omborda: {p.quantity} {p.unit}
                  </span>
                )}
              </div>
            </div>

            <div className="flex gap-2">
              <Link
                href={`/admin/products/${p.id}`}
                className="px-3 py-1 bg-slate-800 text-white rounded-lg text-xs hover:bg-slate-700 transition"
              >
                Edit
              </Link>

              <button
                onClick={() => remove(p.id)}
                className="px-3 py-1 bg-red-600 text-white rounded-lg text-xs hover:bg-red-500 transition"
              >
                Delete
              </button>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
}
