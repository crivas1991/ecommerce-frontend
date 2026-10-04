import Link from "next/link";
import { logoutAction } from "@/app/actions/auth";
import { getCurrentUser } from "@/lib/session";

export async function UserMenu() {
  const user = await getCurrentUser();

  if (!user) {
    return (
      <div className="flex items-center gap-3">
        <Link href="/login" className="hover:text-blue-700">
          Ingresar
        </Link>
        <Link
          href="/register"
          className="rounded-lg bg-blue-700 px-3 py-1.5 text-white transition hover:bg-blue-800"
        >
          Registrarse
        </Link>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-4">
      <Link href="/orders" className="hover:text-blue-700">
        Mis órdenes
      </Link>
      <Link
        href="/profile"
        title="Mi perfil"
        className="hidden text-slate-500 hover:text-blue-700 sm:inline"
      >
        {user.name}
      </Link>
      <form action={logoutAction}>
        <button type="submit" className="text-slate-500 hover:text-red-600">
          Salir
        </button>
      </form>
    </div>
  );
}
