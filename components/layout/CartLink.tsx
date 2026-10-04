"use client";

import Link from "next/link";
import { useCart } from "@/lib/cart-store";

export function CartLink() {
  const { count } = useCart();

  return (
    <Link href="/cart" className="relative hover:text-blue-700">
      Carrito
      {count > 0 && (
        <span
          aria-label={`${count} productos en el carrito`}
          className="ml-1.5 inline-flex min-w-5 items-center justify-center rounded-full bg-blue-700 px-1.5 text-xs font-semibold text-white"
        >
          {count}
        </span>
      )}
    </Link>
  );
}
