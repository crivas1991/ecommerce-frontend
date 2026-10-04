"use client";

import Image from "next/image";
import Link from "next/link";
import { formatPrice } from "@/lib/format";
import { removeFromCart, setQuantity, useCart } from "@/lib/cart-store";

export function CartView() {
  const { items, total } = useCart();

  if (items.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center">
        <p className="text-slate-600">Tu carrito está vacío.</p>
        <Link href="/" className="mt-4 inline-block font-medium text-blue-700 hover:underline">
          Ver catálogo
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
      <ul className="divide-y divide-slate-200 rounded-xl border border-slate-200 bg-white">
        {items.map(({ product, quantity }) => (
          <li key={product.id} className="flex gap-4 p-4">
            <div className="relative h-20 w-24 shrink-0 overflow-hidden rounded-lg bg-slate-100">
              {product.image_url && (
                <Image
                  src={product.image_url}
                  alt={product.name}
                  fill
                  sizes="96px"
                  className="object-cover"
                />
              )}
            </div>

            <div className="flex flex-1 flex-col justify-between gap-2">
              <div className="flex justify-between gap-3">
                <Link href={`/products/${product.id}`} className="font-medium text-slate-900 hover:text-blue-700">
                  {product.name}
                </Link>
                <span className="font-semibold">{formatPrice(product.price * quantity)}</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center rounded-lg border border-slate-300">
                  <button
                    type="button"
                    aria-label={`Quitar una unidad de ${product.name}`}
                    onClick={() => setQuantity(product.id, quantity - 1)}
                    className="px-3 py-1 text-slate-600 hover:bg-slate-100"
                  >
                    −
                  </button>
                  <span className="min-w-8 text-center text-sm" aria-live="polite">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    aria-label={`Agregar una unidad de ${product.name}`}
                    onClick={() => setQuantity(product.id, quantity + 1)}
                    disabled={quantity >= product.stock}
                    className="px-3 py-1 text-slate-600 hover:bg-slate-100 disabled:opacity-40"
                  >
                    +
                  </button>
                </div>
                <button
                  type="button"
                  onClick={() => removeFromCart(product.id)}
                  className="inline-flex items-center gap-1 text-sm text-red-600 hover:underline"
                >
                  <svg
                    aria-hidden
                    viewBox="0 0 20 20"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2.5}
                    strokeLinecap="round"
                    className="size-3.5"
                  >
                    <path d="M5 5l10 10M15 5L5 15" />
                  </svg>
                  Quitar
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>

      <aside className="h-fit space-y-4 rounded-xl border border-slate-200 bg-white p-5">
        <h2 className="font-semibold text-slate-900">Resumen</h2>
        <div className="flex justify-between text-sm text-slate-600">
          <span>Subtotal</span>
          <span>{formatPrice(total)}</span>
        </div>
        <div className="flex justify-between border-t border-slate-200 pt-3 text-lg font-bold">
          <span>Total</span>
          <span>{formatPrice(total)}</span>
        </div>
        <Link
          href="/checkout"
          className="block rounded-lg bg-blue-700 px-4 py-2.5 text-center text-sm font-semibold text-white transition hover:bg-blue-800"
        >
          Continuar al pago
        </Link>
      </aside>
    </div>
  );
}
