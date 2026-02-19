"use client";

import { useEffect, useState } from "react";
import { api } from "../../../lib/api";
import Link from "next/link";

export default function CategoriesPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [name, setName] = useState("");

  const load = () => {
    api.get("/categories").then(res => setCategories(res.data));
  };

  useEffect(() => {
    load();
  }, []);

  const create = async () => {
    const token = localStorage.getItem("token");
    if (!name) return;

    await api.post(
      "/categories",
      { name },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    setName("");
    load();
  };

  const remove = async (id: string) => {
    const token = localStorage.getItem("token");

    await api.delete(`/categories/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    load();
  };

  return (
    <div className="space-y-8">

      {/* TITLE */}
      <div>
        <h1 className="text-2xl font-semibold">
          Kategoriyalar
        </h1>
        <p className="text-slate-400 text-sm mt-1">
          Mahsulot bo‘limlari
        </p>
      </div>

      {/* CREATE BOX */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col sm:flex-row gap-3">

        <input
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="Yangi kategoriya nomi"
          className="flex-1 bg-slate-950 border border-slate-700 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-slate-500"
        />

        <button
          onClick={create}
          className="bg-slate-800 hover:bg-slate-700 px-5 py-2 rounded-lg text-sm transition"
        >
          Qo‘shish
        </button>

      </div>

      {/* LIST */}
      <div className="space-y-3">

        {categories.map((c: any) => (
          <div
            key={c.id}
            className="bg-slate-900 border border-slate-800 rounded-xl px-5 py-4 flex justify-between items-center"
          >
            <span className="font-medium">
              {c.name}
            </span>

            <div className="flex gap-3">

              

              <button
                onClick={() => remove(c.id)}
                className="text-sm text-red-400 hover:text-red-300 transition"
              >
                Delete
              </button>

            </div>
          </div>
        ))}

        {categories.length === 0 && (
          <div className="text-slate-500 text-sm">
            Hozircha kategoriya yo‘q
          </div>
        )}

      </div>

    </div>
  );
}
