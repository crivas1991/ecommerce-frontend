"use client";

import { useEffect } from "react";
import Link from "next/link";

interface ErrorFallbackProps {
  error: Error & { digest?: string };
  retry: () => void;
  title?: string;
}

/** UI común para los error.tsx de cada segmento. */
export function ErrorFallback({ error, retry, title = "Algo salió mal" }: ErrorFallbackProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="mx-auto max-w-md space-y-4 rounded-xl border border-red-200 bg-red-50 p-8 text-center">
      <h2 className="text-lg font-bold text-red-800">{title}</h2>
      <p className="text-sm text-red-700">
        No pudimos cargar esta sección. Revisa que la API esté disponible e inténtalo de nuevo.
      </p>
      <div className="flex justify-center gap-3">
        <button
          type="button"
          onClick={retry}
          className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
        >
          Reintentar
        </button>
        <Link href="/" className="rounded-lg border border-red-300 px-4 py-2 text-sm text-red-700 hover:bg-red-100">
          Ir al inicio
        </Link>
      </div>
    </div>
  );
}
