import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AddToCartButton } from "@/components/products/AddToCartButton";
import { ApiError } from "@/lib/api/errors";
import { getProduct } from "@/lib/api/products";
import { formatPrice, toPositiveInt } from "@/lib/format";

async function loadProduct(rawId: string) {
  const id = toPositiveInt(rawId, 0);
  if (id === 0) notFound();

  try {
    return await getProduct(id);
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) notFound();
    throw error; // lo captura error.tsx
  }
}

export async function generateMetadata({ params }: PageProps<"/products/[id]">): Promise<Metadata> {
  const { id } = await params;
  try {
    const product = await getProduct(toPositiveInt(id, 0));
    return {
      title: product.name,
      description: product.description ?? `Compra ${product.name} en CARC STORE.`,
    };
  } catch {
    return { title: "Producto" };
  }
}

export default async function ProductPage({ params }: PageProps<"/products/[id]">) {
  const { id } = await params;
  const product = await loadProduct(id);

  return (
    <div className="space-y-6">
      <Link href="/" className="text-sm text-blue-700 hover:underline">
        ← Volver al catálogo
      </Link>

      <article className="grid gap-8 rounded-xl border border-slate-200 bg-white p-6 md:grid-cols-2">
        <div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-slate-100">
          {product.image_url && (
            <Image
              src={product.image_url}
              alt={product.name}
              fill
              sizes="(min-width: 768px) 50vw, 100vw"
              className="object-cover"
              priority
            />
          )}
        </div>

        <div className="flex flex-col gap-4">
          <h1 className="text-3xl font-bold tracking-tight">{product.name}</h1>
          <p className="text-3xl font-bold text-blue-700">{formatPrice(product.price)}</p>
          <p className="whitespace-pre-line text-slate-600">
            {product.description ?? "Este producto no tiene descripción."}
          </p>
          <p className={`text-sm ${product.stock > 0 ? "text-emerald-700" : "text-red-600"}`}>
            {product.stock > 0 ? `${product.stock} unidades en stock` : "Agotado"}
          </p>
          <div className="mt-auto max-w-xs">
            <AddToCartButton product={product} />
          </div>
        </div>
      </article>
    </div>
  );
}
