import { Suspense } from "react";
import { ProductGrid, ProductGridSkeleton } from "@/components/products/ProductGrid";
import { firstParam, toPositiveInt } from "@/lib/format";

export default async function CatalogPage({ searchParams }: PageProps<"/">) {
  const params = await searchParams;
  const search = firstParam(params.search)?.trim() || undefined;
  const page = toPositiveInt(firstParam(params.page));

  return (
    <div className="space-y-8">
      <section className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Catálogo</h1>
          <p className="text-slate-600">Encuentra lo que buscas y paga de forma segura.</p>
        </div>

        {/* Formulario GET nativo: no necesita JavaScript en el cliente. */}
        <form action="/" role="search" className="flex gap-2">
          <input
            type="search"
            name="search"
            defaultValue={search}
            placeholder="Buscar productos..."
            aria-label="Buscar productos"
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-200 sm:w-64"
          />
          <button
            type="submit"
            className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-700"
          >
            Buscar
          </button>
        </form>
      </section>

      {/* La key reinicia el Suspense (y muestra el skeleton) al cambiar búsqueda o página. */}
      <Suspense key={`${search ?? ""}-${page}`} fallback={<ProductGridSkeleton />}>
        <ProductGrid search={search} page={page} />
      </Suspense>
    </div>
  );
}
