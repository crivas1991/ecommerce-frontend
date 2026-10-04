import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { RegisterForm } from "@/components/auth/RegisterForm";
import { firstParam } from "@/lib/format";
import { getCurrentUser, safeRedirectPath } from "@/lib/session";

export const metadata: Metadata = { title: "Crear cuenta" };

export default async function RegisterPage({ searchParams }: PageProps<"/register">) {
  const next = safeRedirectPath(firstParam((await searchParams).next));

  if (await getCurrentUser()) redirect(next);

  return (
    <div className="mx-auto max-w-md space-y-6 rounded-xl border border-slate-200 bg-white p-8">
      <div className="space-y-1 text-center">
        <h1 className="text-2xl font-bold">Crear cuenta</h1>
        <p className="text-sm text-slate-600">Regístrate para comprar en la tienda.</p>
      </div>
      <RegisterForm next={next === "/" ? undefined : next} />
    </div>
  );
}
