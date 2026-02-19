"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";

export default function AgentProfilePage() {
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    api.get("/orders/agent-stats", {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then(res => setStats(res.data));
  }, []);

  if (!stats) return <div>Yuklanmoqda...</div>;

  return (
    <div className="space-y-4">

      <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl border">
        <h1 className="text-lg font-semibold mb-4">
          Profil
        </h1>

        <div className="space-y-2 text-sm">
          <div>
            <b>Jami buyurtmalar:</b> {stats.totalOrders}
          </div>

          <div>
            <b>Jami so'm:</b> {stats.totalUZS}
          </div>

          <div>
            <b>Jami USD:</b> ${stats.totalUSD}
          </div>
        </div>
      </div>

      <button
        onClick={() => {
          localStorage.clear();
          window.location.href = "/login";
        }}
        className="w-full bg-red-600 text-white py-3 rounded-xl"
      >
        Chiqish
      </button>

    </div>
  );
}
