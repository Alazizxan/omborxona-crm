"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import CategoryCard from "@/components/CategoryCard";
import SearchBar from "@/components/SearchBar";
import CartButton from "@/components/CartButton";

export default function Home() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    api.get("/categories").then(res => {
      setCategories(res.data);
    });
  }, []);

  return (
    <div className="p-4 bg-gray-50 min-h-screen">
      <SearchBar />

      <div className="mt-4 space-y-3">
        {categories.map((cat: any) => (
          <CategoryCard key={cat.id} category={cat} />
        ))}
      </div>

      <CartButton />
    </div>
  );
}
