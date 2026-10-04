"use client";

import { useState } from "react";
import type { Product } from "@/types";
import { addToCart, useCart } from "@/lib/cart-store";

export function AddToCartButton({ product }: { product: Product }) {
  const { items } = useCart();
  const [justAdded, setJustAdded] = useState(false);

  const inCart = items.find((item) => item.product.id === product.id)?.quantity ?? 0;
  const soldOut = product.stock <= 0;
  const maxReached = inCart >= product.stock;

  const handleClick = () => {
    addToCart(
      {
        id: product.id,
        name: product.name,
        price: product.price,
        image_url: product.image_url,
        stock: product.stock,
      },
      1,
    );
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1200);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={soldOut || maxReached}
      className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-blue-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:bg-slate-300"
    >
      {!soldOut && !maxReached && !justAdded && (
        <svg
          aria-hidden
          viewBox="0 0 20 20"
          fill="none"
          stroke="currentColor"
          strokeWidth={2.5}
          strokeLinecap="round"
          className="size-4"
        >
          <path d="M10 4v12M4 10h12" />
        </svg>
      )}
      {soldOut
        ? "Agotado"
        : maxReached
          ? "Máximo en el carrito"
          : justAdded
            ? "¡Agregado!"
            : "Agregar al carrito"}
    </button>
  );
}
