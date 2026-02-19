"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { api } from "../../../../lib/api";

export default function EditProductPage() {
  const { id } = useParams();
  const router = useRouter();

  const [categories, setCategories] = useState<any[]>([]);
  const [form, setForm] = useState<any>(null);

  const token = localStorage.getItem("token");

  useEffect(() => {
    api.get("/categories").then(res => {
      setCategories(res.data);
    });

    api.get(`/products/${id}`).then(res => {
      setForm(res.data);
    });
  }, []);

  const update = async () => {
    await api.patch(
      `/products/${id}`,
      form,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    router.push("/admin/products");
  };

  if (!form) return <div>Loading...</div>;

  return (
    <div className="max-w-lg">
      <h1 className="text-lg font-semibold mb-6">
        Mahsulotni tahrirlash
      </h1>

      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl border space-y-4">
        <input
          value={form.name}
          onChange={e =>
            setForm({ ...form, name: e.target.value })
          }
          className="w-full border p-2 rounded-lg"
        />

        <input
          value={form.description}
          onChange={e =>
            setForm({
              ...form,
              description: e.target.value,
            })
          }
          className="w-full border p-2 rounded-lg"
        />

        <input
          type="number"
          value={form.price}
          onChange={e =>
            setForm({ ...form, price: e.target.value })
          }
          className="w-full border p-2 rounded-lg"
        />

        <input
          type="number"
          value={form.quantity}
          onChange={e =>
            setForm({
              ...form,
              quantity: e.target.value,
            })
          }
          className="w-full border p-2 rounded-lg"
        />

        <select
          value={form.categoryId}
          onChange={e =>
            setForm({
              ...form,
              categoryId: e.target.value,
            })
          }
          className="w-full border p-2 rounded-lg"
        >
          {categories.map(c => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>

        <button
          onClick={update}
          className="w-full bg-black text-white py-2 rounded-lg"
        >
          Saqlash
        </button>
      </div>
    </div>
  );
}
