"use client";

import { useState, useTransition } from "react";
import type { SyncPaymentResult } from "@/types";
import { syncPaymentAction } from "@/app/actions/orders";

const messages = {
  paid: "¡Pago confirmado!",
  pending: "Stripe aún no registra el pago.",
  failed: "El pago no se completó.",
} as const;

export function SyncPaymentButton({ orderId }: { orderId: number }) {
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<SyncPaymentResult>({});

  const handleSubmit = (event: React.SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    startTransition(async () => {
      setResult(await syncPaymentAction(orderId));
    });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col items-end gap-1">
      <button
        type="submit"
        disabled={isPending}
        className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 transition hover:bg-slate-100 disabled:opacity-60"
      >
        {isPending ? "Consultando..." : "Consultar estado del pago"}
      </button>
      <p role="status" className="min-h-4 text-xs text-slate-600">
        {result.error ? (
          <span className="text-red-600">{result.error}</span>
        ) : (
          result.status && messages[result.status]
        )}
      </p>
    </form>
  );
}
