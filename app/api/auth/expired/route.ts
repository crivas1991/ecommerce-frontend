import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { clearSession, safeRedirectPath } from "@/lib/session";

/**
 * Sesión vencida o revocada: una página (Server Component) no puede borrar cookies,
 * así que redirige aquí para eliminar la cookie httpOnly obsoleta y mandar al login.
 */
export async function GET(request: NextRequest) {
  await clearSession();

  const next = safeRedirectPath(request.nextUrl.searchParams.get("next"));
  const loginUrl = new URL("/login", request.url);
  if (next !== "/") loginUrl.searchParams.set("next", next);

  return NextResponse.redirect(loginUrl);
}
