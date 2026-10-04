import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ClearCartOnMount } from "@/components/cart/ClearCartOnMount";
import { OrderStatusBadge } from "@/components/orders/OrderStatusBadge";
import { SyncPaymentButton } from "@/components/orders/SyncPaymentButton";
import { Alert } from "@/components/ui/Alert";
import { ApiError } from "@/lib/api/errors";
import { getOrder } from "@/lib/api/orders";
import { firstParam, formatPrice, toPositiveInt } from "@/lib/format";
import { requireUser } from "@/lib/session";

export const metadata: Metadata = { title: "Confirmación de compra" };

export default async function CheckoutSuccessPage({
  searchParams,
}: PageProps<"/checkout/success">) {
  const orderId = toPositiveInt(firstParam((await searchParams).order_id), 0);
  await requireUser(`/checkout/success?order_id=${orderId}`);
  if (orderId === 0) notFound();

  let order;
  try {
    order = await getOrder(orderId);
  } catch (error) {
    if (error instanceof ApiError && (error.status === 404 || error.status === 403)) notFound();
    throw error;
  }

  const isPaid = order.status === "paid";

  return (
    <div className="mx-auto max-w-xl space-y-6 text-center">
      <ClearCartOnMount />

      <div className="space-y-2">
        <p className="text-5xl">{isPaid ? "✅" : "⏳"}</p>
        <h1 className="text-3xl font-bold tracking-tight">
          {isPaid ? "¡Compra confirmada!" : "Estamos confirmando tu pago"}
        </h1>
        <p className="text-slate-600">
          Orden #{order.id} · <OrderStatusBadge status={order.status} />
        </p>
      </div>

      {!isPaid && (
        <div className="space-y-3">
          <Alert variant="info">
            Stripe notifica el pago a la API mediante un webhook y puede tardar unos segundos. Si
            ya pagaste, consulta el estado para que la API lo verifique con Stripe.
          </Alert>
          <div className="flex justify-center">
            <SyncPaymentButton orderId={order.id} />
          </div>
        </div>
      )}

      <ul className="divide-y divide-slate-100 rounded-xl border border-slate-200 bg-white text-left">
        {order.items?.map((item) => (
          <li key={item.id} className="flex justify-between gap-4 px-5 py-3 text-sm">
            <span>
              {item.product_name ?? `Producto #${item.product_id}`}{" "}
              <span className="text-slate-400">× {item.quantity}</span>
            </span>
            <span className="font-medium">{formatPrice(item.subtotal, order.currency)}</span>
          </li>
        ))}
        <li className="flex justify-between px-5 py-3 font-bold">
          <span>Total</span>
          <span>{formatPrice(order.total, order.currency)}</span>
        </li>
      </ul>

      <div className="flex justify-center gap-3">
        <Link
          href="/orders"
          className="rounded-lg bg-blue-700 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-800"
        >
          Ver mis órdenes
        </Link>
        <Link
          href="/"
          className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium hover:bg-slate-100"
        >
          Seguir comprando
        </Link>
      </div>
    </div>
  );
}
