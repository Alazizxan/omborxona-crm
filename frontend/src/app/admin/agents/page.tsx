"use client";

import { useEffect, useState } from "react";
import { api } from "../../../lib/api";
import Link from "next/link";

export default function AgentsPage() {
  const [agents, setAgents] = useState<any[]>([]);
  const token = localStorage.getItem("token");

  const load = () => {
    api
      .get("/users", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(res => setAgents(res.data));
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-lg font-semibold">
          Agentlar
        </h1>

        <Link
          href="/admin/agents/create"
          className="bg-black text-white px-4 py-2 rounded-lg text-sm"
        >
          + Yangi agent
        </Link>
      </div>

      <div className="space-y-2">
        {agents.map(a => (
          <div
            key={a.id}
            className="bg-slate-900 border border-slate-800 p-4 rounded-2xl border"
          >
            <div className="font-medium">{a.name}</div>
            <div className="text-sm text-gray-500">
              {a.phone}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
