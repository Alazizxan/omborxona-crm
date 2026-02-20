"use client";

import { useEffect, useState } from "react";
import { api } from "../../../lib/api";
import OrderDetailModal from "../../../components/OrderDetailModal";

export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [agents, setAgents] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState("");
  const [search, setSearch] = useState("");
  const [agentId, setAgentId] = useState("");
  const [selected, setSelected] = useState<any>(null);

  const load = () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    api
      .get("/orders", {
        headers: { Authorization: `Bearer ${token}` },
        params: {
          page,
          limit: 10,
          status: status || undefined,
          agentId: agentId || undefined,
          search: search || undefined,
        },
      })
      .then(res => setOrders(res.data));

    api
      .get("/users", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(res => setAgents(res.data));
  };

  const download = (url: string) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const base = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "");

    window.open(
      `${base}${url}?token=${token}`,
      "_blank"
    );
  };

  useEffect(() => {
    load();
  }, [page, status, search, agentId]);

  return (
    <div className="space-y-6">

      {/* TITLE */}


      {/* FILTER PANEL */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-4">

        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">

          <input
            placeholder="Mijoz qidirish..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-slate-500"
          />

          <select
            value={status}
            onChange={e => setStatus(e.target.value)}
            className="bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm"
          >
            <option value="">Holat (hammasi)</option>
            <option value="CREATED">Yaratilgan</option>
            <option value="PROCESSING">Jarayonda</option>
            <option value="COMPLETED">Yakunlangan</option>
            <option value="CANCELED">Bekor</option>
          </select>

          <select
            value={agentId}
            onChange={e => setAgentId(e.target.value)}
            className="bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm"
          >
            <option value="">Agent (hammasi)</option>
            {agents.map(a => (
              <option key={a.id} value={a.id}>
                {a.name}
              </option>
            ))}
          </select>

          <button
            onClick={() =>
              download("/export/orders")
            }
            className="bg-slate-800 hover:bg-slate-700 rounded-lg px-4 py-2 text-sm transition"
          >
            Barcha Excel
          </button>

        </div>

        {agentId && (
          <button
            onClick={() =>
              download(`/export/agent/${agentId}`)
            }
            className="bg-slate-800 hover:bg-slate-700 rounded-lg px-4 py-2 text-sm transition"
          >
            Tanlangan agent Excel
          </button>
        )}

      </div>

      {/* DESKTOP TABLE */}
      <div className="hidden md:block bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-800 text-slate-400">
            <tr>
              <th className="p-3 text-left">Order</th>
              <th className="p-3 text-left">Agent</th>
              <th className="p-3 text-left">Mijoz</th>
              <th className="p-3 text-left">UZS</th>
              <th className="p-3 text-left">USD</th>
              <th className="p-3 text-left">Holat</th>
              <th className="p-3 text-left">Excel</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr
                key={order.id}
                onClick={() => setSelected(order)}
                className="border-t border-slate-800 hover:bg-slate-800/40 cursor-pointer transition"
              >
                <td className="p-3 font-medium">{order.orderNumber}</td>
                <td className="p-3">{order.agent?.name}</td>
                <td className="p-3">{order.clientName}</td>
                <td className="p-3">{order.totalUZS || 0} so'm</td>
                <td className="p-3">{order.totalUSD || 0} $</td>
                <td className="p-3">
                  <StatusBadge status={order.status} />
                </td>
                <td
                  className="p-3"
                  onClick={e => e.stopPropagation()}
                >
                  <button
                    onClick={() =>
                      download(
                        `/export/order/${order.id}`)
                    }
                    className="text-blue-400 text-xs hover:text-blue-300"
                  >
                    Yuklash
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MOBILE CARD VIEW */}
      <div className="md:hidden space-y-3">
        {orders.map(order => (
          <div
            key={order.id}
            onClick={() => setSelected(order)}
            className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-2"
          >
            <div className="flex justify-between">
              <span className="font-medium">
                {order.orderNumber}
              </span>
              <StatusBadge status={order.status} />
            </div>

            <div className="text-sm text-slate-400">
              {order.clientName}
            </div>

            <div className="text-sm">
              {order.totalUZS || 0} so'm
            </div>

            {order.totalUSD > 0 && (
              <div className="text-sm">
                {order.totalUSD} $
              </div>
            )}

            <button
              onClick={(e) => {
                e.stopPropagation();
                download(
                  `/export/order/${order.id}`);
              }}
              className="text-blue-400 text-xs mt-2"
            >
              Excel yuklash
            </button>
          </div>
        ))}
      </div>

      {/* PAGINATION */}
      <div className="flex justify-between text-sm">
        <button
          onClick={() => setPage(p => Math.max(1, p - 1))}
          className="px-4 py-2 bg-slate-800 rounded-lg"
        >
          Oldingi
        </button>

        <span className="text-slate-400">
          Sahifa {page}
        </span>

        <button
          onClick={() => setPage(p => p + 1)}
          className="px-4 py-2 bg-slate-800 rounded-lg"
        >
          Keyingi
        </button>
      </div>

      <OrderDetailModal
        order={selected}
        onClose={() => setSelected(null)}
      />
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const colors: any = {
    CREATED: "bg-slate-700 text-white",
    PROCESSING: "bg-blue-600 text-white",
    COMPLETED: "bg-green-600 text-white",
    CANCELED: "bg-red-600 text-white",
  };

  return (
    <span className={`px-2 py-1 rounded-full text-xs ${colors[status]}`}>
      {status}
    </span>
  );
}
