"use client";

import { api } from "../lib/api";

export default function OrderDetailModal({
  order,
  onClose,
}: any) {
  if (!order) return null;

  const updateStatus = async (status: string) => {
    const token = localStorage.getItem("token");

    await api.patch(
      `/orders/${order.id}/status`,
      { status },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    window.location.reload();
  };

  const download = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const res = await api.get(
      `/export/order/${order.id}`,
      {
        headers: { Authorization: `Bearer ${token}` },
        responseType: "blob",
      }
    );

    const blob = new Blob([res.data]);
    const link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    link.download = `order-${order.orderNumber}.xlsx`;
    link.click();
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-end md:items-center justify-center z-50">
      
      <div className="w-full md:max-w-xl bg-slate-900 border border-slate-800 rounded-t-2xl md:rounded-2xl p-6 space-y-6 max-h-[90vh] overflow-y-auto">

        {/* HEADER */}
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-white">
            {order.orderNumber}
          </h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition"
          >
            ✕
          </button>
        </div>

        {/* CLIENT INFO */}
        <div className="text-sm text-slate-300 space-y-1 bg-slate-950 p-4 rounded-xl border border-slate-800">
          <p><span className="text-slate-400">Mijoz:</span> {order.clientName}</p>
          <p><span className="text-slate-400">Telefon:</span> {order.clientPhone}</p>
          <p><span className="text-slate-400">Do'kon:</span> {order.storeName}</p>
          <p><span className="text-slate-400">Manzil:</span> {order.address}</p>
          <p><span className="text-slate-400">Agent:</span> {order.agent.name}</p>
        </div>

        {/* MAP */}
        {order.lat && order.lng && (
          <a
            href={`https://www.google.com/maps?q=${order.lat},${order.lng}`}
            target="_blank"
            className="block text-blue-400 hover:text-blue-300 text-sm transition"
          >
            📍 Xaritada ko‘rish
          </a>
        )}

        {/* ITEMS */}
        <div>
          <h3 className="text-white font-medium mb-3">
            Mahsulotlar
          </h3>

          <div className="space-y-3">
            {order.items?.map((item: any) => (
              <div
                key={item.id}
                className="flex justify-between items-center bg-slate-950 p-3 rounded-lg border border-slate-800"
              >
                <div className="text-sm text-slate-300">
                  {item.product?.name}
                </div>

                <div className="text-sm text-slate-400">
                  {item.quantity} × {item.price}{" "}
                  {item.product?.currency === "USD" ? "$" : "so'm"}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* TOTAL */}
        <div className="text-right space-y-1 text-sm">
          {order.totalUZS > 0 && (
            <div className="text-slate-300">
              Jami: <span className="text-white font-semibold">{order.totalUZS} so'm</span>
            </div>
          )}

          {order.totalUSD > 0 && (
            <div className="text-slate-300">
              Jami: <span className="text-white font-semibold">{order.totalUSD} $</span>
            </div>
          )}
        </div>

        {/* DOWNLOAD */}
        <button
          onClick={download}
          className="w-full bg-slate-800 hover:bg-slate-700 text-white py-2 rounded-xl text-sm transition"
        >
          Excel yuklash
        </button>

        {/* STATUS UPDATE */}
        <div className="pt-4 border-t border-slate-800 space-y-2">

          <div className="grid grid-cols-3 gap-2">

            <button
              onClick={() => updateStatus("PROCESSING")}
              className="bg-blue-600 hover:bg-blue-500 text-white py-2 rounded-lg text-xs transition"
            >
              Jarayonda
            </button>

            <button
              onClick={() => updateStatus("COMPLETED")}
              className="bg-green-600 hover:bg-green-500 text-white py-2 rounded-lg text-xs transition"
            >
              Yakunlangan
            </button>

            <button
              onClick={() => updateStatus("CANCELED")}
              className="bg-red-600 hover:bg-red-500 text-white py-2 rounded-lg text-xs transition"
            >
              Bekor
            </button>

          </div>

        </div>

      </div>
    </div>
  );
}
