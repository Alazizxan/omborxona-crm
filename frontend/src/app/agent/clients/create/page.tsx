"use client";

import { useState } from "react";
import { api } from "../../../../lib/api";
import { useRouter } from "next/navigation";

export default function CreateClientPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    phone: "",
    storeName: "",
    address: "",
  });

  const create = async () => {
    await api.post("/clients", form);
    router.push("/agent/clients");
  };

  return (
    <div className="p-6 space-y-4">

      <h1 className="text-xl font-semibold">Yangi mijoz</h1>

      {Object.keys(form).map((key) => (
        <input
          key={key}
          placeholder={key}
          value={(form as any)[key]}
          onChange={(e) =>
            setForm({ ...form, [key]: e.target.value })
          }
          className="w-full bg-slate-900 border border-slate-800 p-3 rounded-xl"
        />
      ))}

      <button
        onClick={create}
        className="w-full bg-white text-black py-3 rounded-xl"
      >
        Saqlash
      </button>
    </div>
  );
}