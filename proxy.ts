import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { PROTECTED_PATHS, TOKEN_COOKIE } from "@/lib/constants";

/**
 * Primera barrera: si no hay cookie de sesión, las rutas protegidas redirigen a /login.
 * Es solo una comprobación rápida; la validez real del token la verifica la API
 * (getCurrentUser / requireUser) en cada página protegida.
 */
export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const isProtected = PROTECTED_PATHS.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`),
  );

  if (isProtected && !request.cookies.has(TOKEN_COOKIE)) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("next", pathname + search);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/checkout/:path*", "/orders/:path*", "/profile"],
};
