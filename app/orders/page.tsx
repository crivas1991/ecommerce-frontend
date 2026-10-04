import type { Metadata } from "next";
import { Suspense } from "react";
import { OrdersList, OrdersListSkeleton } from "@/components/orders/OrdersList";
import { firstParam, toPositiveInt } from "@/lib/format";

export const metadata: Metadata = { title: "Mis órdenes" };

export default async function OrdersPage({ searchParams }: PageProps<"/orders">) {
  const page = toPositiveInt(firstParam((await searchParams).page));

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Historial de compras</h1>
      <Suspense key={page} fallback={<OrdersListSkeleton />}>
        <OrdersList page={page} />
      </Suspense>
    </div>
  );
}
