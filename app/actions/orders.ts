"use server";

import { redirect } from "next/navigation";
import { revalidatePath, updateTag } from "next/cache";
import type {
  ActionResult,
  CheckoutSession,
  Order,
  OrderItemInput,
  SyncPaymentResult,
} from "@/types";
import { apiFetch } from "@/lib/api/client";
import { ApiError, toActionResult } from "@/lib/api/errors";
import { ORDERS_TAG } from "@/lib/api/orders";
import { PRODUCTS_TAG } from "@/lib/api/products";

function isValidItem(item: OrderItemInput) {
  return Number.isInteger(item.product_id) && Number.isInteger(item.quantity) && item.quantity > 0;
}

/** Una orden nueva descuenta stock y aparece en el historial: invalidamos ambas lecturas. */
function refreshAfterOrderChange() {
  updateTag(PRODUCTS_TAG);
  updateTag(ORDERS_TAG);
  revalidatePath("/orders");
  revalidatePath("/");
}

async function createCheckoutSession(orderId: number) {
  return apiFetch<CheckoutSession>(`/orders/${orderId}/pay`, { method: "POST" });
}

/** Crea la orden con el carrito y manda al usuario a Stripe Checkout. */
export async function checkoutAction(items: OrderItemInput[]): Promise<ActionResult> {
  if (items.length === 0 || !items.every(isValidItem)) {
    return { error: "Tu carrito está vacío o tiene cantidades inválidas." };
  }

  let checkoutUrl: string;
  let orderId: number | null = null;

  try {
    const { data: order } = await apiFetch<{ data: Order }>("/orders", {
      method: "POST",
      body: { items },
    });
    orderId = order.id;
    refreshAfterOrderChange();

    const session = await createCheckoutSession(order.id);
    checkoutUrl = session.checkout_url;
  } catch (error) {
    if (orderId !== null) {
      // La orden ya existe (pendiente): se puede reintentar el pago desde el historial.
      const reason = error instanceof ApiError ? error.message : "error desconocido";
      return {
        error: `Se creó la orden #${orderId}, pero no se pudo iniciar el pago (${reason}). Puedes reintentarlo desde "Mis órdenes".`,
      };
    }
    return toActionResult(error);
  }

  redirect(checkoutUrl);
}

/**
 * Pide a la API que consulte a Stripe el estado del pago y actualice la orden.
 * Lo dispara el usuario desde el frontend (no depende de que llegue el webhook).
 */
export async function syncPaymentAction(orderId: number): Promise<SyncPaymentResult> {
  try {
    const { data: order } = await apiFetch<{ data: Order }>(`/orders/${orderId}/sync-payment`, {
      method: "POST",
    });

    // El estado pudo cambiar: refrescamos las vistas que lo muestran.
    updateTag(ORDERS_TAG);
    revalidatePath("/orders");
    revalidatePath(`/orders/${orderId}`);
    revalidatePath("/checkout/success");

    return { status: order.status };
  } catch (error) {
    return { error: toActionResult(error).error };
  }
}

/** Reintenta el pago de una orden pendiente. */
export async function payOrderAction(orderId: number): Promise<ActionResult> {
  let checkoutUrl: string;
  try {
    checkoutUrl = (await createCheckoutSession(orderId)).checkout_url;
  } catch (error) {
    return toActionResult(error);
  }

  redirect(checkoutUrl);
}
