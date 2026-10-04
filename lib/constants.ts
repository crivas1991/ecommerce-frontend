/** Nombre de la cookie httpOnly donde se guarda el token de Sanctum. */
export const TOKEN_COOKIE = "token";

/** Rutas que exigen sesión (las usa proxy.ts). */
export const PROTECTED_PATHS = ["/checkout", "/orders", "/profile"];
