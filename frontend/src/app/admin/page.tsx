"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { api } from "../../lib/api";

export default function AdminPage() {
  const router = useRouter();

  const [orders, setOrders] = useState<any[]>([]);
  const [agents, setAgents] = useState<any[]>([]);
  const [selectedAgent, setSelectedAgent] = useState<any>(null);

  const [agentSearch, setAgentSearch] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

  /* ================= AUTH + LOAD ================= */

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return router.push("/login");

    const payload = JSON.parse(atob(token.split(".")[1]));
    if (payload.role !== "ADMIN") return router.push("/agent");

    api
      .get("/orders", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setOrders(res.data);

        const map = new Map();

        res.data.forEach((o: any) => {
          if (o.agent) map.set(o.agent.id, o.agent);
        });

        const sorted = Array.from(map.values()).sort(
          (a: any, b: any) =>
            a.name.localeCompare(b.name)
        );

        setAgents(sorted);
      });
  }, []);

  /* ================= CLICK OUTSIDE ================= */

  useEffect(() => {
    const handler = (e: any) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target)
      ) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () =>
      document.removeEventListener("mousedown", handler);
  }, []);

  /* ================= CALC ================= */

  const completedOrders = orders.filter(
    (o) => o.status === "COMPLETED"
  );

  const now = new Date();
  const today = now.toISOString().slice(0, 10);
  const month = now.toISOString().slice(0, 7);

  const calculate = (list: any[]) => {
    let totalUZS = 0;
    let totalUSD = 0;
    let todayUZS = 0;
    let todayUSD = 0;
    let monthUZS = 0;
    let monthUSD = 0;

    list.forEach((o) => {
      totalUZS += Number(o.totalUZS || 0);
      totalUSD += Number(o.totalUSD || 0);

      const d = new Date(o.createdAt)
        .toISOString()
        .slice(0, 10);
      const m = new Date(o.createdAt)
        .toISOString()
        .slice(0, 7);

      if (d === today) {
        todayUZS += Number(o.totalUZS || 0);
        todayUSD += Number(o.totalUSD || 0);
      }

      if (m === month) {
        monthUZS += Number(o.totalUZS || 0);
        monthUSD += Number(o.totalUSD || 0);
      }
    });

    return {
      totalUZS,
      totalUSD,
      todayUZS,
      todayUSD,
      monthUZS,
      monthUSD,
      count: list.length,
    };
  };

  const globalStats = calculate(completedOrders);

  const agentOrders = selectedAgent
    ? completedOrders.filter(
        (o) => o.agentId === selectedAgent.id
      )
    : [];

  const agentStats = calculate(agentOrders);

  const filteredAgents = agents.filter((a) =>
    a.name
      .toLowerCase()
      .includes(agentSearch.toLowerCase())
  );

  /* ================= UI ================= */

  return (
    <div className="space-y-8">

      <div>
        <h1 className="text-2xl font-semibold">
          Admin Dashboard
        </h1>
        <p className="text-slate-400 text-sm">
          FAqat COMPLETED hisoblanadi
        </p>
      </div>

      {/* GLOBAL */}
      <div className="grid grid-cols-2 gap-4">
        <Stat title="Jami Completed" value={globalStats.count} />
        <Stat title="Umumiy UZS" value={`${globalStats.totalUZS} so'm`} />
        <Stat title="Umumiy USD" value={`${globalStats.totalUSD} $`} />
        <Stat title="Bugungi UZS" value={`${globalStats.todayUZS} so'm`} />
        <Stat title="Oylik UZS" value={`${globalStats.monthUZS} so'm`} />
        <Stat title="Oylik USD" value={`${globalStats.monthUSD} $`} />
      </div>

      {/* AGENT SELECT */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">

        <div className="font-medium">
          Agent statistikasi
        </div>

        <div ref={dropdownRef} className="relative">

          <div
            onClick={() =>
              setDropdownOpen(!dropdownOpen)
            }
            className="bg-slate-950 border border-slate-700 p-3 rounded-xl cursor-pointer"
          >
            {selectedAgent
              ? selectedAgent.name
              : "Agent tanlash"}
          </div>

          {dropdownOpen && (
            <div className="absolute z-50 mt-2 w-full bg-slate-950 border border-slate-800 rounded-xl shadow-xl max-h-60 overflow-y-auto">

              <input
                placeholder="Qidirish..."
                value={agentSearch}
                onChange={(e) =>
                  setAgentSearch(e.target.value)
                }
                className="w-full p-3 border-b border-slate-800 bg-slate-950 outline-none"
              />

              {filteredAgents.map((a) => (
                <div
                  key={a.id}
                  onClick={() => {
                    setSelectedAgent(a);
                    setDropdownOpen(false);
                  }}
                  className="p-3 hover:bg-slate-800 cursor-pointer"
                >
                  {a.name}
                </div>
              ))}

              {!filteredAgents.length && (
                <div className="p-3 text-slate-500 text-sm">
                  Topilmadi
                </div>
              )}
            </div>
          )}
        </div>

        {selectedAgent && (
          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-800">
            <Stat title="Agent UZS" value={`${agentStats.totalUZS} so'm`} />
            <Stat title="Agent USD" value={`${agentStats.totalUSD} $`} />
            <Stat title="Bugungi UZS" value={`${agentStats.todayUZS} so'm`} />
            <Stat title="Bugungi USD" value={`${agentStats.todayUSD} $`} />
            <Stat title="Oylik UZS" value={`${agentStats.monthUZS} so'm`} />
            <Stat title="Oylik USD" value={`${agentStats.monthUSD} $`} />
          </div>
        )}

      </div>
    </div>
  );
}

function Stat({ title, value }: any) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
      <div className="text-sm text-slate-400">
        {title}
      </div>
      <div className="text-lg font-semibold">
        {value}
      </div>
    </div>
  );
}