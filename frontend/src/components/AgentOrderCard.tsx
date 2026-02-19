import Link from "next/link";

export default function AgentOrderCard({ order }: any) {
  return (
    <Link
      href={`/agent/orders/${order.id}`}
      className="block bg-slate-900 border border-slate-800 p-4 rounded-xl border"
    >
      <div className="flex justify-between">
        <div>
          <p className="font-medium">{order.orderNumber}</p>
          <p className="text-sm text-gray-500">
            {order.clientName}
          </p>
        </div>

        <div className="text-right">
          <p className="font-semibold">
            {order.totalUZS} so'm
          </p>
          {order.totalUSD > 0 && (
            <p className="text-sm text-gray-500">
              ${order.totalUSD}
            </p>
          )}
        </div>
      </div>
    </Link>
  );
}
