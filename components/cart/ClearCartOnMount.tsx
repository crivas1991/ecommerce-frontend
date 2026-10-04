"use client";

import { useEffect } from "react";
import { clearCart } from "@/lib/cart-store";

/** Vacía el carrito al llegar a la confirmación de compra. No renderiza nada. */
export function ClearCartOnMount() {
  useEffect(() => {
    clearCart();
  }, []);
  return null;
}
