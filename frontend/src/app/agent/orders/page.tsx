"use client";

import { useEffect, useState } from "react";
import { api } from "../../../lib/api";
import OrderCard from "@/components/AgentOrderCard";

export default function AgentOrdersPage() {
    const [orders, setOrders] = useState<any[]>([]);
    const [status, setStatus] = useState("");
    const [search, setSearch] = useState("");

    const load = () => {
        const token = localStorage.getItem("token");
        if (!token) return;

        api.get("/orders/my", {
            headers: { Authorization: `Bearer ${token}` },
            params: {
                status: status || undefined,
                search: search || undefined,
                page: 1,
                limit: 50,
            },
        })
            .then(res => setOrders(res.data))
            .catch(err => console.log(err));
    };

    const download = async (url: string, filename: string) => {
        const token = localStorage.getItem("token");
        if (!token) return;

        const res = await api.get(url, {
            headers: { Authorization: `Bearer ${token}` },
            responseType: "blob",
        });

        const blob = new Blob([res.data]);
        const link = document.createElement("a");
        link.href = window.URL.createObjectURL(blob);
        link.download = filename;
        link.click();
    };

    useEffect(() => {
        if (typeof window !== "undefined") {
            load();
        }
    }, [status, search]);

    return (
        <div className="space-y-4">

            {/* FILTER + SEARCH */}
            <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl border space-y-3">

                <input
                    placeholder="Qidirish..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="w-full border p-2 rounded-lg"
                />

                <select
                    value={status}
                    onChange={e => setStatus(e.target.value)}
                    className="w-full border p-2 rounded-lg"
                >
                    <option value="">Hammasi</option>
                    <option value="CREATED">Yaratilgan</option>
                    <option value="PROCESSING">Jarayonda</option>
                    <option value="COMPLETED">Yakunlangan</option>
                    <option value="CANCELED">Bekor</option>
                </select>

                {/* SENING O'SHA TUGMA */}
                <button
                    onClick={() =>
                        download(
                            `/export/my`,
                            "agent-orders.xlsx"
                        )
                    }
                    className="w-full bg-black text-white py-2 rounded-lg"
                >
                    Excel yuklash
                </button>


            </div>

            {/* ORDERS LIST */}
            {orders.map(order => (
                <OrderCard key={order.id} order={order} />
            ))}

        </div>
    );
}
