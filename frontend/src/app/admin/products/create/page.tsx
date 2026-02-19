"use client";

import { useEffect, useState } from "react";
import { api } from "../../../../lib/api";
import { useRouter } from "next/navigation";

export default function CreateProductPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    currency: "UZS",
    unit: "",
    quantity: "",
    categoryId: "",
  });

  useEffect(() => {
    api.get("/categories").then(res => {
      setCategories(res.data);
    });
  }, []);

  const create = async () => {
    if (!form.name || !form.price || !form.categoryId) return;

    const token = localStorage.getItem("token");
    if (!token) return;

    setLoading(true);

    await api.post(
      "/products",
      {
        ...form,
        price: Number(form.price),
        quantity: Number(form.quantity || 0),
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    router.push("/admin/products");
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-8">

      

      {/* FORM CARD */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-5">

        {/* NAME */}
        <FormInput
          label="Nomi"
          value={form.name}
          onChange={(v: string) => setForm({ ...form, name: v })}
        />

        {/* DESCRIPTION */}
        <FormInput
          label="Tavsif"
          value={form.description}
          onChange={(v: string) => setForm({ ...form, description: v })}
        />

        {/* PRICE + CURRENCY */}
        <div className="grid grid-cols-2 gap-4">
          <FormInput
            label="Narxi"
            type="number"
            value={form.price}
            onChange={(v: string) => setForm({ ...form, price: v })}
          />

          <FormSelect
            label="Valyuta"
            value={form.currency}
            onChange={(v: string) => setForm({ ...form, currency: v })}
            options={[
              { value: "UZS", label: "So'm (UZS)" },
              { value: "USD", label: "Dollar (USD)" },
            ]}
          />
        </div>

        {/* UNIT + QUANTITY */}
        <div className="grid grid-cols-2 gap-4">
          <FormSelect
            label="Birlik"
            value={form.unit}
            onChange={(v: string) => setForm({ ...form, unit: v })}
            options={[
              { value: "", label: "Tanlang" },
              { value: "DONA", label: "Dona" },
              { value: "KG", label: "Kg" },
              { value: "LIST", label: "List" },
              { value: "LITR", label: "Litr" },
              { value: "BLOK", label: "Blok" },
              { value: "QOP", label: "Qop" },
            ]}
          />

          <FormInput
            label="Boshlang‘ich soni"
            type="number"
            value={form.quantity}
            onChange={(v: string) => setForm({ ...form, quantity: v })}
          />
        </div>

        {/* CATEGORY */}
        <FormSelect
          label="Kategoriya"
          value={form.categoryId}
          onChange={(v: string) => setForm({ ...form, categoryId: v })}
          options={[
            { value: "", label: "Tanlang" },
            ...categories.map(c => ({
              value: c.id,
              label: c.name,
            })),
          ]}
        />

        {/* BUTTON */}
        <button
          onClick={create}
          disabled={loading}
          className="w-full bg-white text-black py-2.5 rounded-xl text-sm font-medium hover:bg-gray-200 transition disabled:opacity-50"
        >
          {loading ? "Saqlanmoqda..." : "Saqlash"}
        </button>
      </div>
    </div>
  );
}

/* ------------------ UI COMPONENTS ------------------ */

function FormInput({
  label,
  value,
  onChange,
  type = "text",
}: any) {
  return (
    <div className="space-y-1">
      <label className="text-xs text-slate-400">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-white/20 transition"
      />
    </div>
  );
}

function FormSelect({
  label,
  value,
  onChange,
  options,
}: any) {
  return (
    <div className="space-y-1">
      <label className="text-xs text-slate-400">
        {label}
      </label>
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-white/20 transition"
      >
        {options.map((o: any) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}
