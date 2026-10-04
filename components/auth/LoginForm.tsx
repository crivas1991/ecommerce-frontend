"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import type { ActionResult } from "@/types";
import { loginAction } from "@/app/actions/auth";
import { Alert } from "@/components/ui/Alert";
import { TextField } from "@/components/ui/TextField";

export function LoginForm({ next }: { next?: string }) {
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<ActionResult>({});

  const handleSubmit = (event: React.SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    if (next) formData.set("next", next);

    startTransition(async () => {
      setResult(await loginAction(formData));
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      {result.error && <Alert>{result.error}</Alert>}

      <TextField
        label="Correo electrónico"
        name="email"
        type="email"
        autoComplete="email"
        required
        disabled={isPending}
        errors={result.fieldErrors?.email}
      />
      <TextField
        label="Contraseña"
        name="password"
        type="password"
        autoComplete="current-password"
        required
        disabled={isPending}
        errors={result.fieldErrors?.password}
      />

      <button
        type="submit"
        disabled={isPending}
        className="w-full rounded-lg bg-blue-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-800 disabled:opacity-60"
      >
        {isPending ? "Ingresando..." : "Iniciar sesión"}
      </button>

      <p className="text-center text-sm text-slate-600">
        ¿No tienes cuenta?{" "}
        <Link
          href={next ? `/register?next=${encodeURIComponent(next)}` : "/register"}
          className="font-medium text-blue-700 hover:underline"
        >
          Regístrate
        </Link>
      </p>
    </form>
  );
}
