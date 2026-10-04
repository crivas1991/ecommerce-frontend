import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { LoginForm } from "@/components/auth/LoginForm";
import { firstParam } from "@/lib/format";
import { getCurrentUser, safeRedirectPath } from "@/lib/session";

export const metadata: Metadata = { title: "Iniciar sesión" };

export default async function LoginPage({ searchParams }: PageProps<"/login">) {
  const next = safeRedirectPath(firstParam((await searchParams).next));

  // Si ya hay una sesión válida no tiene sentido mostrar el formulario.
  if (await getCurrentUser()) redirect(next);

  return (
    <div className="mx-auto max-w-md space-y-6 rounded-xl border border-slate-200 bg-white p-8">
      <div className="space-y-1 text-center">
        <h1 className="text-2xl font-bold">Iniciar sesión</h1>
        <p className="text-sm text-slate-600">Ingresa para ver tus órdenes y completar tu compra.</p>
      </div>
      <LoginForm next={next === "/" ? undefined : next} />
    </div>
  );
}
