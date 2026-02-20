"use client";

import { useEffect, useState } from "react";
import { api } from "../../../lib/api";
import Link from "next/link";

export default function ClientsPage() {
  const [clients, setClients] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    api.get("/clients", { params: { search } })
      .then(res => setClients(res.data));
  }, [search]);

  return (
    <div className="p-6 space-y-4">

      <div className="flex justify-between items-center">
        <h1 className="text-xl font-semibold">Mijozlar</h1>

        <Link
          href="/agent/clients/create"
          className="bg-white text-black px-4 py-2 rounded-xl text-sm"
        >
          + Yangi mijoz
        </Link>
      </div>

      <input
        placeholder="Qidirish..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        className="w-full bg-slate-900 border border-slate-800 p-3 rounded-xl"
      />

      <div className="space-y-2">
        {clients.map((c: any) => (
          <div
            key={c.id}
            className="bg-slate-900 border border-slate-800 p-4 rounded-xl"
          >
            <div className="font-medium">{c.name}</div>
            <div className="text-sm text-slate-400">
              {c.phone}
            </div>
            <div className="text-sm text-slate-400">
              {c.storeName}
            </div>
            <div className="text-sm text-slate-400">
              {c.address}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}