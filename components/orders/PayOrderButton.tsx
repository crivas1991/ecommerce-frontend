"use client";

import { useState, useTransition } from "react";
import type { ActionResult } from "@/types";
import { payOrderAction } from "@/app/actions/orders";

export function PayOrderButton({ orderId }: { orderId: number }) {
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<ActionResult>({});

  const handleSubmit = (event: React.SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    startTransition(async () => {
      setResult(await payOrderAction(orderId));
    });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col items-end gap-1">
      <button
        type="submit"
        disabled={isPending}
        className="rounded-lg bg-blue-700 px-3 py-1.5 text-sm font-semibold text-white transition hover:bg-blue-800 disabled:opacity-60"
      >
        {isPending ? "Redirigiendo..." : "Pagar ahora"}
      </button>
      {result.error && <p className="text-xs text-red-600">{result.error}</p>}
    </form>
  );
}
