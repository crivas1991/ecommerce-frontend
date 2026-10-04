import type { OrderStatus } from "@/types";

const config: Record<OrderStatus, { label: string; className: string }> = {
  pending: { label: "Pendiente de pago", className: "bg-amber-100 text-amber-800" },
  paid: { label: "Pagada", className: "bg-emerald-100 text-emerald-800" },
  failed: { label: "Pago fallido", className: "bg-red-100 text-red-800" },
};

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  const { label, className } = config[status] ?? {
    label: status,
    className: "bg-slate-100 text-slate-700",
  };
  return (
    <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${className}`}>{label}</span>
  );
}
