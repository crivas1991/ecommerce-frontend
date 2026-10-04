import "server-only";
import { cookies } from "next/headers";
import type { ApiErrorBody } from "@/types";
import { TOKEN_COOKIE } from "@/lib/constants";
import { ApiError } from "./errors";

interface ApiFetchOptions {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: unknown;
  /** Si es false no se envía el token (lecturas públicas, login, registro). */
  auth?: boolean;
  /** Opciones de caché de Next para fetch (revalidate, tags). */
  next?: NextFetchRequestConfig;
  cache?: RequestCache;
}

function getBaseUrl(): string {
  const url = process.env.API_BASE_URL;
  if (!url) {
    throw new Error("Falta la variable de entorno API_BASE_URL (revisa .env.example).");
  }
  return url.replace(/\/$/, "");
}

/**
 * Cliente único para hablar con la API de Laravel. Solo corre en el servidor,
 * así el token (cookie httpOnly) nunca llega al JavaScript del navegador.
 */
export async function apiFetch<T>(path: string, options: ApiFetchOptions = {}): Promise<T> {
  const { method = "GET", body, auth = true, next, cache } = options;

  const headers: Record<string, string> = { Accept: "application/json" };
  if (body !== undefined) headers["Content-Type"] = "application/json";

  if (auth) {
    const token = (await cookies()).get(TOKEN_COOKIE)?.value;
    if (token) headers.Authorization = `Bearer ${token}`;
  }

  let response: Response;
  try {
    response = await fetch(`${getBaseUrl()}${path}`, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
      next,
      cache,
    });
  } catch {
    throw new ApiError(0, "No se pudo conectar con el servidor. Inténtalo más tarde.");
  }

  // La API puede responder sin JSON (HTML de un 500, cuerpo vacío...), no asumimos nada.
  const text = await response.text();
  let data: unknown = null;
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = null;
    }
  }

  if (!response.ok) {
    const errorBody = (data ?? {}) as ApiErrorBody;
    throw new ApiError(
      response.status,
      errorBody.message || `Error ${response.status} al consultar la API.`,
      errorBody.errors,
    );
  }

  return data as T;
}
