import Link from "next/link";

interface PaginationProps {
  basePath: string;
  page: number;
  lastPage: number;
  params?: Record<string, string | undefined>;
}

export function Pagination({ basePath, page, lastPage, params = {} }: PaginationProps) {
  if (lastPage <= 1) return null;

  const hrefFor = (target: number) => {
    const query = new URLSearchParams();
    for (const [key, value] of Object.entries(params)) {
      if (value) query.set(key, value);
    }
    if (target > 1) query.set("page", String(target));
    const qs = query.toString();
    return qs ? `${basePath}?${qs}` : basePath;
  };

  const linkClass =
    "rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50";
  const disabledClass =
    "cursor-not-allowed rounded-lg border border-slate-200 bg-slate-100 px-3 py-1.5 text-sm text-slate-600";

  return (
    <nav aria-label="Paginación" className="flex items-center justify-center gap-3">
      {page > 1 ? (
        <Link href={hrefFor(page - 1)} className={linkClass}>
          ← Anterior
        </Link>
      ) : (
        <span className={disabledClass}>← Anterior</span>
      )}
      <span className="text-sm text-slate-600">
        Página {page} de {lastPage}
      </span>
      {page < lastPage ? (
        <Link href={hrefFor(page + 1)} className={linkClass}>
          Siguiente →
        </Link>
      ) : (
        <span className={disabledClass}>Siguiente →</span>
      )}
    </nav>
  );
}
