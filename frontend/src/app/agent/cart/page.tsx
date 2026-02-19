"use client";

import { useCart } from "@/store/cartStore";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { api } from "../../../lib/api";


export default function CartPage() {
    const { items, remove, updateQty, clear } = useCart();
    const router = useRouter();

    const [clientName, setClientName] = useState("");
    const [clientPhone, setClientPhone] = useState("");
    const [storeName, setStoreName] = useState("");
    const [address, setAddress] = useState("");

    let totalUZS = 0;
    let totalUSD = 0;

    items.forEach(item => {
        if (item.currency === "USD") {
            totalUSD += item.price * item.quantity;
        } else {
            totalUZS += item.price * item.quantity;
        }
    });

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
                    items: items.map(i => ({
                        productId: i.productId,
                        quantity: i.quantity,
                        price: i.price,
                    })),
                },
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            clear();
            alert("Buyurtma yaratildi!");
            router.push("/agent/orders");
        } catch (err: any) {
            alert(
                err.response?.data?.message ||
                "Xatolik yuz berdi"
            );
        }
    };

    if (items.length === 0)
        return <div>Savatcha bo‘sh</div>;

    return (
        <div className="space-y-4">

            {/* ITEMS */}
            {items.map(item => (
                <div
                    key={item.productId}
                    className="bg-slate-900 border border-slate-800 p-4 rounded-xl border"
                >
                    <div className="flex justify-between">
                        <div>
                            <div className="font-medium">
                                {item.name}
                            </div>
                            <div className="text-sm text-gray-500">
                                {item.price} {item.currency}
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <button
                                onClick={() =>
                                    updateQty(
                                        item.productId,
                                        item.quantity - 1
                                    )
                                }
                                className="px-2 bg-red-500 rounded"
                            >
                                -
                            </button>

                            <span>{item.quantity}</span>

                            <button
                                onClick={() =>
                                    updateQty(
                                        item.productId,
                                        item.quantity + 1
                                    )
                                }
                                className="px-2 bg-green-500 rounded"
                            >
                                +
                            </button>

                            <button
                                onClick={() =>
                                    remove(item.productId)
                                }
                                className="text-red-600 text-xs"
                            >
                                O‘chirish
                            </button>
                        </div>
                    </div>
                </div>
            ))}

            {/* TOTAL */}
            <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl border space-y-1">
                {totalUZS > 0 && (
                    <div>Jami: {totalUZS} so'm</div>
                )}
                {totalUSD > 0 && (
                    <div>Jami: {totalUSD} $</div>
                )}
            </div>

            {/* CLIENT FORM */}
            <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl border space-y-3">
                <input
                    placeholder="Mijoz ismi"
                    value={clientName}
                    onChange={e =>
                        setClientName(e.target.value)
                    }
                    className="w-full border p-2 rounded"
                />

                <input
                    placeholder="Telefon"
                    value={clientPhone}
                    onChange={e =>
                        setClientPhone(e.target.value)
                    }
                    className="w-full border p-2 rounded"
                />

                <input
                    placeholder="Do'kon nomi"
                    value={storeName}
                    onChange={e =>
                        setStoreName(e.target.value)
                    }
                    className="w-full border p-2 rounded"
                />

                <input
                    placeholder="Manzil"
                    value={address}
                    onChange={e =>
                        setAddress(e.target.value)
                    }
                    className="w-full border p-2 rounded"
                />

                <button
                    onClick={createOrder}
                    className="w-full bg-black text-white py-2 rounded-lg"
                >
                    Buyurtma yaratish
                </button>
            </div>
        </div>
    );
}
