"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { api } from "../../../../lib/api";

export default function OrderDetailPage() {
  const { id } = useParams();
  const [order, setOrder] = useState<any>(null);

  const token = localStorage.getItem("token");

  useEffect(() => {
    api.get(`/orders/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => setOrder(res.data));
  }, [id]);


  const download = async (url: string, filename: string) => {
    const token = localStorage.getItem("token");

    const res = await api.get(url, {
      headers: { Authorization: `Bearer ${token}` },
      responseType: "blob",
    });

    const blob = new Blob([res.data]);
    const link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    link.download = filename;
    link.click();
  };



  const updateStatus = async (status: string) => {
    await api.patch(
      `/orders/${id}/status`,
      { status },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    window.location.reload();
  };

  if (!order) return <div>Yuklanmoqda...</div>;

  return (
    <div className="space-y-4">

      <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl border space-y-2">
        <h1 className="text-lg font-semibold">
          {order.orderNumber}
        </h1>

        <p><b>Mijoz:</b> {order.clientName}</p>
        <p><b>Telefon:</b> {order.clientPhone}</p>
        <p><b>Do'kon:</b> {order.storeName}</p>
        <p><b>Manzil:</b> {order.address}</p>
        <p><b>Agent:</b> {order.agent.name}</p>
        <p><b>Status:</b> {order.status}</p>

        {order.lat && (
          <a
            href={`https://www.google.com/maps?q=${order.lat},${order.lng}`}
            target="_blank"
            className="text-blue-600 text-sm"
          >
            Xaritada ko‘rish
          </a>
        )}
      </div>

      <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl border">
        <h2 className="font-medium mb-3">Mahsulotlar</h2>

        <div className="space-y-2">
          {order.items.map((item: any) => (
            <div
              key={item.id}
              className="flex justify-between border-b pb-1"
            >
              <div>
                {item.product?.name}
                <div className="text-xs text-gray-500">
                  {item.quantity} {item.product?.unit}
                </div>
              </div>

              <div className="text-right">
                {item.product?.currency === "USD"
                  ? `$${item.price}`
                  : `${item.price} so'm`}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl border text-right space-y-1">
        <div className="font-semibold">
          Jami so'm: {order.totalUZS}
        </div>
        {order.totalUSD > 0 && (
          <div className="font-semibold">
            Jami USD: ${order.totalUSD}
          </div>
        )}
      </div>

      <div className="grid grid-cols-3 gap-2">
        <button
          onClick={() => updateStatus("PROCESSING")}
          className="bg-blue-600 text-white py-2 rounded-lg text-sm"
        >
          Jarayonda
        </button>

        <button
          onClick={() => updateStatus("COMPLETED")}
          className="bg-green-600 text-white py-2 rounded-lg text-sm"
        >
          Yakunlangan
        </button>

        <button
          onClick={() => updateStatus("CANCELED")}
          className="bg-red-600 text-white py-2 rounded-lg text-sm"
        >
          Bekor
        </button>
      </div>

      <button
        onClick={() =>
          download(`/export/order/${order.id}`,
            `order-${order.orderNumber}.xlsx`
          )
        }
        className="w-full bg-black text-white py-3 rounded-xl"
      >
        Excel yuklash
      </button>




    </div>
  );
}
