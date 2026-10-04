import { ProductGridSkeleton } from "@/components/products/ProductGrid";

export default function Loading() {
  return (
    <div className="space-y-8">
      <div className="h-9 w-48 animate-pulse rounded bg-slate-200" />
      <ProductGridSkeleton />
    </div>
  );
}
