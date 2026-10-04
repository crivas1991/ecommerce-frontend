import type { Metadata } from "next";
import { formatDate } from "@/lib/format";
import { requireUser } from "@/lib/session";

export const metadata: Metadata = { title: "Mi perfil" };

export default async function ProfilePage() {
  const user = await requireUser("/profile");

  const fields = [
    { label: "Nombre", value: user.name },
    { label: "Correo electrónico", value: user.email },
    { label: "Estado de la cuenta", value: user.is_active === false ? "Inactiva" : "Activa" },
    ...(user.created_at
      ? [{ label: "Miembro desde", value: formatDate(user.created_at) }]
      : []),
  ];

  return (
    <div className="mx-auto max-w-xl space-y-6">
      <div className="flex items-center gap-4">
        <div
          aria-hidden
          className="flex size-16 items-center justify-center rounded-full bg-blue-700 text-2xl font-bold text-white"
        >
          {user.name.charAt(0).toUpperCase()}
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Mi perfil</h1>
          <p className="text-slate-600">Datos de tu cuenta</p>
        </div>
      </div>

      <dl className="divide-y divide-slate-100 rounded-xl border border-slate-200 bg-white">
        {fields.map(({ label, value }) => (
          <div key={label} className="flex justify-between gap-4 px-5 py-4 text-sm">
            <dt className="text-slate-500">{label}</dt>
            <dd className="text-right font-medium text-slate-900">{value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
