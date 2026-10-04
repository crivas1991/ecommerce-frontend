import { getProducts } from "@/lib/api/products";
import { Pagination } from "@/components/ui/Pagination";
import { ProductCard } from "./ProductCard";

interface ProductGridProps {
  search?: string;
  page: number;
}

/** Server Component async: hace el fetch en el servidor y se envuelve en <Suspense> en la página. */
export async function ProductGrid({ search, page }: ProductGridProps) {
  const { data: products, meta } = await getProducts({ search, page });

  if (products.length === 0) {
    return (
      <p className="rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center text-slate-500">
        {search ? `No encontramos productos para "${search}".` : "Aún no hay productos disponibles."}
      </p>
    );
  }

  return (
    <div className="space-y-8">
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {products.map((product, index) => (
          <ProductCard key={product.id} product={product} priority={index < 4} />
        ))}
      </div>
      <Pagination
        basePath="/"
        page={meta.current_page}
        lastPage={meta.last_page}
        params={{ search }}
      />
    </div>
  );
}

export function ProductGridSkeleton() {
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4" aria-hidden>
      {Array.from({ length: 8 }, (_, i) => (
        <div key={i} className="overflow-hidden rounded-xl border border-slate-200 bg-white">
          <div className="aspect-[4/3] animate-pulse bg-slate-200" />
          <div className="space-y-3 p-4">
            <div className="h-4 w-3/4 animate-pulse rounded bg-slate-200" />
            <div className="h-5 w-1/3 animate-pulse rounded bg-slate-200" />
            <div className="h-9 animate-pulse rounded-lg bg-slate-200" />
          </div>
        </div>
      ))}
    </div>
  );
}
