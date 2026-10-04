"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import type { ActionResult } from "@/types";
import { registerAction } from "@/app/actions/auth";
import { Alert } from "@/components/ui/Alert";
import { TextField } from "@/components/ui/TextField";

export function RegisterForm({ next }: { next?: string }) {
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<ActionResult>({});

  const handleSubmit = (event: React.SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    if (next) formData.set("next", next);

    startTransition(async () => {
      setResult(await registerAction(formData));
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      {result.error && <Alert>{result.error}</Alert>}

      <TextField
        label="Nombre"
        name="name"
        autoComplete="name"
        required
        disabled={isPending}
        errors={result.fieldErrors?.name}
      />
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
        label="Contraseña (mínimo 8 caracteres)"
        name="password"
        type="password"
        autoComplete="new-password"
        required
        minLength={8}
        disabled={isPending}
        errors={result.fieldErrors?.password}
      />
      <TextField
        label="Confirmar contraseña"
        name="password_confirmation"
        type="password"
        autoComplete="new-password"
        required
        disabled={isPending}
        errors={result.fieldErrors?.password_confirmation}
      />

      <button
        type="submit"
        disabled={isPending}
        className="w-full rounded-lg bg-blue-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-800 disabled:opacity-60"
      >
        {isPending ? "Creando cuenta..." : "Crear cuenta"}
      </button>

      <p className="text-center text-sm text-slate-600">
        ¿Ya tienes cuenta?{" "}
        <Link
          href={next ? `/login?next=${encodeURIComponent(next)}` : "/login"}
          className="font-medium text-blue-700 hover:underline"
        >
          Inicia sesión
        </Link>
      </p>
    </form>
  );
}
