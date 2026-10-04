import { OrdersListSkeleton } from "@/components/orders/OrdersList";

export default function Loading() {
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="h-9 w-64 animate-pulse rounded bg-slate-200" />
      <OrdersListSkeleton />
    </div>
  );
}
