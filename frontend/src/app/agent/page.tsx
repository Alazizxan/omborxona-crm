"use client";

import { useEffect, useState } from "react";
import { api } from "../../lib/api";

export default function AgentDashboard() {
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    api
      .get("/orders/my", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(res => {
        const orders = res.data;

        let totalUZS = 0;
        let totalUSD = 0;

        orders.forEach((o: any) => {
          totalUZS += Number(o.totalUZS);
          totalUSD += Number(o.totalUSD);
        });

        setStats({
          count: orders.length,
          totalUZS,
          totalUSD,
        });
      });
  }, []);

  if (!stats) return <div>Loading...</div>;

  return (
    <div className="space-y-4">
      <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl border">
        <div className="text-sm text-gray-500">
          Buyurtmalar soni
        </div>
        <div className="text-xl font-semibold">
          {stats.count}
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl border">
        <div className="text-sm text-gray-500">
          Umumiy UZS
        </div>
        <div className="text-xl font-semibold">
          {stats.totalUZS} so'm
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl border">
        <div className="text-sm text-gray-500">
          Umumiy USD
        </div>
        <div className="text-xl font-semibold">
          {stats.totalUSD} $
        </div>
      </div>
    </div>
  );
}
