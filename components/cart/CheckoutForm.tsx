"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import type { ActionResult } from "@/types";
import { checkoutAction } from "@/app/actions/orders";
import { Alert } from "@/components/ui/Alert";
import { formatPrice } from "@/lib/format";
import { useCart } from "@/lib/cart-store";

export function CheckoutForm() {
  const { items, total } = useCart();
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<ActionResult>({});

  if (items.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center">
        <p className="text-slate-600">No hay productos para pagar.</p>
        <Link href="/" className="mt-4 inline-block font-medium text-blue-700 hover:underline">
          Ir al catálogo
        </Link>
      </div>
    );
  }

  const handleSubmit = (event: React.SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    const payload = items.map((item) => ({
      product_id: item.product.id,
      quantity: item.quantity,
    }));

    startTransition(async () => {
      // Si todo sale bien la Server Action redirige a Stripe Checkout y no vuelve aquí.
      setResult(await checkoutAction(payload));
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5 rounded-xl border border-slate-200 bg-white p-6">
      {result.error && <Alert>{result.error}</Alert>}

      <ul className="divide-y divide-slate-100">
        {items.map(({ product, quantity }) => (
          <li key={product.id} className="flex justify-between gap-4 py-3 text-sm">
            <span className="text-slate-700">
              {product.name} <span className="text-slate-400">× {quantity}</span>
            </span>
            <span className="font-medium">{formatPrice(product.price * quantity)}</span>
          </li>
        ))}
      </ul>

      <div className="flex justify-between border-t border-slate-200 pt-4 text-lg font-bold">
        <span>Total</span>
        <span>{formatPrice(total)}</span>
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="w-full rounded-lg bg-blue-700 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-800 disabled:opacity-60"
      >
        {isPending ? "Creando orden y redirigiendo a Stripe..." : "Pagar con Stripe"}
      </button>
      <p className="text-center text-xs text-slate-500">
        Se creará tu orden y te llevaremos a la pasarela segura de Stripe.
      </p>
    </form>
  );
}
