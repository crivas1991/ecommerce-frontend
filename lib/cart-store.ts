"use client";

import { useSyncExternalStore } from "react";
import type { CartItem, CartProduct } from "@/types";

/**
 * Carrito en estado local (localStorage) expuesto con useSyncExternalStore:
 * sin Context, sin efectos y sin errores de hidratación (el servidor ve siempre []).
 */
const STORAGE_KEY = "ecommerce-cart";
const EMPTY: CartItem[] = [];

const listeners = new Set<() => void>();
let cachedRaw: string | null = null;
let cachedItems: CartItem[] = EMPTY;

function readItems(): CartItem[] {
  let raw: string | null = null;
  try {
    raw = localStorage.getItem(STORAGE_KEY);
  } catch {
    return cachedItems;
  }
  if (raw === cachedRaw) return cachedItems;

  cachedRaw = raw;
  try {
    const parsed: unknown = raw ? JSON.parse(raw) : [];
    cachedItems = Array.isArray(parsed) && parsed.length > 0 ? (parsed as CartItem[]) : EMPTY;
  } catch {
    cachedItems = EMPTY;
  }
  return cachedItems;
}

function writeItems(items: CartItem[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    // Sin localStorage (modo privado, cuota llena): el carrito sigue en memoria.
  }
  cachedRaw = JSON.stringify(items);
  cachedItems = items.length > 0 ? items : EMPTY;
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  const onStorage = (event: StorageEvent) => {
    if (event.key === STORAGE_KEY) listener(); // cambios desde otra pestaña
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

export function addToCart(product: CartProduct, quantity = 1) {
  const items = readItems();
  const existing = items.find((item) => item.product.id === product.id);
  const current = existing?.quantity ?? 0;
  const next = Math.min(current + quantity, product.stock);
  if (next <= 0) return;

  writeItems(
    existing
      ? items.map((item) =>
          item.product.id === product.id ? { product, quantity: next } : item,
        )
      : [...items, { product, quantity: next }],
  );
}

export function setQuantity(productId: number, quantity: number) {
  const items = readItems();
  writeItems(
    items
      .map((item) =>
        item.product.id === productId
          ? { ...item, quantity: Math.min(quantity, item.product.stock) }
          : item,
      )
      .filter((item) => item.quantity > 0),
  );
}

export function removeFromCart(productId: number) {
  writeItems(readItems().filter((item) => item.product.id !== productId));
}

export function clearCart() {
  writeItems([]);
}

export function useCart() {
  const items = useSyncExternalStore(subscribe, readItems, () => EMPTY);
  const count = items.reduce((sum, item) => sum + item.quantity, 0);
  const total = items.reduce((sum, item) => sum + item.quantity * item.product.price, 0);
  return { items, count, total };
}
