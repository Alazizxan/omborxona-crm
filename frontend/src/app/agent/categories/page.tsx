"use client";

import { useEffect, useState } from "react";
import { api } from "../../../lib/api";
import Link from "next/link";
import ProductCard from "@/components/ProductCard";

export default function CategoriesPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    api.get("/categories").then((res) =>
      setCategories(res.data)
    );
  }, []);

  useEffect(() => {
    if (!search.trim()) {
      setProducts([]);
      return;
    }

    const timeout = setTimeout(() => {
      api
        .get("/products/search", {
          params: { search },
        })
        .then((res) => {
          if (Array.isArray(res.data)) {
            setProducts(res.data);
          } else {
            setProducts([]);
          }
        });
    }, 400);

    return () => clearTimeout(timeout);
  }, [search]);

  return (
    <div className="space-y-4">

      {/* SEARCH */}
      <input
        placeholder="Mahsulot qidirish..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500"
      />

      {/* SEARCH RESULT */}
      {search ? (
        <div className="space-y-2">
          {products.length === 0 && (
            <div className="text-slate-400 text-sm">
              Hech narsa topilmadi
            </div>
          )}

          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          {categories.map((c) => (
            <Link
              key={c.id}
              href={`/agent/products?category=${c.id}`}
              className="block bg-slate-900 border border-slate-800 p-4 rounded-xl hover:border-blue-500 transition"
            >
              {c.name}
            </Link>
          ))}
        </div>
      )}

    </div>
  );
}