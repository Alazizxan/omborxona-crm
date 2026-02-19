"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { api } from "../../lib/api";

export default function AdminPage() {
  const router = useRouter();
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/login");
      return;
    }

    const payload = JSON.parse(atob(token.split(".")[1]));

    if (payload.role !== "ADMIN") {
      router.push("/agent");
      return;
    }

    api
      .get("/analytics/dashboard", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(res => setStats(res.data))
      .catch(() => router.push("/login"));
  }, []);

  if (!stats) {
    return (
      <div className="text-slate-400">
        Yuklanmoqda...
      </div>
    );
  }

  return (
    <div className="space-y-8">

      {/* TITLE */}
      <div>
        <h1 className="text-2xl font-semibold">
          Dashboard
        </h1>
        <p className="text-slate-400 text-sm mt-1">
          Umumiy statistika
        </p>
      </div>

      
      {/* CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">

        <StatCard
          title="Jami buyurtmalar"
          value={stats.totalOrders}
        />

        <StatCard
          title="Jami tushum (UZS)"
          value={`${stats.totalUZS || 0} so'm`}
        />

        <StatCard
          title="Jami tushum (USD)"
          value={`${stats.totalUSD || 0} $`}
        />

        <StatCard
          title="Bugungi tushum"
          value={`${stats.todayUZS || 0} so'm`}
        />

      </div>
    </div>
  );
}

function StatCard({
  title,
  value,
}: {
  title: string;
  value: any;
}) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">

      <p className="text-sm text-slate-400 mb-2">
        {title}
      </p>

      <p className="text-xl font-semibold">
        {value}
      </p>

    </div>
  );
}
