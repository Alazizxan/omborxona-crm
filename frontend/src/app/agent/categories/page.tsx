"use client";

import { useEffect, useState } from "react";
import { api } from "../../../lib/api";
import Link from "next/link";

export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    api.get("/categories").then(res =>
      setCategories(res.data)
    );
  }, []);

  return (
    <div className="space-y-2">
      {categories.map((c: any) => (
        <Link
          key={c.id}
          href={`/agent/products?category=${c.id}`}
          className="block bg-slate-900 border border-slate-800 p-4 rounded-xl border"
        >
          {c.name}
        </Link>
      ))}
    </div>
  );
}
