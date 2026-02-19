"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { api } from "../../../lib/api";
import ProductCard from "../../../components/ProductCard";
import { useCart } from "@/store/cartStore";
import Link from "next/link";


export default function ProductsPage() {
    const params = useSearchParams();
    const category = params.get("category");
    


    const [products, setProducts] = useState([]);

    useEffect(() => {
        if (!category) return;

        api
            .get(`/products/category/${category}`)
            .then(res => setProducts(res.data));
    }, [category]);

    const items = useCart((state) => state.items);

    return (
        <div className="space-y-2">
            {products.map((p: any) => (
                <ProductCard key={p.id} product={p} />
            ))}

            {items.length > 0 && (
                <Link
                    href="/agent/cart"
                    className="fixed bottom-4 left-4 right-4 bg-black text-white py-3 rounded-xl text-center"
                >
                    Savatcha ({items.length})
                </Link>
            )}
        </div>

    );
}
