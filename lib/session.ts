import "server-only";
import { cache } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { User } from "@/types";
import { TOKEN_COOKIE } from "@/lib/constants";
import { apiFetch } from "@/lib/api/client";
import { ApiError } from "@/lib/api/errors";

const SEVEN_DAYS = 60 * 60 * 24 * 7;

export async function setSession(token: string) {
  (await cookies()).set(TOKEN_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SEVEN_DAYS,
  });
}

export async function clearSession() {
  (await cookies()).delete(TOKEN_COOKIE);
}

/**
 * Usuario autenticado o null. Va envuelto en cache() para que Header, páginas y
 * componentes compartan una sola llamada a /auth/me por request.
 */
export const getCurrentUser = cache(async (): Promise<User | null> => {
  const token = (await cookies()).get(TOKEN_COOKIE)?.value;
  if (!token) return null;

  try {
    const { user } = await apiFetch<{ user: User }>("/auth/me");
    return user;
  } catch (error) {
    // Token vencido o revocado: se trata como "sin sesión".
    if (error instanceof ApiError && error.status === 401) return null;
    throw error;
  }
});

/**
 * Para páginas protegidas: redirige a /login si no hay sesión válida.
 * Si la cookie existe pero la API ya no la acepta (vencida/revocada), pasa por
 * /api/auth/expired para eliminarla.
 */
export async function requireUser(returnTo: string): Promise<User> {
  const user = await getCurrentUser();
  if (user) return user;

  const next = encodeURIComponent(returnTo);
  const hasStaleCookie = (await cookies()).has(TOKEN_COOKIE);
  redirect(hasStaleCookie ? `/api/auth/expired?next=${next}` : `/login?next=${next}`);
}

/** Solo acepta rutas internas para evitar open redirects en ?next=. */
export function safeRedirectPath(value: FormDataEntryValue | string | null | undefined): string {
  if (typeof value === "string" && value.startsWith("/") && !value.startsWith("//")) {
    return value;
  }
  return "/";
}
