"use client";

import { useState } from "react";
import { api } from "../../../../lib/api";
import { useRouter } from "next/navigation";

export default function CreateAgentPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    phone: "",
    password: "",
  });

  const token = localStorage.getItem("token");

  const create = async () => {
    if (!form.name || !form.phone || !form.password) return;

    await api.post(
      "/users/agent",
      form,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    router.push("/admin/agents");
  };

  return (
    <div className="max-w-md">
      <h1 className="text-lg font-semibold mb-6">
        Yangi agent
      </h1>

      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl border space-y-4">
        <input
          placeholder="Ismi"
          value={form.name}
          onChange={e =>
            setForm({ ...form, name: e.target.value })
          }
          className="w-full border p-2 rounded-lg"
        />

        <input
          placeholder="Telefon"
          value={form.phone}
          onChange={e =>
            setForm({ ...form, phone: e.target.value })
          }
          className="w-full border p-2 rounded-lg"
        />

        <input
          placeholder="Parol"
          type="password"
          value={form.password}
          onChange={e =>
            setForm({ ...form, password: e.target.value })
          }
          className="w-full border p-2 rounded-lg"
        />

        <button
          onClick={create}
          className="w-full bg-black text-white py-2 rounded-lg"
        >
          Saqlash
        </button>
      </div>
    </div>
  );
}
