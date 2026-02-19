"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import ProductCard from "@/components/ProductCard";
import { useParams } from "next/navigation";

export default function CategoryPage() {
  const params = useParams();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    api.get(`/products/${params.id}`).then(res => {
      setProducts(res.data);
    });
  }, [params.id]);

  return (
    <div className="p-4 bg-gray-50 min-h-screen space-y-3">
      {products.map((p: any) => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  );
}
