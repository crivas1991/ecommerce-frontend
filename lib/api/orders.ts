import "server-only";
import type { Order, Paginated } from "@/types";
import { apiFetch } from "./client";

export const ORDERS_TAG = "orders";
export const ORDERS_PER_PAGE = 5;

/** Historial del usuario autenticado (GET /orders/user/{id}). */
export function getOrdersByUser(userId: number, page = 1) {
  return apiFetch<Paginated<Order>>(
    `/orders/user/${userId}?per_page=${ORDERS_PER_PAGE}&page=${page}`,
    { cache: "no-store" },
  );
}

/** Detalle de una orden; la API solo lo permite al dueño (403 en otro caso). */
export async function getOrder(id: number) {
  const { data } = await apiFetch<{ data: Order }>(`/orders/${id}`, { cache: "no-store" });
  return data;
}
